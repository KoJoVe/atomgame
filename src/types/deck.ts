import { Card } from "./card";

export type Deck = {
  cards: Card[];
  selected?: number;
  deleting?: boolean;
}