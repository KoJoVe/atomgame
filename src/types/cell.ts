import { Icons } from "../helpers/icons";

import { Particle } from "./particle";
import { PhaseAction } from "./phase";

export type Cell = {
  level: number;
  sector: number;
  particle?: Particle;
  glow?: number;
  icon?: Icons;
  phaseAction?: PhaseAction;
}