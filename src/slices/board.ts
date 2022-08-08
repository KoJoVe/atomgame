import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateBoard } from '../generators/board';

import { 
  Board,
  ApplyCurrentAction,
  DeleteCurrentAction,
  HighlightCellAction,
  UnHighlightCellAction
} from "../types/board";

import { Color } from '../helpers/color';

import { COLUMNS, LEVELS } from '../constants';

export const boardSlice = createSlice({
  name: "board",
  initialState: {
    cells: [],
    nucleus: { particles: { red: 0, green: 0, blue: 0 } }
  } as Board,
  reducers: {
    restartBoard: (board: Board) => {
      board.cells = generateBoard(COLUMNS, LEVELS);
      board.nucleus = { particles: { red: 0, green: 0, blue: 0 } };
    },
    highlightCell: (board: Board, action: PayloadAction<HighlightCellAction>) => {
      const { payload } = action;
      board.cells = board.cells.map(col => col.map(c => ({ ...c, highlighted: undefined })))
      if (payload.sector !== undefined && payload.sector >= 0 && payload.level !== undefined && payload.level >= 0) {
        board.cells[payload.sector][payload.level].highlighted = true; 
      } else {
        board.nucleus.highlighted = true;
      }
    },
    unHighlightCell: (board: Board, action: PayloadAction<UnHighlightCellAction>) => {
      const { payload } = action;
      if (payload.sector !== undefined && payload.sector >= 0 && payload.level !== undefined && payload.level >= 0) {
        board.cells[payload.sector][payload.level].highlighted = false; 
      } else {
        board.nucleus.highlighted = undefined;
      }
    },
    applyCurrent: (board: Board, action: PayloadAction<ApplyCurrentAction>) => {
      const { payload } = action;
      board.cells = board.cells.map((col, i) => col.map((cell, j) => 
        payload.card.cells.find(c => c.sector === i && c.level === j) ? payload.card.cells.find(c => c.sector === i && c.level === j)! : cell
      ));
      board.nucleus.particles = Object.keys(board.nucleus.particles).reduce((o, k) => {
        return {
          ...o,
          [k]: board.nucleus.particles[k as Color] + payload.card.nucleus.particles[k as Color]
        }
      }, {} as { [key in Color]: number; });
    },
    deleteCurrent: (board: Board, action: PayloadAction<DeleteCurrentAction>) => {
      const { payload } = action;
      board.cells = board.cells.map((col, i) => col.map((cell, j) => 
        payload.card.cells.find(c => c.sector === i && c.level === j) ? { ...cell, particle: undefined } : cell
      ));
      board.nucleus.particles = Object.keys(board.nucleus.particles).reduce((o, k) => {
        return {
          ...o,
          [k]: board.nucleus.particles[k as Color] - payload.card.nucleus.particles[k as Color]
        }
      }, {} as { [key in Color]: number; });
    }
  }
});

export const { 
  restartBoard,
  highlightCell,
  unHighlightCell,
  applyCurrent,
  deleteCurrent,
} = boardSlice.actions;
export const boardReducer = boardSlice.reducer;