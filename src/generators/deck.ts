import { Particle } from "../types/particle";

export const generateDeck = (): Particle[] => {
  return [
    { 
      id: 0,
      vitality: 1,
      power: 0,
      swiftness: 0, 
    },
    { 
      id: 1,
      vitality: 0,
      power: 1,
      swiftness: 0, 
    },
    { 
      id: 2,
      vitality: 0,
      power: 0,
      swiftness: 1, 
    }
  ]
}