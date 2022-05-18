import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateParticleInteractionPrioritySort } from '../generators/particle';
import { generatePhases, generatePhasesStrings } from '../generators/phase';

import { phaseActions } from '../helpers/phase';

import { Board } from '../types/board';
import { Round } from '../types/round';
import { Cell } from '../types/cell';
import { GameDispatch, GameState } from '../store';

import { reloadCells, setupCells } from './board';

export const roundSlice = createSlice({
  name: "round",
  initialState: {
    phases: [],
    queue: [],
  } as Round,
  reducers: {
    loadQueue: (round, action: PayloadAction<Board>) => {
      round.current = undefined;
      round.phases = [];
      round.queue = action.payload.cells
        .flatMap(col => col.map(cell => cell))
        .filter(cell => !!cell.particle)
        .sort((a, b) => generateParticleInteractionPrioritySort(a.particle!, b.particle!))
        .map(cell => cell.particle!.id);
    },
    nextParticle: (round) => {
      round.current = round.queue[0];
      round.queue = round.queue.slice(1);
      round.phases = generatePhasesStrings();
    },
    nextPhase: (round) => {
      round.phases = round.phases.slice(1);
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

export const preparePhase = () => (dispatch: GameDispatch, getState: () => GameState) => {
  const game = getState();
  const phases = generatePhases();
  
  if (game.round.phases.length < 1 && game.round.queue.length >= 1) {
    dispatch(nextParticle());
  }
  if (game.round.queue.length < 1 && game.round.phases.length < 1) {
    dispatch(reloadCells());
    dispatch(endRound());
    return;
  }
  
  const updatedRoundGame = getState();
  const cells = phases[updatedRoundGame.round.phases[0]](updatedRoundGame);

  if (cells.length > 0) {
    dispatch(setupCells(cells));
  } else {
    dispatch(nextPhase());
    dispatch(preparePhase());
  }
}

export const runPhase = (cell: Cell) => (dispatch: GameDispatch) => {
  dispatch(nextPhase());

  if (!cell.phase?.action || !cell.phase?.payload) {
    return;
  }

  dispatch(phaseActions[cell.phase?.action!](cell.phase?.payload!));
  dispatch(preparePhase());
}

export const startRound = () => (dispatch: GameDispatch, getState: () => GameState) => {
  dispatch(loadQueue(getState().board));
  dispatch(preparePhase());
}