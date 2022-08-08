import { Color } from "../helpers/color";
import { Cell } from "./cell";
import { Nucleus } from "./nucleus";

export interface Card {
  name: string;
  color: Color;
  cells: Cell[];
  nucleus: Nucleus;
  loose: boolean;
}