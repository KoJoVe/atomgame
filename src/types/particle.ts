import { ParticleProperties } from "../helpers/particle";

export type Particle = {
  [key in ParticleProperties]: number; 
} 