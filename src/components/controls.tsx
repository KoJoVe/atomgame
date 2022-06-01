import React, { FunctionComponent } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ArrowRightIcon, RepeatIcon } from "@chakra-ui/icons";

export interface ControlsProps {
  disabled?: boolean;
  onClickClear: () => void;
  onClickRun: () => void;
}

export const Controls: FunctionComponent<ControlsProps> = (props) => {
  return (
    <Box>
      <Button 
        ml={25}
        mt={25}
        disabled={props.disabled}
        onClick={props.onClickClear}
        leftIcon={<RepeatIcon />} 
        variant="outline">
        Clear
      </Button>
      <Button 
        ml={25}
        mt={25} 
        disabled={props.disabled}
        onClick={props.onClickRun}
        leftIcon={<ArrowRightIcon />}
        variant="outline">
        Run
      </Button>   
    </Box>
  );
}

export default Controls;
