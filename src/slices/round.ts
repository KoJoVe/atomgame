import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { generateParticleInteractionPrioritySort } from '../generators/particle';
import { generatePhases, generatePhasesStrings } from '../generators/phase';

import { phaseActions } from '../helpers/phase';
import { sleep } from '../helpers/sleep';

import { Board } from '../types/board';
import { Round } from '../types/round';
import { Cell } from '../types/cell';
import { PhaseAction } from '../types/phase';
import { GameDispatch, GameState } from '../store';

import { reloadCells, setupCells } from './board';

import { WAIT } from '../constants';

export const roundSlice = createSlice({
  name: "round",
  initialState: {
    phases: [],
    queue: [],
  } as Round,
  reducers: {
    loadQueue: (round: Round, action: PayloadAction<Board>) => {
      round.current = undefined;
      round.phases = [];
      round.queue = action.payload.cells
        .flatMap(col => col.map(cell => cell))
        .filter(cell => !!cell.particle)
        .sort((a, b) => generateParticleInteractionPrioritySort(a.particle!, b.particle!));
    },
    nextParticle: (round: Round) => {
      const cell = round.queue[0];
      round.current = cell && cell.particle?.id;
      round.queue = round.queue.slice(1);
      round.phases = generatePhasesStrings(cell.particle);
    },
    nextPhase: (round: Round) => {
      round.phases = round.phases.slice(1);
    },
    endRound: (round: Round) => {
      round.current = undefined;
      round.phases = [];
      round.queue = [];
    }
  },
});

export const { loadQueue, nextParticle, nextPhase, endRound } = roundSlice.actions;
export const roundReducer = roundSlice.reducer;

export const runPhaseAction = async (phaseAction: PhaseAction, dispatch: GameDispatch) => {
  if (!phaseAction.steps || phaseAction.steps.length < 1) {
    return;
  }

  for (let i = 0; i < phaseAction.steps.length; i++) {
    dispatch(phaseActions[phaseAction.steps[i].action](phaseAction.steps[i].payload));
    dispatch(reloadCells());
    await sleep(WAIT);      
  }

  return;
}

export const loadPhase = () => async (dispatch: GameDispatch, getState: () => GameState) => {
  const game = getState();
  const phases = generatePhases();
  
  if (game.round.phases.length < 1 && game.round.queue.length >= 1) {
    dispatch(nextParticle());
  }
  if (game.round.queue.length < 1 && game.round.phases.length < 1) {
    dispatch(endRound());
    return;
  }
  
  const updatedRoundGame = getState();
  const phaseActions = phases[updatedRoundGame.round.phases[0]](updatedRoundGame);

  const targets = phaseActions.filter(a => a.target).map(action => {
    return {
      sector: action.target?.sector,
      level: action.target?.level,
      icon: action.target?.icon,
      phaseAction: action
    } as Cell;
  });

  const autorun = phaseActions.filter(a => !a.target);
  autorun.forEach(a => runPhaseAction(a, dispatch));

  if (targets.length > 0) {
    dispatch(setupCells(targets));
  } else {
    const current = updatedRoundGame.board.cells
      .flatMap(col => col.map(cell => cell))
      .find(cell => cell.particle?.id === updatedRoundGame.round.current);

    if (!!current) {
      await sleep(WAIT);
    }

    dispatch(nextPhase());
    dispatch(loadPhase());
  }
}

export const runCellPhaseAction = (cell: Cell) => async (dispatch: GameDispatch) => {
  if (!cell || !cell.phaseAction) {
    return;
  }

  await runPhaseAction(cell.phaseAction, dispatch);

  dispatch(nextPhase());
  dispatch(loadPhase());
}

export const startRound = () => (dispatch: GameDispatch, getState: () => GameState) => {
  dispatch(loadQueue(getState().board));
  dispatch(loadPhase());
}