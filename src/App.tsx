import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import Deck from "./components/deck";
import Board from "./components/board";
import Section from "./components/section";
import Controls from "./components/controls";

import { Cell } from "./types/cell";

import { runPhase, startRound } from "./slices/round";
import { selectDeckCard } from "./slices/deck";
import { hoverCell, insertParticle, restartBoard, unhoverCell } from "./slices/board";

import { useDispatch, useSelector } from "./hooks/game";

export const App = () => {
  const dispatch = useDispatch();

  const cells = useSelector(game => game.board.cells);
  const cards = useSelector(game => game.deck.cards);
  const roundActive = useSelector(game => game.round.queue.length > 0 || game.round.current !== undefined);
  const currentParticle = useSelector(game => game.round.current);
  const hoveredCell = useSelector(game => game.board.hovered);
  const selectedParticleIndex = useSelector(game => game.deck.selected);
  const selectedParticle = useSelector(game => selectedParticleIndex !== undefined && game.deck.cards[selectedParticleIndex]);

  const onClickCell = (cell: Cell) => roundActive ? dispatch(runPhase(cell)) : 
    selectedParticle && dispatch(insertParticle({ ...cell, particle: selectedParticle }));
  const onEnterCell = (cell: Cell) => dispatch(hoverCell(cell));
  const onLeaveCell = () => dispatch(unhoverCell());

  const onSelectCard = (index: number) => dispatch(selectDeckCard(index));

  const onClickClear = () => dispatch(restartBoard());
  const onClickRun = () => dispatch(startRound());

  useEffect(() => {
    dispatch(restartBoard());
  }, [dispatch]);

  return (
    <Box>
      <Section>
        <Board
          cells={cells}
          current={currentParticle}
          hoveredCell={hoveredCell}
          onClickCell={onClickCell}
          onEnterCell={onEnterCell}
          onLeaveCell={onLeaveCell} />
      </Section>
      <Section>
        <Deck
          cards={cards}
          selected={selectedParticleIndex}
          onSelectCard={onSelectCard} />
        <Controls
          disabled={roundActive}
          onClickClear={onClickClear}
          onClickRun={onClickRun} />     
      </Section>
    </Box>
  );
}

export default App;
