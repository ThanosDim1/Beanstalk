const { expect } = require("chai");
const { deploy } = require("../scripts/deploy.js");
const { readPrune, toBN, } = require("../utils");
const { EXTERNAL } = require("./utils/balances.js");
const { BEAN, BEAN_3_CURVE, UNRIPE_LP, UNRIPE_BEAN, THREE_CURVE, BEAN_ETH_WELL, WETH, BEAN_WSTETH_WELL, ZERO_ADDRESS } = require("./utils/constants");
const { to18, to6, toStalk } = require("./utils/helpers.js");
const { takeSnapshot, revertToSnapshot } = require("./utils/snapshot");
const { impersonateMockWell } = require("../utils/well.js");
const ZERO_BYTES = ethers.utils.formatBytes32String("0x0");

let user, user2, owner;
let userAddress, ownerAddress, user2Address;

const ENROOT_FIX_SEASON = 12793

let pru;

function pruneToSeeds(value, seeds = 2) {
  return prune(value).mul(seeds);
}

function pruneToStalk(value) {
  return prune(value).mul(toBN("10000"));
}

function prune(value) {
  return toBN(value).mul(toBN(pru)).div(to18("1"));
}

describe("Silo Enroot", function () {
  before(async function () {
    pru = await readPrune();
    [owner, user, user2] = await ethers.getSigners();
    userAddress = user.address;
    user2Address = user2.address;

    // Setup mock facets for manipulating Beanstalk's state during tests
    const contracts = await deploy("Test", false, true);
    ownerAddress = contracts.account;
    this.diamond = contracts.beanstalkDiamond;
    this.season = await ethers.getContractAt('MockSeasonFacet', this.diamond.address);
    this.silo = await ethers.getContractAt('MockSiloFacet', this.diamond.address);
    this.siloGetters = await ethers.getContractAt('SiloGettersFacet', this.diamond.address);
    this.convert = await ethers.getContractAt('ConvertFacet', this.diamond.address);
    this.unripe = await ethers.getContractAt('MockUnripeFacet', this.diamond.address);
    this.migrate = await ethers.getContractAt('MigrationFacet', this.diamond.address);
    this.enroot = await ethers.getContractAt('EnrootFacet', this.diamond.address);

    await this.season.teleportSunrise(ENROOT_FIX_SEASON)

    const [well, pump, wellFunction] = await impersonateMockWell(BEAN_WSTETH_WELL, pumpBalances = [to6('10000'), to18('10')]);
    this.well = well; this.pump = pump; this.wellFunction = wellFunction;

    const SiloToken = await ethers.getContractFactory("MockToken");
    this.siloToken = await SiloToken.deploy("Silo", "SILO");
    await this.siloToken.deployed();

    await this.silo.mockWhitelistToken(this.siloToken.address, this.silo.interface.getSighash("mockBDV(uint256 amount)"), "10000", "1");

    await this.siloToken.connect(user).approve(this.silo.address, '100000000000');
    await this.siloToken.connect(user2).approve(this.silo.address, '100000000000');
    await this.siloToken.mint(userAddress, '10000');
    await this.siloToken.mint(user2Address, '10000');

    await this.siloToken.connect(owner).approve(this.silo.address, to18('10000'));
    await this.siloToken.mint(ownerAddress, to18('10000'));

    this.unripeBeans = await ethers.getContractAt("MockToken", UNRIPE_BEAN);
    await this.unripeBeans.connect(user).mint(userAddress, to6("10000"));
    await this.unripeBeans.connect(user).approve(this.silo.address, to18("10000"));
    await this.unripe.addUnripeToken(UNRIPE_BEAN, this.siloToken.address, ZERO_BYTES);
    await this.unripe.connect(owner).addUnderlying(UNRIPE_BEAN, to6("10000").mul(toBN(pru)).div(to18("1")));

    this.unripeLP = await ethers.getContractAt("MockToken", UNRIPE_LP);
    await this.unripeLP.connect(user).mint(userAddress, to6("10000"));
    await this.unripeLP.connect(user).approve(this.silo.address, to18("10000"));
    await this.unripe.addUnripeToken(UNRIPE_LP, this.siloToken.address, ZERO_BYTES);
    await this.unripe.connect(owner).addUnderlying(UNRIPE_LP, toBN(pru).mul(toBN("10000")));

    this.beanThreeCurve = await ethers.getContractAt("MockMeta3Curve", BEAN_3_CURVE);
    await this.beanThreeCurve.set_supply(ethers.utils.parseEther("2000000"));
    await this.beanThreeCurve.set_balances([ethers.utils.parseUnits("1000000", 6), ethers.utils.parseEther("1000000")]);
    await this.beanThreeCurve.set_balances([ethers.utils.parseUnits("1200000", 6), ethers.utils.parseEther("1000000")]);

  });

  beforeEach(async function () {
    snapshotId = await takeSnapshot();
  });

  afterEach(async function () {
    await revertToSnapshot(snapshotId);
  });


  describe("Update Unripe Deposit", async function () {

    it("enrootDeposit fails if not unripe token", async function () {
      await expect(this.enroot.connect(user).enrootDeposit(BEAN, '1', '1')).to.be.revertedWith("Silo: token not unripe")
    })

    it("enrootDeposits fails if not unripe token", async function () {
      await expect(this.enroot.connect(user).enrootDeposits(BEAN, ['1'], ['1'])).to.be.revertedWith("Silo: token not unripe")
    })

    describe("1 deposit, some", async function () {
      beforeEach(async function () {
        this.season.deployStemsUpgrade();

        await this.silo.connect(user).depositLegacy(UNRIPE_BEAN, to6('5'), EXTERNAL)
        await this.silo.connect(user).mockUnripeBeanDeposit(ENROOT_FIX_SEASON, to6('5'))

        await this.unripe.connect(owner).addUnderlying(
          UNRIPE_BEAN,
          to6('1000')
        )

        const stem10 = await this.silo.mockSeasonToStem(UNRIPE_BEAN, ENROOT_FIX_SEASON);
        // migrate to new deposit system since the mock stuff deposits in old one (still useful to test)
        await this.migrate.mowAndMigrate(user.address, [UNRIPE_BEAN], [[ENROOT_FIX_SEASON]], [[to6('10')]], 0, 0, []);
        // call sunrise twice to finish germination process.
        this.result = await this.enroot.connect(user).enrootDeposit(UNRIPE_BEAN, stem10, to6('5'));
      })

      it('properly updates the total balances', async function () {
        expect(await this.siloGetters.getTotalDeposited(UNRIPE_BEAN)).to.eq(to6('10'));
        expect(await this.siloGetters.getTotalDepositedBdv(UNRIPE_BEAN)).to.eq(pruneToStalk(to6('10')).add(toStalk('0.5')).div('10000'));
        expect(await this.siloGetters.totalStalk()).to.eq(pruneToStalk(to6('10')).add(toStalk('0.5')));
      });

      it('properly updates the user balance', async function () {
        expect(await this.siloGetters.balanceOfStalk(userAddress)).to.eq(pruneToStalk(to6('10')).add(toStalk('0.5')));
        expect(await this.siloGetters.balanceOfGerminatingStalk(userAddress)).to.eq('0');
      });

      it('properly removes the crate', async function () {
        const stem10 = await this.silo.mockSeasonToStem(this.siloToken.address, ENROOT_FIX_SEASON);
        let dep = await this.siloGetters.getDeposit(userAddress, UNRIPE_BEAN, stem10);
        
        expect(dep[0]).to.equal(to6('10'))
        expect(dep[1]).to.equal(prune(to6('10')).add(to6('0.5')))
      });

      it('emits Remove and Add Deposit event', async function () {
        const stem10 = await this.silo.mockSeasonToStem(this.siloToken.address, ENROOT_FIX_SEASON);
        await expect(this.result).to.emit(this.enroot, 'RemoveDeposit').withArgs(userAddress, UNRIPE_BEAN, stem10, to6('5'), '927823');
        await expect(this.result).to.emit(this.silo, 'AddDeposit').withArgs(userAddress, UNRIPE_BEAN, stem10, to6('5'), prune(to6('5')).add(to6('0.5')));
      });
    });

    describe("1 deposit after 1 season, all", async function () {
      beforeEach(async function () {
        this.season.deployStemsUpgrade();

        await this.silo.connect(user).depositLegacy(UNRIPE_BEAN, to6('5'), EXTERNAL) //need to do legacy deposit to simulate pre-stems upgrade
        await this.silo.connect(user).mockUnripeBeanDeposit(ENROOT_FIX_SEASON, to6('5'))
        
        await this.season.lightSunrise()

        await this.unripe.connect(owner).addUnderlying(
          UNRIPE_BEAN,
          to6('5000').sub(to6('10000').mul(toBN(pru)).div(to18('1')))
        )

        // const stem10 = await this.silo.mockSeasonToStem(UNRIPE_BEAN, '10');

        await this.migrate.mowAndMigrate(user.address, [UNRIPE_BEAN], [[ENROOT_FIX_SEASON]], [[to6('10')]], 0, 0, []);

        this.result = await this.enroot.connect(user).enrootDeposit(UNRIPE_BEAN, '0', to6('10'));
      })

      it('properly updates the total balances', async function () {
        expect(await this.siloGetters.getTotalDeposited(UNRIPE_BEAN)).to.eq(to6('10'));
        expect(await this.siloGetters.getGerminatingTotalDeposited(UNRIPE_BEAN)).to.eq('0');

        expect(await this.siloGetters.getTotalDepositedBdv(UNRIPE_BEAN)).to.eq(to6('5'));
        expect(await this.siloGetters.getGerminatingTotalDepositedBdv(UNRIPE_BEAN)).to.eq('0');
        
        expect(await this.siloGetters.totalStalk()).to.eq(toStalk('5.001'));
      });

      it('properly updates the user balance', async function () {
        expect(await this.siloGetters.balanceOfStalk(userAddress)).to.eq(toStalk('5.001'));
      });

      it('properly removes the crate', async function () {
        const stem10 = await this.silo.mockSeasonToStem(UNRIPE_BEAN, ENROOT_FIX_SEASON);
        let dep = await this.siloGetters.getDeposit(userAddress, UNRIPE_BEAN, stem10);
        expect(dep[0]).to.equal(to6('10'))
        expect(dep[1]).to.equal(to6('5'))
      });

      it('emits Remove and Add Deposit event', async function () {
        const stem10 = await this.silo.mockSeasonToStem(UNRIPE_BEAN, ENROOT_FIX_SEASON);
        await expect(this.result).to.emit(this.enroot, 'RemoveDeposit').withArgs(userAddress, UNRIPE_BEAN, stem10, to6('10'), '1855646');
        await expect(this.result).to.emit(this.silo, 'AddDeposit').withArgs(userAddress, UNRIPE_BEAN, stem10, to6('10'), to6('5'));
      });
    });

    describe("2 deposit, all", async function () {
      beforeEach(async function () {
        await this.silo.connect(user).mockUnripeBeanDeposit(ENROOT_FIX_SEASON, to6('5'))

        await this.season.lightSunrise()
        await this.silo.connect(user).depositLegacy(UNRIPE_BEAN, to6('5'), EXTERNAL)
        
        this.season.deployStemsUpgrade();
        
        await this.unripe.connect(owner).addUnderlying(
          UNRIPE_BEAN,
          to6('5000').sub(to6('10000').mul(toBN(pru)).div(to18('1')))
        )


        await this.migrate.mowAndMigrate(user.address, [UNRIPE_BEAN], [[ENROOT_FIX_SEASON, ENROOT_FIX_SEASON+1]], [[to6('5'), to6('5')]], 0, 0, []);

        const stem10 = await this.silo.mockSeasonToStem(UNRIPE_BEAN, ENROOT_FIX_SEASON);

        const stem11 = await this.silo.mockSeasonToStem(UNRIPE_BEAN, ENROOT_FIX_SEASON+1);
        this.result = await this.enroot.connect(user).enrootDeposits(UNRIPE_BEAN, [stem10, stem11], [to6('5'), to6('5')]);
      })

      it('properly updates the total balances', async function () {
        expect(await this.siloGetters.getTotalDeposited(UNRIPE_BEAN)).to.eq(to6('10'));
        expect(await this.siloGetters.getTotalDepositedBdv(UNRIPE_BEAN)).to.eq(to6('5'));
        expect(await this.siloGetters.totalStalk()).to.eq(toStalk('5.0005'));
      });

      it('properly updates the user balance', async function () {
        expect(await this.siloGetters.balanceOfStalk(userAddress)).to.eq(toStalk('5.0005'));
      });

      it('properly removes the crate', async function () {
        const stem10 = await this.silo.mockSeasonToStem(UNRIPE_BEAN, ENROOT_FIX_SEASON);
        let dep = await this.siloGetters.getDeposit(userAddress, UNRIPE_BEAN, stem10);
        expect(dep[0]).to.equal(to6('5'))
        expect(dep[1]).to.equal(to6('2.5'))
      });

      it('emits Remove and Add Deposits event', async function () {
        const stem10 = await this.silo.mockSeasonToStem(UNRIPE_BEAN, ENROOT_FIX_SEASON);
        const stem11 = await this.silo.mockSeasonToStem(UNRIPE_BEAN, ENROOT_FIX_SEASON+1);
        await expect(this.result).to.emit(this.silo, 'RemoveDeposits').withArgs(userAddress, UNRIPE_BEAN, [stem10,stem11], [to6('5'), to6('5')], to6('10'), ['927823', '927823']);
        await expect(this.result).to.emit(this.silo, 'AddDeposit').withArgs(userAddress, UNRIPE_BEAN, stem10, to6('5'), to6('2.5'));
        await expect(this.result).to.emit(this.silo, 'AddDeposit').withArgs(userAddress, UNRIPE_BEAN, stem11, to6('5'), to6('2.5'));
      });

      it('omits TransferBatch event', async function () {
        await expect(this.result).to.not.emit(this.silo, 'TransferBatch')
      });
    });

    describe("2 deposit, round", async function () {

      beforeEach(async function () {
        await this.unripe.connect(owner).addUnderlying(UNRIPE_LP, '147796000000000')
        this.fertilizer = await ethers.getContractAt('MockFertilizerFacet', this.diamond.address)
        await this.fertilizer.setBarnRaiseWell(BEAN_WSTETH_WELL);
        await this.silo.connect(user).mockUnripeLPDeposit('0', ENROOT_FIX_SEASON, to18('0.000000083406453'), to6('10'))
        await this.season.lightSunrise()
        await this.silo.connect(user).mockUnripeLPDeposit('0', ENROOT_FIX_SEASON+1, to18('0.000000083406453'), to6('10'))

        this.season.deployStemsUpgrade();
        await this.migrate.mowAndMigrate(user.address, [UNRIPE_LP], [[ENROOT_FIX_SEASON, ENROOT_FIX_SEASON+1]], [[to6('10'), to6('10')]], 0, 0, []);

        const stem10 = await this.silo.mockSeasonToStem(UNRIPE_LP, ENROOT_FIX_SEASON);
        const stem11 = await this.silo.mockSeasonToStem(UNRIPE_LP, ENROOT_FIX_SEASON+1);
        this.result = await this.enroot.connect(user).enrootDeposits(UNRIPE_LP, [stem10, stem11], [to6('10'), to6('10')]);
      })
  
      it('properly updates the total balances', async function () {
        expect(await this.siloGetters.getTotalDeposited(UNRIPE_LP)).to.eq(to6('20'));
        expect(await this.siloGetters.balanceOfStalk(userAddress)).to.eq(toStalk('234.7639163944'));
        expect(await this.silo.balanceOfSeeds(userAddress)).to.eq('0');
      });
  
      it('properly updates the user balance', async function () {
        expect(await this.siloGetters.balanceOfStalk(userAddress)).to.eq(toStalk('234.7639163944'));
        expect(await this.silo.balanceOfSeeds(userAddress)).to.eq('0');
      });
  
      it('properly updates the crate', async function () {
        const bdv = await this.siloGetters.bdv(UNRIPE_LP, to6('20'))
        const stem10 = await this.silo.mockSeasonToStem(UNRIPE_LP, ENROOT_FIX_SEASON);
        let dep = await this.siloGetters.getDeposit(userAddress, UNRIPE_LP, stem10);
        expect(dep[0]).to.equal(to6('10'))
        expect(dep[1]).to.equal(bdv.div('2'))
        const stem11 = await this.silo.mockSeasonToStem(UNRIPE_LP, ENROOT_FIX_SEASON+1);
        dep = await this.siloGetters.getDeposit(userAddress, UNRIPE_LP, stem11);
        expect(dep[0]).to.equal(to6('10'))
        expect(dep[1]).to.equal(bdv.sub('1').div('2').add('1'))
      });

      it('omits TransferBatch event', async function () {
        await expect(this.result).to.not.emit(this.silo, 'TransferBatch');
      });
    });
  });
});
