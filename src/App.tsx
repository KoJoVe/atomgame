import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import Deck from "./components/deck";
import Board from "./components/board";
import Section from "./components/section";
import Controls from "./components/controls";

import { Cell } from "./types/cell";

import { startRound } from "./slices/round";
import { selectDeckCard } from "./slices/deck";
import { insertParticle, restartBoard } from "./slices/board";

import { useDispatch, useSelector } from "./hooks/game";

export const App = () => {
  const dispatch = useDispatch();

  const cells = useSelector(game => game.board.cells);
  const cards = useSelector(game => game.deck.cards);
  const activeCell = useSelector(game => game.round.current);
  const selectedIndex = useSelector(game => game.deck.selected);
  const selectedParticle = useSelector(game => selectedIndex !== undefined ? game.deck.cards[selectedIndex] : undefined);
  const roundActive = useSelector(game => game.round.queue.length > 0); 

  const onClickCell = (cell: Cell) => activeCell ? '' : selectedParticle && dispatch(insertParticle({ ...cell, particle: selectedParticle }));
  const onSelectCard = (index: number) => dispatch(selectDeckCard(index));
  const onClickClear = () => dispatch(restartBoard());
  const onClickRun = () => dispatch(startRound());

  useEffect(() => {
    onClickClear();
  }, []);

  return (
    <Box>
      <Section>
        <Board
          cells={cells}
          activeCell={activeCell}
          onClickCell={onClickCell} />
      </Section>
      <Section>
        <Deck
          cards={cards}
          selected={selectedIndex}
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
