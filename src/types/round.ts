import { Cell } from "./cell";
import { ParticleColor } from "../helpers/particle";

export type Round = {
  queue: number[];
  phases: ParticleColor[];
  current?: number;
}