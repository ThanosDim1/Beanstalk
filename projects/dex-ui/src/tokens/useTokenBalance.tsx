import { Token, TokenValue } from "@beanstalk/sdk";
import { queryKeys } from "src/utils/query/queryKeys";
import { useScopedQuery, useSetScopedQueryData } from "src/utils/query/useScopedQuery";
import { useAccount } from "wagmi";

type TokenBalanceCache = undefined | void | Record<string, TokenValue>;

export const useTokenBalance = (token: Token | undefined) => {
  const { address } = useAccount();
  const setQueryData = useSetScopedQueryData();

  const { data, isLoading, error, refetch, isFetching } = useScopedQuery({
    queryKey: queryKeys.tokenBalance(token?.symbol),

    queryFn: async () => {
      if (!token) return;

      let balance: TokenValue;
      if (!address) {
        balance = TokenValue.ZERO;
      } else {
        balance = await token.getBalance(address);
      }

      const result = {
        [token.symbol]: balance
      };

      // Also update the cache of "ALL" token query
      setQueryData(queryKeys.tokenBalancesAll, (oldData: TokenBalanceCache) => {
        if (!oldData) return result;

        return { ...oldData, ...result };
      });

      return result;
    },
    enabled: !!token,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 15,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always"
  });

  return { data, isLoading, error, refetch, isFetching };
};
