import { Cell } from "./cell";

export type Round = {
  queue: Cell[];
  phases: Function[];
  current?: Cell;
}