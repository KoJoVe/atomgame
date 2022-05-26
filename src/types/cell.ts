import { Icons } from "../helpers/icons";
import { PhaseActions, PhasePayloads } from "../helpers/phase";

import { Particle } from "./particle";

export type Cell = {
  level: number;
  sector: number;
  particle?: Particle;
  glow?: number;
  icon?: Icons;
  phaseActions?: {
    action: PhaseActions;
    payload: PhasePayloads;
    autorun?: boolean;
  }[];
}