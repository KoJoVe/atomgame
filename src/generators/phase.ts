import { Directions } from "../helpers/directions";
import { ParticleColor, particleColorMap } from "../helpers/particle";

import { generateEmptyParticle, generateParticleColor } from "./particle";

import { Cell } from "../types/cell";
import { Particle } from "../types/particle";

import { GameState } from "../store";
import { PhaseAction, PhaseStep } from "../types/phase";

export const generateRedPhase = (game: GameState): PhaseAction[] => {
  if (game.round.current === undefined) {
    return [];
  }

  const current = game.board.cells.flatMap(col => col.map(cell => cell)).find(cell => cell.particle?.id === game.round.current);
  if (!current || current!.particle!.vitality < 1) {
    return [];
  }
  
  const levels = game.board.cells[0].length - 1;
  const aboveCell = current!.level < levels && game.board.cells[current!.sector][current!.level + 1];
  const belowCell = current!.level > 0 && game.board.cells[current!.sector][current!.level - 1];

  let phaseActions: PhaseAction[] = [];

  const generatePhaseAction = (target: Cell, current: Cell, direction: Directions): PhaseAction => {
    return {
      target: {
        sector: target.sector,
        level: target.level,  
        icon: direction === "up" ? "ArrowUpIcon" : "ArrowDownIcon",
      },
      steps: [
        {
          action: "moveParticle",
          payload: {
            sector: current.sector,
            level: current.level,
            direction: direction  
          }
        }
      ]
    }
  }

  if (aboveCell && !aboveCell.particle) {
    phaseActions.push(generatePhaseAction(aboveCell, current!, "up"));
  }

  if (belowCell && !belowCell.particle) {
    phaseActions.push(generatePhaseAction(belowCell, current!, "down"));
  }

  return phaseActions;
}

export const generateBluePhase = (game: GameState): PhaseAction[] => {
  if (game.round.current === undefined) {
    return [];
  }

  const current = game.board.cells.flatMap(col => col.map(cell => cell)).find(cell => cell.particle?.id === game.round.current);
  if (!current || current!.particle!.power < 1) {
    return [];
  }
  
  const levels = game.board.cells[0].length - 1;
  const columns = game.board.cells.length - 1;

  const aboveCell = current!.level < levels && game.board.cells[current!.sector][current!.level + 1];
  const belowCell = current!.level > 0 && game.board.cells[current!.sector][current!.level - 1];
  const leftCell = current!.sector === 0 ? game.board.cells[columns][current!.level] : game.board.cells[current!.sector - 1][current!.level];
  const rightCell = current!.sector === columns ? game.board.cells[0][current!.level] : game.board.cells[current!.sector + 1][current!.level];

  let phaseActions: PhaseAction[] = [];

  const generatePhaseAction = (target: Cell, current: Cell, powerDif: number, followUp?: Cell): PhaseAction => {
    const color = current.particle!.power >= target.particle!.power ? 
      generateParticleColor(target.particle!) : generateParticleColor(current.particle!);

    const extraStep: PhaseStep | undefined = followUp && (
      followUp.particle ?
      {
        action: "updateParticle",
        payload: {
          sector: followUp.sector,
          level: followUp.level,
          property: particleColorMap[color],
          amount: powerDif
        }
      } :
      {
        action: "insertParticle",
        payload: {
          sector: followUp.sector,
          level: followUp.level,
          particle: {
            ...generateEmptyParticle(),
            [color]: powerDif
          }
        }
      }
    )

    let steps: PhaseStep[] = [
      {
        action: "updateParticle",
        payload: {
          sector: target.sector,
          level: target.level,
          property: particleColorMap[color],
          amount: -powerDif
        }
      }
    ]

    if (!!extraStep) {
      steps.push(extraStep);
    }

    // if (!followUp && target.level === 0) {
    //   steps.push({
        
    //   })
    // }

    return {
      target: {
        sector: target.sector,
        level: target.level,  
        icon: "LightiningIcon",
      },
      steps: steps
    }
  }

  //TODO: Need to add follow up

  if (aboveCell && aboveCell.particle) {
    const powerDif = current.particle!.power - aboveCell.particle!.power;
    if (powerDif !== 0) {
      phaseActions.push(generatePhaseAction(aboveCell, current!, powerDif));
    }
  }

  if (belowCell && belowCell.particle) {      
    const powerDif = current.particle!.power - belowCell.particle!.power;
    if (powerDif !== 0) {
      phaseActions.push(generatePhaseAction(belowCell, current!, powerDif));
    }
  }

  if (leftCell && leftCell.particle) {      
    const powerDif = current.particle!.power - leftCell.particle!.power;
    if (powerDif !== 0) {
      phaseActions.push(generatePhaseAction(leftCell, current!, powerDif));
    }
  }

  if (rightCell && rightCell.particle) {      
    const powerDif = current.particle!.power - rightCell.particle!.power;
    if (powerDif !== 0) {
      phaseActions.push(generatePhaseAction(rightCell, current!, powerDif));
    }
  }

  return phaseActions;
}

export const generateGreenPhase = (game: GameState): PhaseAction[] => {
  if (game.round.current === undefined) {
    return [];
  }

  return [];
}

export const generatePhases = (): { [key in ParticleColor]: (game: GameState) => PhaseAction[] } => {
  return {
    red: generateRedPhase,
    blue: generateBluePhase,
    green: generateGreenPhase
  }
}

export const generatePhasesStrings = (particle?: Particle): ParticleColor[] => {
  let phases: ParticleColor[] = [];

  if (!particle) {
    return [];
  }

  if (particle?.swiftness > 0) {
    phases.push("green");
  }
  if (particle?.power > 0) {
    phases.push("blue");
  }
  if (particle?.vitality > 0) {
    phases.push("red");
  }
  
  return phases;
};