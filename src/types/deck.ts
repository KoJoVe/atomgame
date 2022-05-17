import { Particle } from "./particle";

export type Deck = {
  cards: Particle[];
  selected?: number;
}