import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { theme } from "src/utils/ui/theme";
import { Box, Flex } from "src/components/Layout";
import { Text } from "src/components/Typography";
import { WellComponentInfo } from "../useWhitelistedWellComponents";
import { AccordionSelectCard } from "../../Selectable";
import { Etherscan, Github } from "../../Icons";

export type WellComponentAccordionCardProps = {
  selected: boolean;
  setSelected: (address: string) => void;
} & WellComponentInfo;

export const WellComponentAccordionCard = ({
  selected,
  address,
  component,
  info,
  deploy,
  links,
  setSelected
}: WellComponentAccordionCardProps) => {
  return (
    <AccordionSelectCard
      selected={selected}
      upper={
        <Flex $direction="row" $gap={2}>
          <Box>
            <Text $weight="semi-bold" $variant="xs">
              {component.fullName || component.name}{" "}
              <Text as="span" $color="text.secondary" $weight="normal" $variant="xs">
                {"(Recommended)"}
              </Text>
            </Text>
            {component.description.map((text, j) => (
              <Text $color="text.secondary" $variant="xs" key={`description-${address}-${j}`}>
                {text}
              </Text>
            ))}
          </Box>
        </Flex>
      }
      below={
        <Flex $direction="row" $justifyContent="space-between">
          <Flex $gap={0.5} $alignItems="flex-start">
            {[deploy, ...info].map((datum) => (
              <Text $color="text.secondary" $variant="xs" key={`info-${datum.label}`}>
                {datum.label}: {datum.imgSrc && <IconImg src={datum.imgSrc} />}
                <MayLink url={datum.url || ""}>
                  <Text as="span" $variant="xs">
                    {" "}
                    {datum.value}
                  </Text>
                </MayLink>
              </Text>
            ))}
            <Text $color="text.light" $variant="xs">
              Used by {component.usedBy} other {toPlural("Well", component.usedBy ?? 0)}
            </Text>
          </Flex>
          <Flex $justifyContent="space-between" $alignItems="flex-end">
            <Flex $direction="row" $gap={0.5}>
              {links.etherscan && (
                <MayLink url={links.etherscan}>
                  <Etherscan width={20} height={20} color={theme.colors.lightGray} />
                </MayLink>
              )}
              {links.github && (
                <MayLink url={links.github}>
                  <Github width={20} height={20} color={theme.colors.lightGray} />
                </MayLink>
              )}
            </Flex>
            {links.learnMore ? (
              <MayLink url={links.learnMore}>
                <Text
                  $color="text.secondary"
                  $variant="xs"
                  $textDecoration="underline"
                  $align="right"
                >
                  Learn more about this component
                </Text>
              </MayLink>
            ) : null}
          </Flex>
        </Flex>
      }
      onClick={() => setSelected(address)}
      defaultExpanded
    />
  );
};

const MayLink = ({ url, children }: { url?: string; children: React.ReactNode }) => {
  if (url) {
    return (
      <LinkFormWrapperInner
        to={url}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </LinkFormWrapperInner>
    );
  }
  return children;
};

const LinkFormWrapperInner = styled(Link).attrs({
  target: "_blank",
  rel: "noopener noreferrer"
})`
  text-decoration: none;
  outline: none;
`;

const IconImg = styled.img<{ $rounded?: boolean }>`
  max-height: 16px;
  max-width: 16px;
  border-radius: 50%;
  margin-bottom: ${theme.spacing(-0.25)};
`;

const toPlural = (word: string, count: number) => {
  const suffix = count === 1 ? "" : "s";
  return `${word}${suffix}`;
};
