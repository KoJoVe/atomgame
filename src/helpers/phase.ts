import { 
  insertParticle, 
  moveParticle, 
  updateParticle, 
  swapParticles, 
} from "../slices/board";

import { 
  InsertParticleAction,
  MoveParticleAction,
  UpdateParticleAction,
  SwapParticlesAction
} from "../types/board";

export type PhaseActionIdentifier = 
  "insertParticle" |
  "moveParticle" |
  "updateParticle" |
  "swapParticles"

export type PhasePayload = 
  InsertParticleAction |
  MoveParticleAction |
  UpdateParticleAction |
  SwapParticlesAction
  
export const phaseActions: { [key in PhaseActionIdentifier]: Function } = {
  insertParticle: insertParticle,
  moveParticle: moveParticle,
  updateParticle: updateParticle,
  swapParticles: swapParticles,
}