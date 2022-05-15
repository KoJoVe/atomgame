import { PayloadAction } from '@reduxjs/toolkit';
import { Cell } from "./cell";

export type Board = {
  cells: Cell[][];
}

export type BoardActions = {
  insertParticleOnBoard: (state: Board, action: PayloadAction<Cell>) => void;
  clearBoard: (state: Board) => void;
}
