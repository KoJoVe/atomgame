import React, { FunctionComponent, useState } from "react";
import { Box, Button, Text, theme } from "@chakra-ui/react";

import { Game } from "../types/game";

import { generateParticleColor } from "../generators/particle";

export interface DeckUIState {
  deckCardSelected?: number;
}

export interface DeckProps {
  game: Game;
  onSelectCard: (index: number) => void;
}

export const Deck: FunctionComponent<DeckProps> = (props) => {
  const [ui, setUi] = useState<DeckUIState>({});

  const getButtonStyle = () => {
    return {
      outline: `none`,
      outlineColor: `white`,
      outlineOffset: `1px`,
    }
  }

  const getCardStyle = () => {
    return { 
      ...getButtonStyle(),
      display: `inline`,
      width: `${20}%`, 
      height: `${110}px`,
      margin: `25px 0 0 25px`,     
    }
  }

  const onClickCard = (index: number) => {
    setUi({ ...ui, deckCardSelected: index });
    props.onSelectCard(index);
  }

  return (
    <Box>
      <Text borderBottom={`1px solid ${theme.colors.gray[200]}`} maxW={250} mt={25} ml={25} fontSize={`sm`}>Particle Catalog</Text>
      { props.game.deck.map((p, i) => 
        <Button colorScheme={generateParticleColor(p)}
          { ...getCardStyle() }
          variant={ui.deckCardSelected === i ? `solid` : `outline`}
          onClick={() => onClickCard(i)} >
            <Box w={25} h={25} borderRadius={25} m={"auto"} mb={3} 
              bg={ui.deckCardSelected === i ? theme.colors[generateParticleColor(p)][200] : theme.colors[generateParticleColor(p)][500]}></Box>
            <Text fontSize="xs">VIT {p.vitality}</Text>
            <Text fontSize="xs">POW {p.power}</Text>
            <Text fontSize="xs">SWI {p.swiftness}</Text>
        </Button>
      )}
    </Box>
  );
}

export default Deck;
