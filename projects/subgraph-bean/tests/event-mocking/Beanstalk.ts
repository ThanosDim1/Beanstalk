import { BigInt, ethereum, Address, Bytes } from "@graphprotocol/graph-ts";
import { MetapoolOracle, WellOracle } from "../../generated/TWAPOracles/BIP37";
import { mockBeanstalkEvent } from "../../../subgraph-core/tests/event-mocking/Util";

export function createMetapoolOracleEvent(
  season: BigInt,
  deltaB: BigInt,
  balances: BigInt[],
  block: ethereum.Block | null = null
): MetapoolOracle {
  let event = changetype<MetapoolOracle>(mockBeanstalkEvent());
  event.parameters = new Array();

  if (block !== null) {
    event.block = block;
  }

  let param1 = new ethereum.EventParam("season", ethereum.Value.fromUnsignedBigInt(season));
  let param2 = new ethereum.EventParam("deltaB", ethereum.Value.fromUnsignedBigInt(deltaB));
  let param3 = new ethereum.EventParam("balances", ethereum.Value.fromUnsignedBigIntArray(balances));

  event.parameters.push(param1);
  event.parameters.push(param2);
  event.parameters.push(param3);

  return event as MetapoolOracle;
}

export function createWellOracleEvent(
  season: BigInt,
  well: string,
  deltaB: BigInt,
  cumulativeReserves: Bytes,
  block: ethereum.Block | null = null
): WellOracle {
  let event = changetype<WellOracle>(mockBeanstalkEvent());
  event.parameters = new Array();

  if (block !== null) {
    event.block = block;
  }

  let param1 = new ethereum.EventParam("season", ethereum.Value.fromUnsignedBigInt(season));
  let param2 = new ethereum.EventParam("well", ethereum.Value.fromAddress(Address.fromString(well)));
  let param3 = new ethereum.EventParam("deltaB", ethereum.Value.fromUnsignedBigInt(deltaB));
  let param4 = new ethereum.EventParam("cumulativeReserves", ethereum.Value.fromBytes(cumulativeReserves));

  event.parameters.push(param1);
  event.parameters.push(param2);
  event.parameters.push(param3);
  event.parameters.push(param4);

  return event as WellOracle;
}
