import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateBoard } from '../generators/board';

import { 
  Board,
  UpdateBoardAction,
  HighlightCellAction,
  UnHighlightCellAction
} from "../types/board";

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
    updateBoard: (board: Board, action: PayloadAction<UpdateBoardAction>) => {
      const { payload } = action;
      board.cells = payload.board.cells.map(col => col.map(cell => ({ ...cell, _new: undefined })));
      board.nucleus = payload.board.nucleus;
    }
  }
});

export const { 
  restartBoard,
  highlightCell,
  unHighlightCell,
  updateBoard,
} = boardSlice.actions;
export const boardReducer = boardSlice.reducer;