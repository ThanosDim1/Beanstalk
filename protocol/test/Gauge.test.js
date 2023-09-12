const { expect } = require('chai')
const { deploy } = require('../scripts/deploy.js')
const { takeSnapshot, revertToSnapshot } = require("./utils/snapshot")
const { to6, toStalk, toBean, to18 } = require('./utils/helpers.js');
const { USDC, UNRIPE_BEAN, UNRIPE_LP, BEAN, THREE_CURVE, THREE_POOL, BEAN_3_CURVE, BEAN_ETH_WELL, BEANSTALK_PUMP } = require('./utils/constants.js');
const { EXTERNAL, INTERNAL } = require('./utils/balances.js');
const { ethers } = require('hardhat');
const { advanceTime } = require('../utils/helpers.js');
const { deployMockWell, whitelistWell, deployMockWellWithMockPump } = require('../utils/well.js');
const { setEthUsdPrice, setEthUsdcPrice, setEthUsdtPrice } = require('../scripts/usdOracle.js');
const ZERO_BYTES = ethers.utils.formatBytes32String('0x0')

let user, user2, owner;
let userAddress, ownerAddress, user2Address;

async function setToSecondsAfterHour(seconds = 0) {
  const lastTimestamp = (await ethers.provider.getBlock('latest')).timestamp;
  const hourTimestamp = parseInt(lastTimestamp/3600 + 1) * 3600 + seconds
  await network.provider.send("evm_setNextBlockTimestamp", [hourTimestamp])
}


