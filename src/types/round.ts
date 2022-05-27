import { ParticleColor } from "../helpers/particle";
import { Cell } from "./cell";

export type Round = {
  queue: Cell[];
  phases: ParticleColor[];
  current?: number;
}