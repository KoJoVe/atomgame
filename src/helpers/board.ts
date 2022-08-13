import { Board } from "../types/board";
import { Card } from "../types/card";
import { Cell } from "../types/cell";

import { Color } from "./color";

import { COLUMNS } from "../constants";

export const getNextBoard = (board: Board, card: Card, highlighted?: Cell, deleting?: boolean): Board => {
  const rotation = highlighted?.sector || 0;
  const movedCard = {
    ...card,
    cells: card.cells.map(cell => ({
      ...cell,
      sector: cell.sector + rotation > COLUMNS - 1 ? cell.sector + rotation - COLUMNS : cell.sector + rotation
    })) 
  }

  let nextCells = board.cells.map(col => col.map(cell => ({ ...cell })));

  if (card.loose && highlighted) {
    nextCells[highlighted.sector][highlighted.level] = {
      ...nextCells[highlighted.sector][highlighted.level],
      particle: {
        color: Object.keys(movedCard.nucleus.particles).find(k => movedCard.nucleus.particles[k as Color] > 0) as Color
      },
      _new: true 
    };
  } else {
    movedCard.cells.forEach(cell => {
      nextCells[cell.sector][cell.level] = { ...cell, particle: deleting? undefined : cell.particle, _new: true };
    });  
  }

  const nextNucleus = { particles: Object.keys(board.nucleus.particles).reduce((o, k) => {
    if (movedCard.loose && !board.nucleus.highlighted) {
      return {
        ...o,
        [k]: board.nucleus.particles[k as Color]
      }
    }
    return {
      ...o,
      [k]: board.nucleus.particles[k as Color] + (movedCard.nucleus.particles[k as Color] * (deleting ? -1 : 1))
    }
  }, {} as { [key in Color]: number; })};

  return {
    cells: nextCells,
    nucleus: nextNucleus
  }
}