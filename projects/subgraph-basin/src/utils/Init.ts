import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Version } from "../../generated/schema";

export function handleInitVersion(block: ethereum.Block): void {
  const versionEntity = new Version("subgraph");
  versionEntity.versionNumber = "2.2.2";
  versionEntity.subgraphName = subgraphNameForBlockNumber(block.number);
  versionEntity.chain = chainForBlockNumber(block.number);
  versionEntity.save();
}

function subgraphNameForBlockNumber(blockNumber: BigInt): string {
  if (blockNumber == BigInt.fromU32(17977922)) {
    return "basin";
  }
  throw new Error("Unable to initialize subgraph name for this block number");
}

function chainForBlockNumber(blockNumber: BigInt): string {
  if (blockNumber == BigInt.fromU32(17977922)) {
    return "ethereum";
  }
  throw new Error("Unable to initialize chain for this block number");
}
