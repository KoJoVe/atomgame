import { Particle } from "./particle";

export type Cell = {
  level: number;
  sector: number;
  particle?: Particle;
  action?: Function;
  glow?: number;
  icon?: any;
}