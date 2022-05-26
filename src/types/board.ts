import { Directions } from "../helpers/directions";
import { ParticleProperties } from "../helpers/particle";
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
  direction: Directions;
}

export interface UpdateParticleAction {
  sector: number;
  level: number;
  property: ParticleProperties;
  amount: number;
}

export interface SwapParticlesAction {
  sectorOne: number;
  levelOne: number;
  sectorTwo: number;
  levelTwo: number;
}

export type Board = {
  cells: Cell[][];
  hovered?: {
    sector: number;
    level: number;
  }
}
