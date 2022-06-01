import React, { FunctionComponent } from "react";
import { Box, Button, Text, theme } from "@chakra-ui/react";

import { generateParticleColor } from "../generators/particle";

import { Particle } from "../types/particle";

export interface DeckProps {
  cards: Particle[];
  selected?: number;
  onSelectCard: (index: number) => void;
}

export const Deck: FunctionComponent<DeckProps> = (props) => {

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
    props.onSelectCard(index);
  }

  return (
    <Box>
      { props.cards.map((p, i) => 
        <Button key={`card-${i}`} colorScheme={generateParticleColor(p)}
          { ...getCardStyle() }
          variant={props.selected === i ? `solid` : `outline`}
          onClick={() => onClickCard(i)} >
            <Box w={25} h={25} borderRadius={25} m={"auto"} mb={3} 
              bg={props.selected === i ? theme.colors[generateParticleColor(p)][200] : theme.colors[generateParticleColor(p)][500]}></Box>
            <Text fontSize="xs">VIT {p.vitality}</Text>
            <Text fontSize="xs">POW {p.power}</Text>
            <Text fontSize="xs">SWI {p.swiftness}</Text>
        </Button>
      )}
    </Box>
  );
}

export default Deck;
