import { moveParticle } from "../slices/board";
import { MoveParticleAction } from "../types/board";

export type PhaseActions = 
  "moveParticle" 

export type PhasePayloads = 
  MoveParticleAction

export const phaseActions: { [key in PhaseActions]: Function } = {
  moveParticle: moveParticle
}