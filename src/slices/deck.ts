import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { generateDeck } from '../generators/deck';

import { Deck } from '../types/deck';

export const deckSlice = createSlice({
  name: "deck",
  initialState: {
    cards: generateDeck()
  } as Deck,
  reducers: {
    selectDeckCard: (deck, action: PayloadAction<number>) => { deck.selected = action.payload },
    resetDeck: (deck) => { deck.cards = generateDeck() }
  },
})

export const { selectDeckCard } = deckSlice.actions;
export const deckReducer = deckSlice.reducer;