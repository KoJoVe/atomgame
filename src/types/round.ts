import { ParticleColor } from "../helpers/particle";
import { Cell } from "./cell";

export type Round = {
  queue: Cell[];
  played: number[];
  phases: ParticleColor[];
  current?: number;
}