describe('Gauge', function () {
  before(async function () {
    [owner, user] = await ethers.getSigners()
    userAddress = user.address;
    const contracts = await deploy("Test", false, true)
    ownerAddress = contracts.account;
    this.diamond = contracts.beanstalkDiamond;
    this.silo = await ethers.getContractAt('MockSiloFacet', this.diamond.address)
    this.field = await ethers.getContractAt('MockFieldFacet', this.diamond.address)
    this.season = await ethers.getContractAt('MockSeasonFacet', this.diamond.address)
    this.seasonGetter = await ethers.getContractAt('SeasonGetterFacet', this.diamond.address)
    this.unripe = await ethers.getContractAt('MockUnripeFacet', this.diamond.address)
    this.fertilizer = await ethers.getContractAt('MockFertilizerFacet', this.diamond.address)
    this.bean = await ethers.getContractAt('MockToken', BEAN);
    await this.bean.connect(owner).approve(this.diamond.address, to6('100000000'))

  
    // set balances to bean3crv
    this.threePool = await ethers.getContractAt('Mock3Curve', THREE_POOL);
    await this.threePool.set_virtual_price(to18('1'));
    this.beanThreeCurve = await ethers.getContractAt('MockMeta3Curve', BEAN_3_CURVE);
    await this.beanThreeCurve.set_supply(toBean('2000000'));
    // bean3crv set at parity, 1,000,000 on each side.
    await this.beanThreeCurve.set_balances([to6('1000000'), to18('1000000')]);
    await this.beanThreeCurve.set_balances([to6('1000000'), to18('1000000')]);


    // add unripe
    this.unripeBean = await ethers.getContractAt('MockToken', UNRIPE_BEAN)
    this.unripeLP = await ethers.getContractAt('MockToken', UNRIPE_LP)
    await this.unripeLP.mint(ownerAddress, to6('10000'))
    await this.unripeBean.mint(ownerAddress, to6('10000'))
    await this.unripeLP.connect(owner).approve(this.diamond.address, to6('100000000'))
    await this.unripeBean.connect(owner).approve(this.diamond.address, to6('100000000'))
    await this.unripe.addUnripeToken(UNRIPE_BEAN, BEAN, ZERO_BYTES)
    await this.unripe.addUnripeToken(UNRIPE_LP, BEAN_ETH_WELL, ZERO_BYTES);

    // init wells
    [this.well, this.wellFunction, this.pump] = await deployMockWellWithMockPump()
    await this.well.setReserves([to6('1000000'), to18('1000')])
    await this.well.connect(owner).mint(ownerAddress, to18('1000'))
    await this.season.siloSunrise(0)
    await whitelistWell(this.well.address, '10000', to6('4.5'));
    await this.season.captureWellE(this.well.address);

    await setEthUsdPrice('999.998018')
    await setEthUsdcPrice('1000')
    await setEthUsdtPrice('1000')
  })

  beforeEach(async function () {
    snapshotId = await takeSnapshot()
  })

  afterEach(async function () {
    await revertToSnapshot(snapshotId)
  })

  describe('Percent new grown stalk to LP', function () {
    // MockInitDiamond initalizes percentOfNewGrownStalkToLP to 50% (50e6)

    describe('L2SR > 75%', function () {
      it("increases Percent to LP significantly", async function () {
        this.result = await this.season.seedGaugeSunSunrise('0', 96);
        expect(await this.seasonGetter.getPercentOfNewGrownStalkToLP()).to.be.equal('49500000');
        await expect(this.result).to.emit(this.season, 'GrownStalkToLPChange')
          .withArgs(
            3,     // season
            96,    // caseId
            10000, // relative change (100% of original) 
            -50    // absolute change (-0.5%)
          );
      })
    });

    describe('50% < L2SR < 75%', function () {
      it("increases Percent to LP moderately", async function () {
        this.result = await this.season.seedGaugeSunSunrise('0', 64);
        expect(await this.seasonGetter.getPercentOfNewGrownStalkToLP()).to.be.equal('49750000');
        await expect(this.result).to.emit(this.season, 'GrownStalkToLPChange')
          .withArgs(
            3, // season
            64, // caseId
            10000, // relative multiplier 
            -25 // absolute change (-0.5%)
          );
      })
    });

    describe('25% < L2SR < 50%', function () {
      it("decreases Percent to LP moderately", async function () {
        this.result = await this.season.seedGaugeSunSunrise('0', 32);
        expect(await this.seasonGetter.getPercentOfNewGrownStalkToLP()).to.be.equal('50250000');
        await expect(this.result).to.emit(this.season, 'GrownStalkToLPChange')
          .withArgs(
            3, // season
            32, // caseId
            10000, // relative multiplier 
            25 // absolute change (-0.5%)
          );
      })
    });

    describe('L2SR < 25%', function () {
      it("increases Percent to LP significantly", async function () {
        this.result = await this.season.seedGaugeSunSunrise('0', 0);
        expect(await this.seasonGetter.getPercentOfNewGrownStalkToLP()).to.be.equal('50500000');
        await expect(this.result).to.emit(this.season, 'GrownStalkToLPChange')
          .withArgs(
            3, // season
            0, // caseId
            10000, // relative multiplier 
            50 // absolute change (-0.5%)
          );
      })
    });

    it("L2SR cannot go under 0%", async function () {
      await this.season.setPercentOfNewGrownStalkToLP(0.4e6);
      this.result = await this.season.seedGaugeSunSunrise('0', 96);
      expect(await this.seasonGetter.getPercentOfNewGrownStalkToLP()).to.be.equal('0');
      await expect(this.result).to.emit(this.season, 'GrownStalkToLPChange')
        .withArgs(
          3,     // season
          96,    // caseId
          10000, // relative change (100% of original) 
          -40    // absolute change (-0.4%)
        );
    })

    it("LS2R cannot go above 100%", async function () {
      await this.season.setPercentOfNewGrownStalkToLP(99.9e6);
      this.result = await this.season.seedGaugeSunSunrise('0', 0);
      expect(await this.seasonGetter.getPercentOfNewGrownStalkToLP()).to.be.equal(to6('100'));
      await expect(this.result).to.emit(this.season, 'GrownStalkToLPChange')
        .withArgs(
          3,     // season
          0,    // caseId
          10000, // relative change (100% of original) 
          10    // absolute change (+0.1%)
        );
    })

  })

  describe('L2SR calculation', function () {
    describe("getter", function () {

      it('inital state', async function () {
        // bean:eth has a ratio of 1000:1 (1m beans),
        // bean:3crv has a ratio of 1:1 (1m beans)
        // total supply of bean should be 2m, with 0 circulating.
        // note precision error due to rounding. 
        await this.bean.mint(ownerAddress, to6('2000000'));
        expect(
          await this.seasonGetter.getLiquidityToSupplyRatio()
          ).to.be.within(to18('1.999999'),to18('2'));
      })

      it('returns 0 if no liquidity', async function () {
        await this.bean.mint(ownerAddress, to6('2000000'));
        await this.pump.setInstantaneousReserves([to6('0'), to18('0')])
        await this.beanThreeCurve.set_balances([to6('0'), to18('0')]);
        await this.beanThreeCurve.set_balances([to6('0'), to18('0')]);

        expect(
          await this.seasonGetter.getLiquidityToSupplyRatio()
        ).to.be.equal(0);
      })

      it('returns 0 if no supply', async function () {
        this.beanSupply = await this.bean.totalSupply();
        this.result = await this.seasonGetter.getLiquidityToSupplyRatio();
        await expect(this.beanSupply).to.be.equal(0);
        await expect(this.result).to.be.equal(0);
      }) 

      it('decreases', async function () {
        await this.bean.mint(ownerAddress, to6('2000000'));
        initalL2SR = await this.seasonGetter.getLiquidityToSupplyRatio();
        
        await this.bean.mint(ownerAddress, to6('2000000'));
        newL2SR = await this.seasonGetter.getLiquidityToSupplyRatio();

        expect(newL2SR).to.be.within(to18('0.999999'),to18('1'));
        expect(newL2SR).to.be.lt(initalL2SR);


      })

      it('increases', async function () {
        await this.bean.mint(ownerAddress, to6('2000000'));
        initalL2SR = await this.seasonGetter.getLiquidityToSupplyRatio();

        await this.bean.connect(owner).burn(to6('1000000'));
        newL2SR = await this.seasonGetter.getLiquidityToSupplyRatio();

        expect(newL2SR).to.be.within(to18('3.999999'),to18('4'));
        expect(newL2SR).to.be.gt(initalL2SR);
      })
    })

    // when beanstalk has outstanding fertilizer (aka unripe assets)
    // a portion of the supply is locked, due to the difference between
    // the underlying amount and redemption price. 
    // thus the supply can be reduced.
    // TODO
    describe('with unripe', function() {
      before(async function() {
        await this.bean.mint(ownerAddress, to6('2000000'));
        // enable fertilizer, 10000 sprouts unfertilized
        await this.fertilizer.setFertilizerE(true, to6('10000'))
        // TODO: add unripe after merging with brendans changes
        // await this.unripe.connect(owner).addUnderlying(
        //   UNRIPE_LP,
        //   to6('1000')
        // )

        // add 1000 LP to 10,000 unripe
        await this.fertilizer.connect(owner).setPenaltyParams(to6('100'), to6('1000'))
      })

      it('getters', async function () {
        // 100% - 10% recapitalization (underlyingBean/UrBean) * 10% (fertilizerIndex/totalFertilizer)
        // 99% underlying bean of urBEAN is locked
        // = 900 beans locked. 
        expect(await this.unripe.getLockedBeans()).to.be.eq(to6('900'));
        expect(
          await this.seasonGetter.getLiquidityToSupplyRatio()
          ).to.be.eq(to18('2.000900405181831824'));
        
      })
    })
  })
  
  
})