import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateBoard } from '../generators/board';

import { Board, InsertParticleAction, MoveParticleAction } from "../types/board";
import { Cell } from '../types/cell';

import { COLUMNS, LEVELS } from '../constants';

export const boardSlice = createSlice({
  name: "board",
  initialState: {
    cells: []
  } as Board,
  reducers: {
    insertParticle: (board, action: PayloadAction<InsertParticleAction>) => {
      const { payload } = action;

      let id = 0;
      let ids = board.cells.flatMap(col => col.map(cell => cell)).filter(cell => !!cell.particle).map(cell => cell.particle!.id);
      while (ids.find(i => i === id) !== undefined) {
        id++;
      }

      if (!board.cells[payload.sector][payload.level].particle) {
        board.cells[payload.sector][payload.level].particle = { ...payload.particle, id: id };
      }
    },
    moveParticle: (board, action: PayloadAction<MoveParticleAction>) => {
      const { payload } = action;
      const particle =  board.cells[payload.sector][payload.level].particle;

      let newSector = payload.sector;
      let newLevel = payload.level;

      switch (payload.direction) {
        case "up":
          newLevel = board.cells[0] && (payload.level === board.cells[0].length - 1) ? payload.level : payload.level + 1;
          break;
        case "right":
          newSector = payload.sector === board.cells.length - 1 ? 0 : payload.sector + 1;
          break;
        case "down":
          newLevel = payload.level === 0 ? 0 : payload.level - 1;
          break;
        case "left":
          newSector = payload.sector === 0 ? board.cells.length - 1 : payload.sector - 1;
          break;
      }
            
      board.cells[payload.sector][payload.level].particle = undefined;
      board.cells[newSector][newLevel].particle = particle;
    },
    reloadCells: (board) => {
      board.cells = board.cells.map(col => col.map(cell => {
        return {
          ...cell,
          phase: undefined,
          glow: undefined,
          icon: undefined,
        }
      }))
    },
    setupCells: (board, action: PayloadAction<Cell[]>) => {
      const { payload } = action;
      board.cells = board.cells.map(col => col.map(cell => {
        const cellSetup = payload.find(c => c.level === cell.level && c.sector === cell.sector);
        if (cellSetup) {
          return {
            ...cell,
            glow: cellSetup.glow,
            icon: cellSetup.icon,
            phase: {
              action: cellSetup.phase?.action,
              payload: cellSetup.phase?.payload,
            }
          }
        }
        return {
          ...cell,
          phase: undefined,
          glow: undefined,
          icon: undefined,
        };
      }));
    },
    hoverCell: (board, action: PayloadAction<Cell>) => {
      const { payload } = action;
      board.hovered = {
        sector: payload.sector,
        level: payload.level,
      }
    },
    unhoverCell: (board) => {
      board.hovered = undefined;
    },
    restartBoard: (board) => {
      board.cells = generateBoard(COLUMNS, LEVELS);
    }
  }
});

export const { 
  insertParticle, 
  moveParticle, 
  setupCells,
  reloadCells,
  hoverCell,
  unhoverCell, 
  restartBoard 
} = boardSlice.actions;
export const boardReducer = boardSlice.reducer;