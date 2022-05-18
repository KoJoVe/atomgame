import { ParticleColor } from "../helpers/particle";
import { GameState } from "../store";
import { Cell } from "../types/cell";

export const generateRedPhase = (game: GameState) => {
  if (game.round.current === undefined) {
    return [];
  }

  const current = game.board.cells.flatMap(col => col.map(cell => cell)).find(cell => cell.particle?.id === game.round.current);
  const levels = game.board.cells[0].length - 1;
  const sectors = game.board.cells.length - 1;
  const nextSector = current!.sector === sectors ? 0 : current!.sector + 1;
  const prevSector = current!.sector === 0 ? sectors : current!.sector - 1;
  const nextParticle = game.board.cells[nextSector][current!.level].particle;
  const prevParticle = game.board.cells[prevSector][current!.level].particle;

  let cells: Cell[] = [];

  if (nextParticle) {
    const aboveAvailable = current!.level < levels && !game.board.cells[nextSector][current!.level + 1].particle;
    const belowAvailable = current!.level > 0 && !game.board.cells[nextSector][current!.level - 1].particle;
    if (aboveAvailable) {
      cells.push({
        sector: nextSector,
        level: current!.level + 1,
        icon: "ArrowUpIcon",
        phase: {
          action: "moveParticle",
          payload: {
           sector: nextSector,
           level: current!.level,
           direction: "up"  
          }
        }
      });
    }
    if (belowAvailable) {
      cells.push({
        sector: nextSector,
        level: current!.level - 1,
        icon: "ArrowDownIcon",
        phase: {
          action: "moveParticle",
          payload: {
           sector: nextSector,
           level: current!.level,
           direction: "down"  
          }
        }
      });
    }
    if (aboveAvailable || belowAvailable) {
      cells.push({
        sector: nextSector,
        level: current!.level,
        glow: 3000,
      });
    }
  }

  if (prevParticle) {
    const aboveAvailable = current!.level < levels && !game.board.cells[prevSector][current!.level + 1].particle;
    const belowAvailable = current!.level > 0 && !game.board.cells[prevSector][current!.level - 1].particle;
    if (aboveAvailable) {
      cells.push({
        sector: prevSector,
        level: current!.level + 1,
        icon: "ArrowUpIcon",
        phase: {
          action: "moveParticle",
          payload: {
           sector: prevSector,
           level: current!.level,
           direction: "up"  
          }
        }
      });
    }
    if (belowAvailable) {
      cells.push({
        sector: prevSector,
        level: current!.level - 1,
        icon: "ArrowDownIcon",
        phase: {
          action: "moveParticle",
          payload: {
           sector: prevSector,
           level: current!.level,
           direction: "down"  
          }
        }
      });
    }
    if (aboveAvailable || belowAvailable) {
      cells.push({
        sector: prevSector,
        level: current!.level,
        glow: 3000,
      });
    }
  }

  return cells;
}

export const generateBluePhase = (game: GameState) => {
  return [];
}

export const generateGreenPhase = (game: GameState) => {
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