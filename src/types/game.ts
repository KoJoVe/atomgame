import { Cell } from "./cell";
import { Particle } from "./particle";
import { Player } from "./player";

export interface Game {
  player: Player;
  board: Cell[][];
  deck: Particle[];
  queue: Cell[];
  phases: ((game: Game) => Game)[];
  current?: Cell;
}