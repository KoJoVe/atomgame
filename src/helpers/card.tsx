import { Card } from "../types/card";
import { Cell } from "../types/cell";
import { Color } from "./color";
import { COLUMNS } from "../constants";

export const rotateCard = (card: Card | undefined, rotation: number): Card | undefined => {
  if (card === undefined) {
    return;
  }
  return { 
    ...card, 
    cells: card.cells.map(cell => ({
      ...cell,
      sector: cell.sector + rotation > COLUMNS - 1 ? cell.sector + rotation - COLUMNS : cell.sector + rotation
    })) 
  }
}

export const getLooseCard = (card: Card, highlighted: Cell): Card => {
  return { 
    ...card,
    nucleus: { particles: { red: 0, green: 0, blue: 0 } }, 
    cells: [
      { 
        sector: highlighted.sector, 
        level: highlighted.level, 
        particle: {
          color: Object.keys(card.nucleus.particles).find(k => card.nucleus.particles[k as Color] > 0) as Color
        } 
      }
    ]
  }
}