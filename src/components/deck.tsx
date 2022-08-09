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
  const cardMargin = 5;
  const totalMargin = 2*cardMargin;
  const cardSize = useBreakpointValue({ base: 25, sm: 25, md: 16.33, lg: 16.33 }) || 0;
  const width = useContainerDimensions(cardRef).width/(100/cardSize) - totalMargin;

  const getCardStyle = (selected: boolean, color: Color) => {
    return {
      float: `left` as any,
      width: `calc(${cardSize}% - ${(totalMargin)}px)`, 
      height: `${width*1.6}px`,
      margin: `${cardMargin}px`,
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

  return (
    <div style={{ overflow: `hidden`, marginTop: `25px` }} ref={cardRef as any}>
      { props.cards.map((card, i) => 
          <Box key={`card-${i}`} { ...getCardStyle(props.selected === i, card.color) } onClick={() => onClickCard(i)} >
            <Box 
              display={`flex`}
              justifyContent={`center`}
              alignItems={`center`}
              height={width/2}
              borderBottom={`1px solid ${props.selected === i ? `white` : theme.colors[card.color as Color][300]}`} >
                <Text textAlign={`center`} fontSize={`10px`} >{card.name}</Text>
            </Box>
            <Box>
              <Board 
                cells={getCells(card)}
                nucleus={card.nucleus}
                mode="card"
                w={width} />
            </Box>
            {/* <Text fontSize={`10px`} ml={`${cardMargin}px`} mt={width/2.2} >Aspect [{getValue(card, `red`)}]</Text>
            <Text fontSize={`10px`} ml={`${cardMargin}px`}>Will [{getValue(card, `green`)}]</Text>
            <Text fontSize={`10px`} ml={`${cardMargin}px`}>Power [{getValue(card, `blue`)}]</Text> */}
          </Box>
        )
      }
    </div>
  );
}

export default Deck;
