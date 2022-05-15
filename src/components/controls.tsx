import React, { FunctionComponent } from "react";
import { Box, Button, Text, theme } from "@chakra-ui/react";
import { ArrowRightIcon, RepeatIcon } from "@chakra-ui/icons";

import { Game } from "../types/game";

export interface ControlsProps {
  game: Game;
  onClickClear: () => void;
  onClickRun: () => void;
}

export const Controls: FunctionComponent<ControlsProps> = (props) => {
  return (
    <Box>
      <Text borderBottom={`1px solid ${theme.colors.gray[200]}`} maxW={250} mt={25} ml={25} fontSize={`sm`}>Controls</Text>
      <Button 
        ml={25}
        mt={25}
        disabled={props.game.queue.length > 0}
        onClick={props.onClickClear}
        leftIcon={<RepeatIcon />} 
        variant="outline">
        Clear
      </Button>
      <Button 
        ml={25}
        mt={25} 
        disabled={props.game.queue.length > 0}
        onClick={props.onClickRun}
        leftIcon={<ArrowRightIcon />}
        variant="outline">
        Run
      </Button>   
    </Box>
  );
}

export default Controls;
