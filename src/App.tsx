import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

import Deck from "./components/deck";
import Board from "./components/board";
import Section from "./components/section";
import Controls from "./components/controls";

import { Cell } from "./types/cell";
import { Game } from "./types/game";

import { createGame } from "./slices/game";
import { selectDeckCard } from "./slices/deck";
import { insertParticleOnBoard, restartBoard } from "./slices/board";
import { actParticle, interactParticles } from "./slices/interaction";

import { useDispatch } from "./hooks/game";

export const App = () => {
  const dispatch = useDispatch();
  const [game, setGame] = useState<Game>(createGame()());

  const onClickCell = (cell: Cell) => game.current ? setGame(actParticle(cell)(game)) : dispatch(insertParticleOnBoard(cell));
  const onClickClear = () => dispatch(restartBoard());
  const onClickRun = () => setGame(interactParticles()(game));
  const onSelectCard = (index: number) => dispatch(selectDeckCard(index));

  useEffect(() => {
    onClickClear();
  }, []);

  return (
    <Box>
      <Section>
        <Board 
          game={game}
          onClickCell={onClickCell} />
      </Section>
      <Section>
        <Deck 
          game={game} 
          onSelectCard={onSelectCard} />
        <Controls 
          game={game}
          onClickClear={onClickClear}
          onClickRun={onClickRun} />     
      </Section>
    </Box>
  );
}

export default App;
