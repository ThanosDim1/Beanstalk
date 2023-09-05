/*
 SPDX-License-Identifier: MIT
*/

pragma solidity =0.7.6;
pragma experimental ABIEncoderV2;

import {SafeMath} from "@openzeppelin/contracts/math/SafeMath.sol";
import {IInstantaneousPump} from "contracts/interfaces/basin/pumps/IInstantaneousPump.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Call, IWell} from "contracts/interfaces/basin/IWell.sol";
import {IWellFunction} from "contracts/interfaces/basin/IWellFunction.sol";
import {C} from "contracts/C.sol";
import {AppStorage, LibAppStorage} from "../LibAppStorage.sol";
import {LibUsdOracle} from "contracts/libraries/Oracle/LibUsdOracle.sol";

/**
 * @title Well Library
 * Contains helper functions for common Well related functionality.
 **/
library LibWell {

    using SafeMath for uint256;

    uint256 private constant PRECISION = 1e30;


    /**
     * @dev Returns the price ratios between `tokens` and the index of Bean in `tokens`.
     * These actions are combined into a single function for gas efficiency.
     */
    function getRatiosAndBeanIndex(IERC20[] memory tokens) internal view returns (
        uint[] memory ratios,
        uint beanIndex,
        bool success
    ) {
        success = true;
        ratios = new uint[](tokens.length);
        beanIndex = type(uint256).max;
        for (uint i; i < tokens.length; ++i) {
            if (C.BEAN == address(tokens[i])) {
                beanIndex = i;
                ratios[i] = 1e6;
            } else {
                ratios[i] = LibUsdOracle.getUsdPrice(address(tokens[i]));
                if (ratios[i] == 0) {
                    success = false;
                }
            }
        }
        require(beanIndex != type(uint256).max, "Bean not in Well.");
    }
    
    /**
     * @dev Returns the index of Bean in a list of tokens.
     */
    function getBeanIndex(IERC20[] memory tokens) internal pure returns (uint beanIndex) {
        for (beanIndex; beanIndex < tokens.length; ++beanIndex) {
            if (C.BEAN == address(tokens[beanIndex])) {
                return beanIndex;
            }
        }
        revert("Bean not in Well.");
    }

    /**
     * @dev Returns the index of Bean given a Well.
     */
    function getBeanIndexFromWell(address well) internal view returns (uint beanIndex) {
        IERC20[] memory tokens = IWell(well).tokens();
        beanIndex = getBeanIndex(tokens);
    }

    /**
     * @dev Returns the non-Bean token within a Well.
     * Cannot fail (and thus revert), as wells cannot have 2 of the same tokens as the pairing.
     */
    function getTokenAndIndexFromWell(address well) internal view returns (address, uint256) {
        IERC20[] memory tokens = IWell(well).tokens();
        for(uint256 i = 0; i < tokens.length; i++){
            if(address(tokens[i]) != C.BEAN){
                return (address(tokens[i]), i);
            }
        }
    }

    /**
     * @dev Returns whether an address is a whitelisted Well by checking
     * if the BDV function selector is the `wellBdv` function.
     */
    function isWell(
        address well
    ) internal view returns (bool _isWell) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        return s.ss[well].selector == 0xc84c7727;
    }

    /**
     * @dev gets the liquidity of a well in us dollars. 
     * assumes a CP2 well function. 
     */
    function getUsdLiquidity(
        address well, 
        uint256 amount
    ) internal view returns (uint256 usdLiquidity) {
        uint256[] memory underlyingAmounts = IWell(well).getRemoveLiquidityOut(amount);
        // get the non-bean address and index
        (address token, uint256 j) = getTokenAndIndexFromWell(well);
        // calculate liquidity in USD (6 decimal precision, same as Bean)
        usdLiquidity = LibUsdOracle.getUsdPrice(token)
            .mul(underlyingAmounts[j])
            .mul(2) 
            .div(PRECISION);
    }
}
