import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateBoard } from '../generators/board';

import { Board } from "../types/board";
import { Particle } from '../types/particle';
import { Cell } from '../types/cell';

import { COLUMNS, LEVELS } from '../constants';

export interface InsertParticleAction {
  level: number;
  sector: number;
  particle: Particle;
}

export interface MoveParticleAction {
  level: number;
  sector: number;
  direction: "up" | "down" | "left" | "right";
}

export interface SetupCellsAction {
  level: number;
  sector: number;
  action?: Function;
  glow?: number;
  icon?: any;
}

export const boardSlice = createSlice({
  name: "board",
  initialState: {
    cells: []
  } as Board,
  reducers: {
    insertParticle: (board, action: PayloadAction<InsertParticleAction>) => {
      const { payload } = action;
      if (!board.cells[payload.sector][payload.level].particle) {
        board.cells[payload.sector][payload.level].particle = payload.particle;
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
      board.cells[newLevel][newSector].particle = particle;
    },
    setupCells: (board, action: PayloadAction<SetupCellsAction[]>) => {
      const { payload } = action;
      for (let i = 0; i < payload.length; i++) {
        const cell = payload[i];
        board.cells[cell.sector][cell.level] = {
          ...board.cells[cell.sector][cell.level],
          action: cell.action,
          glow: cell.glow,
          icon: cell.icon
        }
      }
    },
    restartBoard: (board) => {
      board.cells = generateBoard(COLUMNS, LEVELS);
    }
  }
});

export const { insertParticle, moveParticle, setupCells, restartBoard } = boardSlice.actions;
export const boardReducer = boardSlice.reducer;