import { useState } from 'react';
import { TokenValue } from '@beanstalk/sdk';
import useSdk from '../sdk';

const MIN_CACHE_TIME = 10 * 1000; // 10 seconds

export const useWstETHPriceFromBeanstalk = () => {
  const sdk = useSdk();
  const [wstETHPrice, setWstETHPrice] = useState<TokenValue>();
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<number>(0);

  const fetchEthPrice = async () => {
    const fert = await sdk.contracts.beanstalk.getMintFertilizerOut(
      TokenValue.fromHuman(1000000, 18).toBigNumber()
    );

    const price = TokenValue.fromBlockchain(fert, 6);
    setWstETHPrice(price);
    setLastFetchTimestamp(Date.now());
    return price;
  };

  const getEthPrice = async (): Promise<TokenValue> => {
    if (Date.now() - lastFetchTimestamp > MIN_CACHE_TIME) {
      return fetchEthPrice();
    }
    return wstETHPrice!;
  };

  return getEthPrice;
};
