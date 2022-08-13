import { Color } from "../helpers/color";
import { Card } from "./card";
import { Cell } from "./cell";
import { Nucleus } from "./nucleus";

export interface UpdateBoardAction {
  board: Board;
}

export interface HighlightCellAction {
  sector?: number;
  level?: number;
  color?: Color;
}

export interface UnHighlightCellAction {
  sector?: number;
  level?: number;
}

export type Board = {
  cells: Cell[][];
  nucleus: Nucleus;
}
