import React, { FunctionComponent } from "react";
import { Box, Button } from "@chakra-ui/react";
import { DeleteIcon, AddIcon, MinusIcon, CheckIcon } from "@chakra-ui/icons";

export interface ControlsProps {
  deleting?: boolean;
  onClickRestart: () => void;
  onClickDelete: () => void;
}

export const Controls: FunctionComponent<ControlsProps> = (props) => {
  return (
    <Box textAlign={`center`} mt={`30px`}>
      <Button 
        ml={`10px`}
        mr={`10px`}
        onClick={props.onClickDelete}
        leftIcon={ props.deleting ? <MinusIcon /> : <AddIcon /> } 
        variant={"outline"}>
        { props.deleting ? "Extracting" : "Fusing" }
      </Button>
      <Button 
        ml={`10px`}
        mr={`10px`}
        leftIcon={ <CheckIcon /> } 
        variant={"outline"}>
        Apply
      </Button>
      <Button 
        ml={`10px`}
        mr={`10px`}
        onClick={props.onClickRestart}
        leftIcon={<DeleteIcon />} 
        variant="outline">
        Clear
      </Button>
    </Box>
  );
}

export default Controls;
