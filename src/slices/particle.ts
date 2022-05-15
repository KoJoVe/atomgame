import { Game } from "../types/game";
import { Cell } from "../types/cell";

const moveParticle = (cell: Cell) => (game: Game, direction: "up" | "down" | "left" | "right"): Game => {
  return {
    ...game,
    board: game.board.map(column => column.map(c => {
      const levelOffset = (direction === "left" || direction === "right" ? 0 : direction === "down" ? -1 : 1);
      const sectorOffset = (direction === "up" || direction === "down" ? 0 : direction === "left" ? -1 : 1);
      if (c.level === cell.level && c.sector === cell.sector) {
        return { ...c, particle: undefined }
      }
      if (c.level === cell.level + levelOffset && c.sector === cell.sector + sectorOffset) {
        return { ...c, particle: game.board[cell.sector][cell.sector].particle }
      }
      return c;
    }))
  }
}

export const moveParticleUp = (cell: Cell) => (game: Game): Game => {
  return moveParticle(cell)(game, "up");
}

export const moveParticleDown = (cell: Cell) => (game: Game): Game => {
  return moveParticle(cell)(game, "down");
}

export const moveParticleLeft = (cell: Cell) => (game: Game): Game => {
  return moveParticle(cell)(game, "left");
}

export const moveParticleRight = (cell: Cell) => (game: Game): Game => {
  return moveParticle(cell)(game, "right");
}