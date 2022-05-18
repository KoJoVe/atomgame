import { Cell } from "./cell";
import { Particle } from "./particle";

export interface InsertParticleAction {
  sector: number;
  level: number;
  particle: Particle;
}

export interface MoveParticleAction {
    sector: number;
    level: number;
  direction: "up" | "down" | "left" | "right";
}

export type Board = {
  cells: Cell[][];
  hovered?: {
    sector: number;
    level: number;
  }
}
