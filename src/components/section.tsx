import React, { FunctionComponent, ReactNode } from "react";
import { Box, theme } from "@chakra-ui/react";

import { useWindowDimensions } from "../hooks/window";

export interface SectionProps {
  children?: ReactNode;
};

export const Section: FunctionComponent<SectionProps> = (props) => {
  const { height, width } = useWindowDimensions();

  const getSectionStyle = () => {
    return { 
      position: `relative` as any,
      float: `left` as any,
      width: width/2, 
      height: height, 
      border: `0px solid ${theme.colors.gray[500]}`,
      borderRadius: "10px",
      boxSing: `border-box`,
    }
  }
  
  return (
    <Box { ...getSectionStyle() }>
      {props.children}
    </Box>
  );
}

export default Section;
