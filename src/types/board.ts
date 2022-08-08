import { Color } from "../helpers/color";
import { Card } from "./card";
import { Cell } from "./cell";
import { Nucleus } from "./nucleus";

export interface DeleteCurrentAction {
  card: Card;
}

export interface ApplyCurrentAction {
  card: Card;
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
