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

  const generatePhaseAction = (target: Cell, current: Cell, direction: Directions, swap = false): PhaseAction => {
    return {
      target: {
        sector: target.sector,
        level: target.level,  
        icon: direction === "up" ? "ArrowUpIcon" : "ArrowDownIcon",
      },
      steps: [
        {
          action: !swap ? "moveParticle" : "swapParticles",
          payload: !swap ? {
            sector: current.sector,
            level: current.level,
            direction: direction  
          } : {
            sectorOne: target.sector,
            levelOne: target.level,
            sectorTwo: current.sector,
            levelTwo: current.level
          }
        }
      ]
    }
  }

  if (aboveCell) {
    if (aboveCell.particle && current.particle!.vitality > aboveCell.particle!.vitality) {
      phaseActions.push(generatePhaseAction(aboveCell, current!, "up", true));
    }
    if (!aboveCell.particle) {
      phaseActions.push(generatePhaseAction(aboveCell, current!, "up"));
    }
  }

  if (belowCell) {
    if (belowCell.particle && current.particle!.vitality > belowCell.particle!.vitality) {
      phaseActions.push(generatePhaseAction(belowCell, current!, "down", true));
    }
    if (!belowCell.particle) {
      phaseActions.push(generatePhaseAction(belowCell, current!, "down"));
    }
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

  const generatePhaseAction = (target: Cell, current: Cell, power: number, followUp?: Cell): PhaseAction => {
    const color = current.particle!.power >= target.particle!.power ? 
      generateParticleColor(target.particle!) : generateParticleColor(current.particle!);
    const property = particleColorMap[color];
    const amount = Math.abs(target.particle![property]) - power > 0 ? power : Math.abs(target.particle![property]);

    const extraStep: PhaseStep | undefined = followUp && (
      followUp.particle ?
      {
        action: "updateParticle",
        payload: {
          sector: followUp.sector,
          level: followUp.level,
          property: property,
          amount: followUp.particle[property] + (followUp.particle[property] < 0 ? -amount : amount)
        }
      } :
      {
        action: "insertParticle",
        payload: {
          sector: followUp.sector,
          level: followUp.level,
          particle: {
            ...generateEmptyParticle(),
            [property]: target.particle![property] < 0 ? -amount : amount
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
          property: property,
          amount: target.particle![property] > 0 ? 
            target.particle![property] - amount : 
            target.particle![property] + amount
        }
      }
    ]

    if (!!extraStep) {
      steps.push(extraStep);
    }

    return {
      target: {
        sector: target.sector,
        level: target.level,  
        icon: "LightiningIcon",
      },
      steps: steps
    }
  }

  const power = current.particle!.power;

  if (aboveCell && aboveCell.particle) {
    const followUp = game.board.cells[aboveCell.sector][aboveCell.level + 1];
    phaseActions.push(generatePhaseAction(aboveCell, current!, power, followUp));
  }

  if (belowCell && belowCell.particle) {      
    const followUp = game.board.cells[belowCell.sector][belowCell.level - 1];
    phaseActions.push(generatePhaseAction(belowCell, current!, power, followUp));
  }

  if (leftCell && leftCell.particle) {      
    const followUp = leftCell.sector === 0 ? game.board.cells[columns][leftCell.level] : game.board.cells[leftCell.sector - 1][leftCell.level];
    phaseActions.push(generatePhaseAction(leftCell, current!, power, followUp));
  }

  if (rightCell && rightCell.particle) {      
    const followUp = rightCell.sector === columns ? game.board.cells[0][rightCell.level] : game.board.cells[rightCell.sector + 1][rightCell.level];
    phaseActions.push(generatePhaseAction(rightCell, current!, power, followUp));
  }

  return phaseActions;
}

export const generateGreenPhase = (game: GameState): PhaseAction[] => {
  if (game.round.current === undefined) {
    return [];
  }

  const current = game.board.cells.flatMap(col => col.map(cell => cell)).find(cell => cell.particle?.id === game.round.current);
  if (!current || current!.particle!.swiftness === 0) {
    return [];
  }

  const columns = game.board.cells.length - 1;
  const absSwiftnes = Math.abs(current!.particle!.swiftness);

  let phaseSteps: PhaseStep[] = [];
  let swiftness = current!.particle!.swiftness;
  let sector = current.sector;
  let level = current.level;

  for (let i = 0; i < absSwiftnes; i++) {
    const direction = swiftness > 0 ? "right" : "left";

    if (direction === "right") {
      const rightCell = sector === columns ? game.board.cells[0][level] : game.board.cells[sector + 1][level];
      if (!rightCell.particle) {
        phaseSteps.push({
          action: "moveParticle",
          payload: {
            sector: sector,
            level: level,
            direction: "right"
          }
        });
        sector = rightCell.sector;
      } else {
        phaseSteps.push({
          action: "updateParticle",
          payload: {
            sector: sector,
            level: level,
            property: "swiftness",
            amount: swiftness * -1
          }
        });
        if (
          (swiftness < 0 && rightCell.particle.swiftness > 0) ||
          (swiftness > 0 && rightCell.particle.swiftness < 0)
        ) {
          phaseSteps.push({
            action: "updateParticle",
            payload: {
              sector: rightCell.sector,
              level: rightCell.level,
              property: "swiftness",
              amount: rightCell.particle!.swiftness * -1
            }
          });
        }
        swiftness = swiftness * -1;        
      }
    }

    if (direction === "left") {
      const leftCell = sector === 0 ? game.board.cells[columns][level] : game.board.cells[sector - 1][level];
      if (!leftCell.particle) {
        phaseSteps.push({
          action: "moveParticle",
          payload: {
            sector: sector,
            level: level,
            direction: "left"
          }
        });
        sector = leftCell.sector;
      } else {
        phaseSteps.push({
          action: "updateParticle",
          payload: {
            sector: sector,
            level: level,
            property: "swiftness",
            amount: swiftness * -1
          }
        });
        if (
          (swiftness < 0 && leftCell.particle.swiftness > 0) ||
          (swiftness > 0 && leftCell.particle.swiftness < 0)
        ) {
          phaseSteps.push({
            action: "updateParticle",
            payload: {
              sector: leftCell.sector,
              level: leftCell.level,
              property: "swiftness",
              amount: leftCell.particle!.swiftness * -1
            }
          });
        }
        swiftness = swiftness * -1;        
      }
    }
  }

  return [{
    steps: phaseSteps
  }];
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

  if (Math.abs(particle!.swiftness) > 0) {
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