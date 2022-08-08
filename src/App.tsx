import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";

import Deck from "./components/deck";
import Board from "./components/board";
import Section from "./components/section";

import { Cell } from "./types/cell";

import { selectDeckCard, toggleDeleting } from "./slices/deck";
import { 
  restartBoard, 
  highlightCell, 
  unHighlightCell,
  applyCurrent,
  deleteCurrent, 
} from "./slices/board";

import { getLooseCard, rotateCard } from "./helpers/card";
import { useDispatch, useSelector } from "./hooks/game";

export const App = () => {
  const dispatch = useDispatch();

  const cells = useSelector(g => g.board.cells);
  const nucleus = useSelector(g => g.board.nucleus);
  const cards = useSelector(g => g.deck.cards);
  const deleting = useSelector(g => g.deck.deleting);
  const index = useSelector(g => g.deck.selected);
  const highlighted = useSelector(g => (g.board.cells.find(col => col.find(c => c.highlighted)) || []).find(c => c.highlighted));
  const card = useSelector(g => index !== undefined && g.deck.cards[index]) || undefined;
  const current = card?.loose ? (nucleus.highlighted ? card : highlighted && getLooseCard(card, highlighted)) : rotateCard(card, (highlighted && highlighted.sector) || 0);

  const apply = () => {
    if (!current) {
      return;
    }
    if (deleting) {
      dispatch(deleteCurrent({ card: current }))
    } else {
      dispatch(applyCurrent({ card: current }))
    }
    dispatch(selectDeckCard(-1));
  }

  const onEnterCell = (cell: Cell) => dispatch(highlightCell(cell));
  const onLeaveCell = (cell: Cell) => dispatch(unHighlightCell(cell));
  const onClickCell = () => apply();
  const onEnterNucleus = () => dispatch(highlightCell({}));
  const onLeaveNucleus = () => dispatch(unHighlightCell({}));  
  const onClickNucleus = () => apply();
  // const onEnterNucleusParticle = (color?: Color) => dispatch(highlightCell({ color }));
  // const onLeaveNucleusParticle = () => dispatch(unHighlightCell({}));  
  // const onClickNucleusParticle = (color: Color) => particle?.color === color ? dispatch(insertNucleusParticle({ particle: particle })) : '';

  const onClickDelete = () => dispatch(toggleDeleting());

  const onClickCard = (index: number) => dispatch(selectDeckCard(index));

  useEffect(() => {
    dispatch(restartBoard());
  }, [dispatch]);

  return (
    <Box>
      <Section>
        <Board
          cells={cells}
          nucleus={nucleus}
          current={current}
          deleting={deleting}
          onEnterCell={onEnterCell}
          onLeaveCell={onLeaveCell}
          onClickCell={onClickCell}
          onClickButton={onClickDelete} 
          onEnterNucleus={onEnterNucleus}
          onLeaveNucleus={onLeaveNucleus}
          onClickNucleus={onClickNucleus} />
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
