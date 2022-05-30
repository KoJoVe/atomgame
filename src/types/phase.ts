import { Icons } from "../helpers/icons";
import { PhaseActionIdentifier, PhasePayload } from "../helpers/phase";

export type PhaseBoardTarget = {
  id?: number;
  level?: number;
  sector?: number;
  icon?: Icons;
}

export type PhaseStep = {
  action: PhaseActionIdentifier;
  payload: PhasePayload;
}

export type PhaseAction = {
  steps: PhaseStep[];
  target?: PhaseBoardTarget,
}