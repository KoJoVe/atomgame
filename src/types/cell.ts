import { Icons } from "../helpers/icons";
import { Particle } from "./particle";

export type Cell = {
  level: number;
  sector: number;
  particle?: Particle;
  highlighted?: boolean;
  _valid?: boolean;
}