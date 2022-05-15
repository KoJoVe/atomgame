import { Particle } from "../types/particle"

export const generateDeck = (): Particle[] => {
  return [
    { 
      vitality: 1,
      power: 0,
      swiftness: 0, 
    },
    { 
      vitality: 0,
      power: 1,
      swiftness: 0, 
    },
    { 
      vitality: 0,
      power: 0,
      swiftness: 1, 
    },
  ]
}