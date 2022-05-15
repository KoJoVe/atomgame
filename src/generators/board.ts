import { Cell } from "../types/cell";

export const generateBoard = (columns: number, levels: number, ): Cell[][] => {
  let cells: Cell[][] = [];
  for (let i = 0; i < columns; i++) {
    cells.push([]);
    for (let j = 0; j < levels - 1; j++) {
      cells[i].push({ sector: i, level: j });
    }
  }
  return cells;
}