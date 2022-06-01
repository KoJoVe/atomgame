import React, { FunctionComponent } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ArrowRightIcon, DeleteIcon, RepeatIcon } from "@chakra-ui/icons";

export interface ControlsProps {
  disabled?: boolean;
  deleting?: boolean;
  onClickClear: () => void;
  onClickDelete: () => void;
  onClickRun: () => void;
}

export const Controls: FunctionComponent<ControlsProps> = (props) => {
  return (
    <Box textAlign={`center`} mt={`30px`}>
      <Button 
        ml={`10px`}
        mr={`10px`}
        disabled={props.disabled}
        onClick={props.onClickDelete}
        leftIcon={<DeleteIcon />} 
        variant={props.deleting ? "solid" : "outline"}>
        Delete
      </Button>
      <Button 
        ml={`10px`}
        mr={`10px`}
        disabled={props.disabled}
        onClick={props.onClickClear}
        leftIcon={<RepeatIcon />} 
        variant="outline">
        Clear
      </Button>
      <Button 
        ml={`10px`}
        mr={`10px`}
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
