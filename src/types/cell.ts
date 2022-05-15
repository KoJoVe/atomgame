import { Particle } from "./particle";
import { Game } from "./game";

export type Cell = {
  level: number;
  sector: number;
  particle?: Particle;
  action?: (game: Game) => Game;
  icon?: any;
  glow?: number;
}