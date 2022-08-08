import React, { FunctionComponent, ReactNode } from "react";
import { Box, theme, useBreakpointValue } from "@chakra-ui/react";

import { useWindowDimensions } from "../hooks/dimensions";

export interface SectionProps {
  title?: string;
  children?: ReactNode;
};

export const Section: FunctionComponent<SectionProps> = (props) => {
  const { width, height } = useWindowDimensions();

  const w = useBreakpointValue({ base: `100%`, sm: `100%`, md: `50%` }) || `0`;
  const h = useBreakpointValue({ base: `auto`, sm: `auto`, md: `${height}` }) || `0`;

  const widthPx = useBreakpointValue({ base: width, sm: width, md: width/2 }) || 0;

  const getSectionStyle = () => {
    return { 
      position: `relative` as any,
      float: `left` as any,
      border: `0px solid ${theme.colors.gray[500]}`,
      borderRadius: "10px"
    }
  }

  const childrenWithProps = React.Children.map(props.children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { w: widthPx } as any);
    }
    return child;
  });
  
  return (
    <Box { ...getSectionStyle() } w={w} h={h}>
      {childrenWithProps}
    </Box>
  );
}

export default Section;
