import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import Deck from "./components/deck";
import Board from "./components/board";
import Section from "./components/section";

import { Cell } from "./types/cell";

import { selectDeckCard, toggleDeleting } from "./slices/deck";
import { restartBoard, highlightCell, unHighlightCell, updateBoard } from "./slices/board";

import { getNextBoard } from "./helpers/board";
import { useDispatch, useSelector } from "./hooks/game";

export const App = () => {
  const dispatch = useDispatch();

  const cards = useSelector(g => g.deck.cards);
  const deleting = useSelector(g => g.deck.deleting);
  const index = useSelector(g => g.deck.selected);
  const card = useSelector(g => index !== undefined && g.deck.cards[index]) || undefined;
  const highlighted = useSelector(g => g.board.cells.reduce((p, c) => p.concat(c), []).find(cell => cell.highlighted));
  const board = useSelector(g => g.board);
  const nextBoard = card && getNextBoard(board, card, highlighted, deleting);

  const onEnterCell = (cell: Cell) => dispatch(highlightCell(cell));
  const onLeaveCell = (cell: Cell) => dispatch(unHighlightCell(cell));
  const onClickCell = () => nextBoard && dispatch(updateBoard({ board: nextBoard }));
  const onClickButton = () => dispatch(toggleDeleting());
  const onEnterNucleus = () => dispatch(highlightCell({}));
  const onLeaveNucleus = () => dispatch(unHighlightCell({}));  
  const onClickCard = (index: number) => dispatch(selectDeckCard(index));

  useEffect(() => {
    dispatch(restartBoard());
  }, [dispatch]);

  return (
    <Box>
      <Section>
        <Board
          cells={board.cells}
          nucleus={board.nucleus}
          nextCells={nextBoard?.cells}
          nextNucleus={nextBoard?.nucleus}
          deleting={deleting}
          onEnterCell={onEnterCell}
          onLeaveCell={onLeaveCell}
          onClickCell={onClickCell}
          onClickButton={onClickButton} 
          onEnterNucleus={onEnterNucleus}
          onLeaveNucleus={onLeaveNucleus}
          onClickNucleus={onClickCell} />
      </Section>
      <Section> 
        <Deck
          cards={cards}
          selected={index}
          onClickCard={onClickCard} />
      </Section>
    </Box>
  );
}

export default App;
