import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

import { generateParticleInteractionPrioritySort } from "../generators/particle";

import { moveParticleDown, moveParticleUp } from "./particle";

import { Game } from "../types/game";
import { Cell } from "../types/cell";

export const setupParticlesRedPhaseActions = () => (game: Game): Game => {
  const cells = game.board.map(column => column.map(cell => {
    const nextSector = cell.sector === game.board.length - 1 ? 0 : cell.sector + 1; 
    const prevSector = cell.sector === 0 ? game.board.length - 1 : cell.sector - 1; 
    if (game.current?.sector !== nextSector &&
      game.current?.sector !== prevSector) {
      return cell;
    }
    const cellAbove = game.board[cell.sector][cell.level + 1];
    const cellBelow = game.board[cell.sector][cell.level - 1];
    if (
      game.current?.level + 1 === cell.level &&
      !cell.particle &&
      !!cellBelow.particle) {
      return {
        ...cell,
        glow: 1000,
        icon: ArrowUpIcon,
        action: moveParticleUp(cellBelow)
      }
    }
    if (
      game.current?.level - 1  === cell.level &&
      !cell.particle &&
      !!cellAbove.particle) {
      return {
        ...cell,
        glow: 1000,
        icon: ArrowDownIcon,
        action: moveParticleDown(cellAbove)
      }
    }
    if (game.current?.level === cell.level && 
      (!!cellAbove || !!cellBelow)) {
      return {
        ...cell,
        glow: 1000
      }
    }
    return cell;
  }));
  return {
    ...game,
    board: cells
  };
}

export const setupParticlesBluePhaseActions = () => (game: Game): Game => {
  const cells = game.board.map(column => column.map(cell => {
    const nextSector = cell.sector === game.board.length - 1 ? 0 : cell.sector + 1; 
    const prevSector = cell.sector === 0 ? game.board.length - 1 : cell.sector - 1; 
    if (game.current?.sector !== nextSector &&
      game.current?.sector !== prevSector) {
      return cell;
    }
    const cellAbove = game.board[cell.sector][cell.level + 1];
    const cellBelow = game.board[cell.sector][cell.level - 1];
    if (
      game.current?.level + 1 === cell.level &&
      !cell.particle &&
      !!cellBelow.particle) {
      return {
        ...cell,
        glow: 1000,
        icon: ArrowUpIcon,
        action: moveParticleUp(cellBelow)
      }
    }
    if (
      game.current?.level - 1  === cell.level &&
      !cell.particle &&
      !!cellAbove.particle) {
      return {
        ...cell,
        glow: 1000,
        icon: ArrowDownIcon,
        action: moveParticleDown(cellAbove)
      }
    }
    if (game.current?.level === cell.level && 
      (!!cellAbove || !!cellBelow)) {
      return {
        ...cell,
        glow: 1000
      }
    }
    return cell;
  }));
  return {
    ...game,
    board: cells
  };
}

export const setupParticlesGreenPhaseActions = () => (game: Game): Game => {
  const cells = game.board.map(column => column.map(cell => {
    const nextSector = cell.sector === game.board.length - 1 ? 0 : cell.sector + 1; 
    const prevSector = cell.sector === 0 ? game.board.length - 1 : cell.sector - 1; 
    if (game.current?.sector !== nextSector &&
      game.current?.sector !== prevSector) {
      return cell;
    }
    const cellAbove = game.board[cell.sector][cell.level + 1];
    const cellBelow = game.board[cell.sector][cell.level - 1];
    if (
      game.current?.level + 1 === cell.level &&
      !cell.particle &&
      !!cellBelow.particle) {
      return {
        ...cell,
        glow: 1000,
        icon: ArrowUpIcon,
        action: moveParticleUp(cellBelow)
      }
    }
    if (
      game.current?.level - 1  === cell.level &&
      !cell.particle &&
      !!cellAbove.particle) {
      return {
        ...cell,
        glow: 1000,
        icon: ArrowDownIcon,
        action: moveParticleDown(cellAbove)
      }
    }
    if (game.current?.level === cell.level && 
      (!!cellAbove || !!cellBelow)) {
      return {
        ...cell,
        glow: 1000
      }
    }
    return cell;
  }));
  return {
    ...game,
    board: cells
  };
}

export const initiateParticlesQueue = () => (game: Game): Game => {
  return {
    ...game,
    queue: game.board.flatMap(column => column.filter(cell => !!cell.particle))
      .sort((a, b) => generateParticleInteractionPrioritySort(a.particle!, b.particle!)),
  }
}

export const nextParticle = () => (game: Game): Game => {
  if (game.queue.length < 1) {
    return {
      ...game,
      phases: [],
      current: undefined
    }
  }

  const phases = [
    setupParticlesRedPhaseActions(),
    setupParticlesBluePhaseActions(),
    setupParticlesGreenPhaseActions(),
  ];
  
  return {
    ...game,
    queue: game.queue.splice(-1),
    current: game.queue[0],
    phases: phases
  }
}

export const nextPhase = () => (game: Game): Game => {
  if (game.phases.length < 1) {
    return nextParticle()(game);
  }
  return {
    ...game.phases[0]({
      ...game,
    }),
    phases: game.phases.splice(-1)
  }
}

export const interactParticles = () => (game: Game): Game => {
  return nextPhase()(nextParticle()(initiateParticlesQueue()(game)));
};

export const actParticle = (cell: Cell) => (game: Game): Game => {
  return cell.action ? nextPhase()(cell.action(game)) : game;
}