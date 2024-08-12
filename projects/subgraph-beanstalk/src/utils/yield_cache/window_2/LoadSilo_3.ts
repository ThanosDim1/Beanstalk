import { ZERO_BI } from "../../../../../subgraph-core/utils/Decimals";
import { DiamondCut } from "../../../../generated/Beanstalk-ABIs/PreReplant";
import { loadBeanstalk } from "../../../entities/Beanstalk";
import { loadSiloCache } from "../CacheLoader";
import { SILO_YIELD_7_DAY_20_000 } from "./HistoricSilo_20_000";

export function handleLoadSilo2_3(event: DiamondCut): void {
  let beanstalk = loadBeanstalk(event.address);

  // Load the historical vAPY figures in bulk at start
  if (beanstalk.lastUpgrade == ZERO_BI) {
    loadSiloCache(SILO_YIELD_7_DAY_20_000);
  }
}
