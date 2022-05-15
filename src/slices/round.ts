import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateParticleInteractionPrioritySort } from '../generators/particle';

import { Board } from '../types/board';
import { Round } from '../types/round';

import { GameDispatch, GameState } from '../store';

export const redPhase = () => (dispatch: GameDispatch, getState: () => GameState) => {
  const game = getState();
  
}

export const bluePhase = () => (dispatch: GameDispatch, getState: () => GameState) => {

}

export const greenPhase = () => (dispatch: GameDispatch, getState: () => GameState) => {

}

export const roundSlice = createSlice({
  name: "round",
  initialState: {} as Round,
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