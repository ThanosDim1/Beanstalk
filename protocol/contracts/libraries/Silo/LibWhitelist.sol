/*
 SPDX-License-Identifier: MIT
*/

pragma solidity =0.7.6;
pragma experimental ABIEncoderV2;

import "../../C.sol";
import "../LibAppStorage.sol";
import "contracts/libraries/Silo/LibTokenSilo.sol";

/**
 * @title LibWhitelist
 * @author Publius
 * @notice Handles adding and removing ERC-20 tokens from the Silo Whitelist.
 */
library LibWhitelist {

    /**
     * @notice Emitted when a token is added to the Silo Whitelist.
     * @param token ERC-20 token being added to the Silo Whitelist.
     * @param selector The function selector that returns the BDV of a given
     * amount of `token`. Must have signature:
     * 
     * ```
     * function bdv(uint256 amount) public view returns (uint256);
     * ```
     * 
     * @param stalkEarnedPerSeason The Stalk per BDV per Season received from depositing `token`.
     * @param stalkIssuedPerBdv The Stalk per BDV given from depositing `token`.
     */
    event WhitelistToken(
        address indexed token,
        bytes4 selector,
        uint32 stalkEarnedPerSeason,
        uint256 stalkIssuedPerBdv
    );

    event WhitelistTokenToGauge(
        address indexed token, 
        bytes4 selector, 
        uint24 lpGaugePoints
    );


    /**
     * @notice Emitted when the stalk per bdv per season for a Silo token is updated.
     * @param token ERC-20 token being updated in the Silo Whitelist.
     * @param stalkEarnedPerSeason new stalk per bdv per season value for this token.
     * @param season the season that the new stalk per bdv per season value becomes active (The current season).
     */
    event UpdatedStalkPerBdvPerSeason(
        address indexed token,
        uint32 stalkEarnedPerSeason,
        uint32 season
    );

    /**
     * @notice Emitted when a token is removed from the Silo Whitelist.
     * @param token ERC-20 token being removed from the Silo Whitelist.
     */
    event DewhitelistToken(address indexed token);

    /**
     * @dev Add an ERC-20 token to the Silo Whitelist.
     */
    function whitelistToken(
        address token,
        bytes4 selector,
        uint16 stalkIssuedPerBdv,
        uint24 stalkEarnedPerSeason,
        bytes1 encodeType
    ) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();

        //verify you passed in a callable selector
        (bool success,) = address(this).staticcall(
            LibTokenSilo.encodeBdvFunction(
                token,
                encodeType,
                selector,
                0
            )
        );
        require(success, "Whitelist: Invalid selector");

        require(s.ss[token].milestoneSeason == 0, "Whitelist: Token already whitelisted");

        s.ss[token].selector = selector;
        s.ss[token].stalkIssuedPerBdv = stalkIssuedPerBdv; // previously just called "stalk"
        s.ss[token].stalkEarnedPerSeason = stalkEarnedPerSeason; // previously called "seeds"

        s.ss[token].encodeType = encodeType;

        s.ss[token].milestoneSeason = uint24(s.season.current);

        emit WhitelistToken(token, selector, stalkEarnedPerSeason, stalkIssuedPerBdv);
    }

    /**
     * @notice Add an ERC-20 token to the Seed Gauge Whitelist.
     * @dev LibWhitelistedTokens.sol must be updated to include the new token.
     */
    function whitelistTokenToGauge(
        address token,
        bytes4 selector,
        uint16 lpGaugePoints
    ) internal {
        Storage.SiloSettings storage ss = LibAppStorage.diamondStorage().ss[token];
        //verify you passed in a callable selector
        (bool success,) = address(this).staticcall(
            abi.encodeWithSelector(
                selector,
                0,
                0
            )
        );
        require(success, "Whitelist: Invalid selector");

        require(ss.selector != 0, "Whitelist: Token not whitelisted in Silo");

        ss.GPSelector = selector;
        ss.lpGaugePoints = lpGaugePoints;

        emit WhitelistTokenToGauge(token, selector, lpGaugePoints);
    }
    
    /**
     * @dev Update the stalk per bdv per season for a token.
     */
    function updateStalkPerBdvPerSeasonForToken(
        address token,
        uint24 stalkEarnedPerSeason
    ) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();

        require(s.ss[token].milestoneSeason != 0, "Token not whitelisted");

        s.ss[token].milestoneStem = LibTokenSilo.stemTipForTokenUntruncated(token); //store grown stalk milestone
        s.ss[token].milestoneSeason = uint24(s.season.current); //update milestone season as this season
        s.ss[token].stalkEarnedPerSeason = stalkEarnedPerSeason;

        emit UpdatedStalkPerBdvPerSeason(token, stalkEarnedPerSeason, s.season.current);
    }

    /**
     * @dev Remove an ERC-20 token from the Silo Whitelist.
     */
    function dewhitelistToken(address token) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();

        delete s.ss[token];

        emit DewhitelistToken(token);
    }
}
