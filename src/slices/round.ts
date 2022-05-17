import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateParticleInteractionPrioritySort } from '../generators/particle';

import { Board } from '../types/board';
import { Round } from '../types/round';

import { GameDispatch, GameState } from '../store';
import { SetupCellsAction, setupCells } from './board';

export const redPhase = () => (dispatch: GameDispatch, getState: () => GameState) => {
  const game = getState();

  if (!game.round.current) {
    return;
  }

  const levels = game.board.cells[0].length - 1;
  const sectors = game.board.cells.length - 1;
  const nextSector = game.round.current?.sector === sectors ? 0 : game.round.current!.sector + 1;
  const prevSector = game.round.current?.sector === 0 ? sectors : game.round.current!.sector - 1;
  const nextParticle = game.board.cells[nextSector][game.round.current!.level].particle;
  const prevParticle = game.board.cells[prevSector][game.round.current!.level].particle;

  let cells: SetupCellsAction[] = [];

  if (nextParticle) {
    const aboveAvailable = game.round.current!.level < levels && !game.board.cells[nextSector][game.round.current!.level + 1].particle;
    const belowAvailable = game.round.current.level > 0 && !game.board.cells[nextSector][game.round.current!.level - 1].particle;
    if (aboveAvailable) {
      cells.push({
        sector: nextSector,
        level: game.round.current!.level + 1,
      });
    }
    if (belowAvailable) {
      cells.push({
        sector: nextSector,
        level: game.round.current!.level - 1,
      });
    }
    if (aboveAvailable || belowAvailable) {
      cells.push({
        sector: nextSector,
        level: game.round.current!.level,
      });
    }
  }

  if (prevParticle) {
    const aboveAvailable = game.round.current!.level < levels && !game.board.cells[prevSector][game.round.current!.level + 1].particle;
    const belowAvailable = game.round.current.level > 0 && !game.board.cells[prevSector][game.round.current!.level - 1].particle;
    if (aboveAvailable) {
      cells.push({
        sector: prevSector,
        level: game.round.current!.level + 1,
      });
    }
    if (belowAvailable) {
      cells.push({
        sector: prevSector,
        level: game.round.current!.level - 1,
      });
    }
    if (aboveAvailable || belowAvailable) {
      cells.push({
        sector: prevSector,
        level: game.round.current!.level,
      });
    }
  }

  dispatch(setupCells(cells));
}

export const bluePhase = () => (dispatch: GameDispatch, getState: () => GameState) => {

}

export const greenPhase = () => (dispatch: GameDispatch, getState: () => GameState) => {

}

export const roundSlice = createSlice({
  name: "round",
  initialState: {
    phases: [],
    queue: [],
  } as Round,
  reducers: {
    loadQueue: (round, action: PayloadAction<Board>) => {
      round.queue = action.payload.cells.flatMap(col => col.filter(cell => !!cell.particle))
        .sort((a, b) => generateParticleInteractionPrioritySort(a.particle!, b.particle!));
    },
    nextParticle: (round) => {
      round.queue = round.queue.slice(0, -1);
      round.current = round.queue[0];
      round.phases = [
        redPhase,
        bluePhase,
        greenPhase
      ];
    },
    nextPhase: (round) => {
      round.phases = round.phases.slice(0, -1);
    },
    endRound: (round) => {
      round.current = undefined;
      round.phases = [];
      round.queue = [];
    }
  },
});

export const { loadQueue, nextParticle, nextPhase, endRound } = roundSlice.actions;
export const roundReducer = roundSlice.reducer;

export const runPhase = () => (dispatch: GameDispatch, getState: () => GameState) => {
  const game = getState();
  if (game.round.queue.length < 1 && game.round.phases.length < 1) {
    dispatch(endRound());
    return;
  }
  if (game.round.phases.length < 1 && game.round.queue.length >= 1) {
    dispatch(nextParticle());
  }
  dispatch(game.round.phases[0]());
  dispatch(nextPhase());
}

export const startRound = () => (dispatch: GameDispatch, getState: () => GameState) => {
  const game = getState();
  dispatch(loadQueue(game.board));
  dispatch(runPhase());
}