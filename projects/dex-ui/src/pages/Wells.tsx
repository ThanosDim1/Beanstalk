import { TokenValue } from "@beanstalk/sdk";
import React, { useMemo, useState } from "react";
import { Item } from "src/components/Layout";
import { Page } from "src/components/Page";
import { Title } from "src/components/PageComponents/Title";
import { TabButton } from "src/components/TabButton";
import { Row, TBody, THead, Table, Th } from "src/components/Table";
import { Row as TabRow } from "src/components/Layout";
import { useWells } from "src/wells/useWells";
import styled from "styled-components";
import { mediaQuery, size } from "src/breakpoints";
import { Error } from "src/components/Error";
import { useWellLPTokenPrice } from "src/wells/useWellLPTokenPrice";
import { useLPPositionSummary } from "src/tokens/useLPPositionSummary";

import { WellDetailLoadingRow, WellDetailRow } from "src/components/Well/Table/WellDetailRow";
import {
  MyWellPositionLoadingRow,
  MyWellPositionRow
} from "src/components/Well/Table/MyWellPositionRow";
import { useBeanstalkSiloAPYs } from "src/wells/useBeanstalkSiloAPYs";
import { useLagLoading } from "src/utils/ui/useLagLoading";
import useBasinStats from "src/wells/useBasinStats";
import { useTokenPrices } from "src/utils/price/useTokenPrices";
import { useWellFunctionNames } from "src/wells/wellFunction/useWellFunctionNames";
import { BasinAPIResponse } from "src/types";
import { Well } from "@beanstalk/sdk-wells";

export const Wells = () => {
  const { data: wells, isLoading, error } = useWells();
  const { data: wellStats } = useBasinStats();
  const [tab, showTab] = useState<number>(0);

  const { data: lpTokenPrices, isLoading: lpTokenPricesLoading } = useWellLPTokenPrice(wells);
  const { hasPositions, getPositionWithWell, isLoading: positionsLoading } = useLPPositionSummary();
  const { isLoading: apysLoading } = useBeanstalkSiloAPYs();
  const { data: tokenPrices, isLoading: tokenPricesLoading } = useTokenPrices(wells);
  const { data: wellFnNames, isLoading: wellNamesLoading } = useWellFunctionNames(wells);

  const tableData = useMemo(
    () => makeTableData(wells, wellStats, tokenPrices),
    [tokenPrices, wellStats, wells]
  );

  const loading = useLagLoading(
    isLoading ||
      apysLoading ||
      positionsLoading ||
      lpTokenPricesLoading ||
      tokenPricesLoading ||
      wellNamesLoading ||
      !tableData.length
  );

  if (error) {
    return <Error message={error?.message} errorOnly />;
  }

  return (
    <Page>
      <Title fontWeight={"600"} title="WELLS" largeOnMobile />
      <StyledRow gap={24} mobileGap={"0px"}>
        <Item stretch>
          <TabButton onClick={() => showTab(0)} active={tab === 0} stretch bold justify hover>
            <span>View Wells</span>
          </TabButton>
        </Item>
        <Item stretch>
          <TabButton onClick={() => showTab(1)} active={tab === 1} stretch bold justify hover>
            <span>My Liquidity Positions</span>
          </TabButton>
        </Item>
      </StyledRow>
      <StyledTable>
        {tab === 0 ? (
          <THead>
            <TableRow>
              <DesktopHeader>Well</DesktopHeader>
              <DesktopHeader>Well Function</DesktopHeader>
              <DesktopHeader align="right">Yield</DesktopHeader>
              <DesktopHeader align="right">Total Liquidity</DesktopHeader>
              <DesktopHeader align="right">Price</DesktopHeader>
              <DesktopHeader align="right">24H Volume</DesktopHeader>
              <DesktopHeader align="right">Reserves</DesktopHeader>
              <MobileHeader>All Wells</MobileHeader>
            </TableRow>
          </THead>
        ) : (
          <THead>
            <TableRow>
              <DesktopHeader>My Positions</DesktopHeader>
              <DesktopHeader align="right">My Liquidity</DesktopHeader>
              <DesktopHeader align="right">USD Value</DesktopHeader>
              <MobileHeader>My Liquidity Positions</MobileHeader>
              <MobileHeader align="right">USD Value</MobileHeader>
            </TableRow>
          </THead>
        )}
        <TBody>
          {loading ? (
            <>
              {Array(5)
                .fill(null)
                .map((_, idx) =>
                  tab === 0 ? (
                    <WellDetailLoadingRow key={`well-detail-loading-row-${idx}`} />
                  ) : (
                    <MyWellPositionLoadingRow key={`well-position-loading-row-${idx}`} />
                  )
                )}
            </>
          ) : (
            <>
              {hasPositions === false && tab === 1 ? (
                <>
                  <NoLPRow colSpan={3}>
                    <NoLPMessage>Liquidity Positions will appear here.</NoLPMessage>
                  </NoLPRow>
                  <NoLPRowMobile colSpan={2}>
                    <NoLPMessage>Liquidity Positions will appear here.</NoLPMessage>
                  </NoLPRowMobile>
                </>
              ) : (
                tableData?.map(({ well, baseTokenPrice, liquidityUSD, targetVolume }, index) => {
                  if (tab === 0) {
                    const priceFnName =
                      well.wellFunction?.name || wellFnNames?.[well.wellFunction?.address || ""];

                    return (
                      <WellDetailRow
                        well={well}
                        liquidity={liquidityUSD}
                        functionName={priceFnName}
                        price={baseTokenPrice}
                        volume={targetVolume}
                        key={`well-detail-row-${well.address}-${index}`}
                      />
                    );
                  }

                  return (
                    <MyWellPositionRow
                      well={well}
                      position={getPositionWithWell(well)}
                      prices={lpTokenPrices}
                      key={`My-liquidity-row-${well.address}-${index}`}
                    />
                  );
                })
              )}
            </>
          )}
        </TBody>
      </StyledTable>
    </Page>
  );
};

