import React, { FunctionComponent, useRef } from "react";
import { Box, Text, theme, useBreakpointValue } from "@chakra-ui/react";

import Board from "./board";
import { Color } from "../helpers/color";
import { useContainerDimensions } from "../hooks/dimensions";
import { generateBoard } from "../generators/board";
import { Card } from "../types/card";
import { COLUMNS, LEVELS } from "../constants";

export interface DeckProps {
  cards: Card[];
  selected?: number;
  onClickCard: (index: number) => void;
}

export const Deck: FunctionComponent<DeckProps> = (props) => {
  const cardRef = useRef();
  const cardMargin = 10;
  const cardSize = useBreakpointValue({ base: 25, sm: 25, md: 16.33, lg: 16.33 }) || 0;
  const boardPadding = 30;
  const width = useContainerDimensions(cardRef).width/(100/cardSize) - cardMargin;

  const getCardStyle = (selected: boolean, color: Color) => {
    return {
      float: `left` as any,
      position: `relative` as any,
      left: `${cardMargin/2}px`,
      width: `calc(${cardSize}% - ${cardMargin}px)`, 
      height: `${width*1.6}px`,
      marginRight: `${cardMargin}px`,
      marginBottom: `${cardMargin}px`,
      border: `1px solid ${selected ? `white` : theme.colors[color][300]}`,
      borderRadius: `5px`,
      cursor: `pointer`,
      background: `${selected ? theme.colors.gray[700] : theme.colors.gray[800]}`,
      _hover: {
        background: `${theme.colors.gray[700]}`,
      }
    }
  }

  const onClickCard = (index: number) => {
    props.onClickCard(index);
  }

  const getCells = (card: Card) => {
    return card.loose ? [] : generateBoard(COLUMNS, LEVELS)
      .map(column => column.map(cell => ({
        ...cell, particle: card.cells.find(c => c.sector === cell.sector && c.level === cell.level)?.particle 
      })));
  }

  const getValue = (card: Card, color: Color) => {
    return card.cells.filter(c => c.particle && c.particle.color === color).length + card.nucleus.particles[color];
  }

  return (
    <div style={{ overflow: `hidden`, marginTop: `25px` }} ref={cardRef as any}>
      { props.cards.map((card, i) => 
          <Box key={`card-${i}`} { ...getCardStyle(props.selected === i, card.color) } onClick={() => onClickCard(i)} >
            <Box 
              display={`flex`} 
              justifyContent={`center`} 
              alignItems={`center`} 
              height={width/3} 
              borderBottom={`1px solid ${props.selected === i ? `white` : theme.colors[card.color as Color][300]}`} >
                <Text textAlign={`center`} fontSize={`10px`} >{card.name}</Text>
            </Box>
            <Box pos={`relative`} left={`${boardPadding/2}px`}>
              <Board 
                cells={getCells(card)}
                nucleus={card.nucleus}
                mode="card"
                w={width - boardPadding} />
            </Box>
            <Text fontSize={`10px`} ml={`${cardMargin}px`} mt={width/2.2} >Aspect [{getValue(card, `red`)}]</Text>
            <Text fontSize={`10px`} ml={`${cardMargin}px`}>Will [{getValue(card, `green`)}]</Text>
            <Text fontSize={`10px`} ml={`${cardMargin}px`}>Power [{getValue(card, `blue`)}]</Text>
          </Box>
        )
      }
    </div>
  );
}

export default Deck;
