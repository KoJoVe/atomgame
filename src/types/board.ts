import { Directions } from "../helpers/directions";
import { Icons } from "../helpers/icons";
import { ParticleProperties } from "../helpers/particle";

import { Cell } from "./cell";
import { Particle } from "./particle";
import { PhaseAction } from "./phase";

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

export interface SetupCellAction {
  sector: number;
  level: number;
  glow?: number;
  icon?: Icons;
  phaseAction?: PhaseAction;
}

export type Board = {
  cells: Cell[][];
  hovered?: {
    sector: number;
    level: number;
  }
}
