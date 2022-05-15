import { Cell } from "./cell";

export type Round = {
  queue: Cell[];
  phases: any[];
  current?: Cell;
}