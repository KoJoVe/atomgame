import { Directions } from "../helpers/directions";
import { ParticleColor, particleColorMap } from "../helpers/particle";
import { GameState } from "../store";
import { Cell } from "../types/cell";
import { generateParticleColor } from "./particle";

export const generateRedPhase = (game: GameState): Cell[] => {
  if (game.round.current === undefined) {
    return [];
  }

  const current = game.board.cells.flatMap(col => col.map(cell => cell)).find(cell => cell.particle?.id === game.round.current);
  if (current!.particle!.vitality < 1) {
    return [];
  }
  
  const levels = game.board.cells[0].length - 1;
  const aboveCell = current!.level < levels && game.board.cells[current!.sector][current!.level + 1];
  const belowCell = current!.level > 0 && game.board.cells[current!.sector][current!.level - 1];

  let cells: Cell[] = [];

  const generateCellActions = (cell: Cell, current: Cell, direction: Directions): Cell => {
    return {
      sector: cell.sector,
      level: cell.level,
      icon: direction === "up" ? "ArrowUpIcon" : "ArrowDownIcon",
      phaseActions: [
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
    cells.push(generateCellActions(aboveCell, current!, "up"));
  }

  if (belowCell && !belowCell.particle) {
    cells.push(generateCellActions(belowCell, current!, "down"));
  }

  return cells;
}

export const generateBluePhase = (game: GameState): Cell[] => {
  if (game.round.current === undefined) {
    return [];
  }

  const current = game.board.cells.flatMap(col => col.map(cell => cell)).find(cell => cell.particle?.id === game.round.current);
  if (current!.particle!.power < 1) {
    return [];
  }
  
  const levels = game.board.cells[0].length - 1;
  const columns = game.board.cells.length - 1;

  const aboveCell = current!.level < levels && game.board.cells[current!.sector][current!.level + 1];
  const belowCell = current!.level > 0 && game.board.cells[current!.sector][current!.level - 1];
  const leftCell = current!.sector === 0 ? game.board.cells[columns][current!.level] : game.board.cells[current!.sector - 1][current!.level];
  const rightCell = current!.sector === columns ? game.board.cells[0][current!.level] : game.board.cells[current!.sector + 1][current!.level];

  let cells: Cell[] = [];

  if (aboveCell && aboveCell.particle) {
    const powerDif = current!.particle!.power - aboveCell.particle!.power;
    const color = current!.particle!.power >= aboveCell.particle!.power ? 
      generateParticleColor(aboveCell.particle!) : generateParticleColor(current!.particle!);
      
    cells.push({
      sector: current!.sector,
      level: current!.level + 1,
      icon: "LightiningIcon",
      phaseActions: [
        {
          action: "updateParticle",
          payload: {
            sector: current!.sector,
            level: current!.level,
            property: particleColorMap[color],
            amount: powerDif
          }
        },
        {
          action: "updateParticle",
          payload: {
            sector: current!.sector,
            level: current!.level + 1,
            property: particleColorMap[color],
            amount: -powerDif
          }
        }
      ]
    });
  }

  if (belowCell && belowCell.particle) {
    const powerDif = current!.particle!.power - belowCell.particle!.power;
    const color = current!.particle!.power >= belowCell.particle!.power ? 
      generateParticleColor(belowCell.particle!) : generateParticleColor(current!.particle!);
      
    cells.push({
      sector: current!.sector,
      level: current!.level - 1,
      icon: "LightiningIcon",
      phaseActions: [
        {
          action: "updateParticle",
          payload: {
            sector: current!.sector,
            level: current!.level,
            property: particleColorMap[color],
            amount: powerDif
          }
        },
        {
          action: "updateParticle",
          payload: {
            sector: current!.sector,
            level: current!.level - 1,
            property: particleColorMap[color],
            amount: -powerDif
          }
        }
      ]
    });
  }

  if (leftCell && leftCell.particle) {
    const powerDif = current!.particle!.power - leftCell.particle!.power;
    const color = current!.particle!.power >= leftCell.particle!.power ? 
      generateParticleColor(leftCell.particle!) : generateParticleColor(current!.particle!);
      
    cells.push({
      sector: current!.sector,
      level: current!.level + 1,
      icon: "LightiningIcon",
      phaseActions: [
        {
          action: "updateParticle",
          payload: {
            sector: current!.sector,
            level: current!.level,
            property: particleColorMap[color],
            amount: powerDif
          }
        },
        {
          action: "updateParticle",
          payload: {
            sector: current!.sector,
            level: current!.level + 1,
            property: particleColorMap[color],
            amount: -powerDif
          }
        }
      ]
    });
  }

  if (rightCell && rightCell.particle) {
    const powerDif = current!.particle!.power - rightCell.particle!.power;
    const color = current!.particle!.power >= rightCell.particle!.power ? 
      generateParticleColor(rightCell.particle!) : generateParticleColor(current!.particle!);
      
    cells.push({
      sector: current!.sector,
      level: current!.level + 1,
      icon: "LightiningIcon",
      phaseActions: [
        {
          action: "updateParticle",
          payload: {
            sector: current!.sector,
            level: current!.level,
            property: particleColorMap[color],
            amount: powerDif
          }
        },
        {
          action: "updateParticle",
          payload: {
            sector: current!.sector,
            level: current!.level + 1,
            property: particleColorMap[color],
            amount: -powerDif
          }
        }
      ]
    });
  }

  return cells;
}

export const generateGreenPhase = (game: GameState): Cell[] => {
  if (game.round.current === undefined) {
    return [];
  }

  return [];
}

export const generatePhases = (): { [key in ParticleColor]: (game: GameState) => Cell[] } => {
  return {
    red: generateRedPhase,
    blue: generateBluePhase,
    green: generateGreenPhase
  }
}

export const generatePhasesStrings = (): ParticleColor[] => ["red"];