const makeTableData = (
  wells?: Well[],
  stats?: BasinAPIResponse[],
  tokenPrices?: Record<string, TokenValue>
) => {
  if (!wells || !wells.length || !tokenPrices) return [];

  const statsByPoolId = (stats || []).reduce<Record<string, BasinAPIResponse>>(
    (prev, curr) => ({ ...prev, [curr.pool_id.toLowerCase()]: curr }),
    {}
  );

  const data = (wells || []).map((well) => {
    let baseTokenPrice: TokenValue | undefined = undefined;
    let liquidityUSD: TokenValue | undefined = undefined;
    let targetVolume: TokenValue | undefined = undefined;

    const token1 = well.tokens?.[0];
    const token2 = well.tokens?.[1];

    if (token1 && token2) {
      const basePrice = tokenPrices[token1.address] || TokenValue.ZERO;
      const targetPrice = tokenPrices[token2.address] || TokenValue.ZERO;

      const reserve1 = well.reserves?.[0];
      const reserve2 = well.reserves?.[1];
      const reserve1USD = reserve1?.mul(basePrice);
      const reserve2USD = reserve2?.mul(targetPrice);
      if (reserve2USD && reserve1) {
        baseTokenPrice = reserve2USD.div(reserve1);
      }
      if (reserve1USD && reserve2USD) {
        liquidityUSD = reserve1USD.add(reserve2USD);
      }

      const baseVolume = token2.fromHuman(
        statsByPoolId[well.address.toLowerCase()]?.target_volume || 0
      );
      targetVolume = baseVolume.mul(targetPrice);
    }

    return {
      well,
      baseTokenPrice,
      liquidityUSD,
      targetVolume
    };
  });

  return data;
};

const StyledTable = styled(Table)`
  overflow: auto;
`;

const TableRow = styled(Row)`
  @media (max-width: ${size.mobile}) {
    height: 66px;
  }
`;

const StyledRow = styled(TabRow)`
  @media (max-width: ${size.mobile}) {
    position: fixed;
    width: 100vw;
    top: calc(100% - 48px);
    left: 0;
  }
`;

const MobileHeader = styled(Th)`
  font-size: 14px;
  padding: 8px 16px;
  @media (min-width: ${size.mobile}) {
    display: none;
  }
`;

const DesktopHeader = styled(Th)`
  :nth-child(1) {
    width: 10em;
  }
  :nth-child(2) {
    width: 12em;
  }
  :nth-child(3) {
    width: 12em;
  }

  :nth-child(5) {
    @media (max-width: ${size.desktop}) {
      display: none;
    }
  }
  :nth-child(6) {
    @media (max-width: ${size.desktop}) {
      display: none;
    }
  }

  :nth-child(3) {
    @media (max-width: ${size.tablet}) {
      display: none;
    }
  }
  @media (max-width: ${size.mobile}) {
    display: none;
  }
`;

const NoLPRow = styled.td`
  background-color: #fff;
  height: 120px;
  border-bottom: 0.5px solid #9ca3af;

  ${mediaQuery.sm.only} {
    display: none;
  }
`;

const NoLPRowMobile = styled.td`
  background-color: #fff;
  height: 120px;
  border-bottom: 0.5px solid #9ca3af;

  ${mediaQuery.sm.up} {
    display: none;
  }
`;

const NoLPMessage = styled.div`
  display: flex;
  justify-content: center;
  color: #4b5563;

  @media (max-width: ${size.mobile}) {
    font-size: 14px;
  }
`;
