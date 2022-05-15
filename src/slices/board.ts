import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateBoard } from '../generators/board';

import { Board } from "../types/board";
import { Cell } from '../types/cell';
import { Particle } from '../types/particle';

import { COLUMNS, LEVELS } from '../constants';

export const boardSlice = createSlice({
  name: "board",
  initialState: {
    cells: []
  } as Board,
  reducers: {
    insertParticleOnBoard: (board, action: PayloadAction<{
      cell: Cell,
      particle: Particle,
    }>) => {
      const { payload } = action;
      if (!board.cells[payload.cell.sector][payload.cell.level].particle) {
        board.cells[payload.cell.sector][payload.cell.level].particle = payload.particle;
      }
    },
    restartBoard: (board) => {
      board = { cells: generateBoard(COLUMNS, LEVELS) };
    }
  }
});

export const { insertParticleOnBoard, restartBoard } = boardSlice.actions;
export const boardReducer = boardSlice.reducer;