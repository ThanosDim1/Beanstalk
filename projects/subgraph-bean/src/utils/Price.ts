import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Bean3CRV } from "../../generated/Bean3CRV-V1/Bean3CRV";
import { BI_10, ONE_BI, toDecimal, ZERO_BI } from "../../../subgraph-core/utils/Decimals";

// Pre-replant prices are unavailable from the beanstalk contracts
// Note that the Bean3CRV type applies to any curve pool (including lusd)

// Returns the bean price in the given curve pool
export function curvePrice(lpContract: Bean3CRV, otherTokenPrice: BigDecimal): BigDecimal {
  return toDecimal(lpContract.get_dy(ZERO_BI, ONE_BI, BigInt.fromI32(1000000)), 18).times(otherTokenPrice);
}

// Returns the deltaB in the given curve pool
export function curveDeltaB(lpContract: Bean3CRV, beanReserves: BigInt): BigInt {
  // D = vprice * total lp tokens
  const D = lpContract.get_virtual_price().times(lpContract.totalSupply());
  // D / 2 / 1e18 - beanBalance
  const deltaB = D.div(BigInt.fromU32(2)).div(BI_10.pow(18)).minus(beanReserves);
  return deltaB;
}

// Returns the deltaB in a uniswapv2 constant product pool
export function uniswapV2DeltaB(beanReserves: BigDecimal, token2Reserves: BigDecimal, token2Price: BigDecimal): BigInt {
  const constantProduct = beanReserves.times(token2Reserves);
  const beansAfterSwap = BigInt.fromString(constantProduct.times(token2Price).truncate(0).toString()).sqrt();
  const deltaB = beansAfterSwap.minus(BigInt.fromString(beanReserves.truncate(0).toString()));
  return deltaB;
}
