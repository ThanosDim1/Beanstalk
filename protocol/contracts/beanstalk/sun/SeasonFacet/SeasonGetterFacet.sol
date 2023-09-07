// SPDX-License-Identifier: MIT

pragma solidity =0.7.6;
pragma experimental ABIEncoderV2;

import "../../AppStorage.sol";
import "../../../C.sol";
import {Decimal, SafeMath} from "contracts/libraries/Decimal.sol";
import {LibIncentive} from "contracts/libraries/LibIncentive.sol";
import {LibEvaluate} from "contracts/libraries/LibEvaluate.sol";
import {LibCurveMinting} from "contracts/libraries/Minting/LibCurveMinting.sol";
import {LibWellMinting} from "contracts/libraries/Minting/LibWellMinting.sol";
import {LibWell} from "contracts/libraries/Well/LibWell.sol";
import {SignedSafeMath} from "@openzeppelin/contracts/math/SignedSafeMath.sol";
import {LibWhitelistedTokens} from "contracts/libraries/Silo/LibWhitelistedTokens.sol";


/**
 * @title SeasonGetterFacet
 * @author Publius, Chaikitty
 * @notice Holds Getter view functions for the SeasonFacet.
 */
contract SeasonGetterFacet {
    using SafeMath for uint256;
    using SignedSafeMath for int256;

    AppStorage internal s;

    // 24 * 30 * 6
    uint256 private constant TARGET_SEASONS_TO_CATCHUP = 4380;
    uint256 private constant PRECISION = 1e6;

    event PercentGrownStalkToLP(uint256 newPercentGrownStalkToLP);

    //////////////////// SEASON GETTERS ////////////////////

    /**
     * @notice Returns the current Season number.
     */
    function season() public view returns (uint32) {
        return s.season.current;
    }

    /**
     * @notice Returns whether Beanstalk is Paused. When Paused, the `sunrise()` function cannot be called.
     */
    function paused() public view returns (bool) {
        return s.paused;
    }

    /**
     * @notice Returns the Season struct. See {Storage.Season}.
     */
    function time() external view returns (Storage.Season memory) {
        return s.season;
    }

    /**
     * @notice Returns whether Beanstalk started this Season above or below peg.
     */
    function abovePeg() external view returns (bool) {
        return s.season.abovePeg;
    }

    /**
     * @notice Returns the block during which the current Season started.
     */
    function sunriseBlock() external view returns (uint32){
        return s.season.sunriseBlock;
    }

    /**
     * @notice Returns the current Weather struct. See {AppStorage:Storage.Weather}.
     */
    function weather() public view returns (Storage.Weather memory) {
        return s.w;
    }

    /**
     * @notice Returns the current Rain struct. See {AppStorage:Storage.Rain}.
     */
    function rain() public view returns (Storage.Rain memory) {
        return s.r;
    }

    /**
     * @notice Returns the Plenty per Root for `season`.
     */
    function plentyPerRoot(uint32 _season) external view returns (uint256) {
        return s.sops[_season];
    }

    //////////////////// WEATHER INTERNAL ////////////////////

    /**
     * @notice view function of {calcCaseId}, outputs the expected caseId based on 
     * deltaB, podrate, change in soil demand, and lp to supply ratio.
     * @param deltaB Pre-calculated deltaB from {Oracle.stepOracle}.
     */
    function getCaseId(int256 deltaB) internal view returns (uint256 caseId) {
        uint256 beanSupply = C.bean().totalSupply();

        // Prevent infinite pod rate
        if (beanSupply == 0) {
            return 8; // Reasonably low
        }

        // Calculate Pod Rate
        Decimal.D256 memory podRate = Decimal.ratio(
            s.f.pods.sub(s.f.harvestable), // same as totalUnharvestable()
            beanSupply
        );

        // Calculate Delta Soil Demand
        Decimal.D256 memory deltaPodDemand;
        (deltaPodDemand, ,) = LibEvaluate.calcDeltaPodDemand(s.f.beanSown);

        // Calculate Lp To Supply Ratio
        Decimal.D256 memory lpToSupplyRatio;
        // TODO

        caseId = LibEvaluate.evaluateBeanstalk(
            deltaB, 
            podRate,
            deltaPodDemand, 
            lpToSupplyRatio
        );
    }


    //////////////////// ORACLE GETTERS ////////////////////

    /**
     * @notice Returns the total Delta B across all whitelisted minting liquidity pools.
     * @dev The whitelisted pools are:
     * - the Bean:3Crv Metapool
     * - the Bean:ETH Well
     */
    function totalDeltaB() external view returns (int256 deltaB) {
        deltaB = LibCurveMinting.check().add(
            LibWellMinting.check(C.BEAN_ETH_WELL)
        );
    }

    /**
     * @notice Returns the current Delta B for the requested pool.
     */
    function poolDeltaB(address pool) external view returns (int256) {
        if (pool == C.CURVE_BEAN_METAPOOL) return LibCurveMinting.check();
        if (LibWell.isWell(pool)) return LibWellMinting.check(pool);
        revert("Oracle: Pool not supported");
    }

    /**
     * @notice Returns thelast Well Oracle Snapshot for a given `well`.
     * @return snapshot The encoded cumulative balances the last time the Oracle was captured.
     */
    function wellOracleSnapshot(address well) external view returns (bytes memory snapshot) {
        snapshot = s.wellOracleSnapshots[well];
    }

    /**
     * @notice Returns the last Curve Oracle data snapshot for the Bean:3Crv Pool.
     * @return co The last Curve Oracle data snapshot.
     */
    function curveOracle() external view returns (Storage.CurveMetapoolOracle memory co) {
        co = s.co;
        co.timestamp = s.season.timestamp; // use season timestamp for oracle
    }

    //////////////////// SEED GAUGE GETTERS ////////////////////

    /**
     * @notice returns the average grown stalk per BDV .
     */
    function getAverageGrownStalkPerBdv() public view returns (uint256) {
        return (s.s.stalk / getTotalBdv()) - 10000; // TODO: Check constant
    }

    /**
     * @notice updates the averageGrownStalkPerBdvPerSeason in the seed gauge.
     * @dev anyone can call this function to update. Currently, the function 
     * updates the averageGrownStalkPerBdvPerSeason such that it will take 6 months
     * for the average new depositer to catch up to the average grown stalk per BDV.
     * 
     * The expectation is that actors will call this function on their own as it benefits them.
     * Newer depositers will call it if the value increases to catch up to the average faster,
     * Older depositers will call it if the value decreases to slow down their rate of dilution.
     */
    function updateAverageGrownStalkPerBdvPerSeason() external {
        s.seedGauge.averageGrownStalkPerBdvPerSeason = uint128(
            getAverageGrownStalkPerBdv().mul(PRECISION).div(TARGET_SEASONS_TO_CATCHUP)
        );
        emit PercentGrownStalkToLP(s.seedGauge.averageGrownStalkPerBdvPerSeason);
    }

    /**
     * @notice returns the total BDV in beanstalk.
     * @dev the total BDV may differ from the instaneous BDV,
     * as BDV is asyncronous. 
     */
    function getTotalBdv() internal view returns (uint256 totalBdv) {
        address[] memory whitelistedSiloTokens = LibWhitelistedTokens.getSiloTokens(); 
        // TODO: implment the decrement deposited BDV thing for unripe
        for (uint256 i; i < whitelistedSiloTokens.length; ++i) {
            totalBdv = totalBdv.add(s.siloBalances[whitelistedSiloTokens[i]].depositedBdv);
        }
    }

    /**
     * @notice returns the seed gauge struct.
     */
    function getSeedGauge() external view returns (Storage.SeedGauge memory) {
        return s.seedGauge;
    }
    
    /**
     * @notice returns the average grown stalk per BDV per season. 
     * @dev 6 decimal precision (1 GrownStalkPerBdvPerSeason = 1e6);
     * note that stalk has 10 decimals. 
     */
    function getAverageGrownStalkPerBdvPerSeason() external view returns (uint128) {
        return s.seedGauge.averageGrownStalkPerBdvPerSeason;
    }

    /**
     * @notice returns the percentage of new grown stalk 
     * issued to the LP silo tokens.
     * @dev 6 decimal precision (1% = 1e6)
     */
    function getPercentOfNewGrownStalkToLP() external view returns (uint128) {
        return s.seedGauge.percentOfNewGrownStalkToLP;
    }

}
