import { ParticleColor } from "./particle";

export type InteractionChart = { 
  [key in ParticleColor]: {
    [key in ParticleColor]: {
      win: ParticleColor,
      loss: ParticleColor
    }
  } 
}