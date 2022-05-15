import { Game } from "../types/game";

export const generateGame = (): Game => {
  return { 
    player: {},
    board: [],
    deck: [],
    queue: [],
    phases: []
  }
}