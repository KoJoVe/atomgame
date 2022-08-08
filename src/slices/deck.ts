import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { generateDeck } from '../generators/deck';

import { Deck } from '../types/deck';

export const deckSlice = createSlice({
  name: "deck",
  initialState: {
    cards: generateDeck()
  } as Deck,
  reducers: {
    selectDeckCard: (deck: Deck, action: PayloadAction<number>) => { 
      deck.selected = deck.selected === action.payload ? undefined : action.payload;
    },
    toggleDeleting: (deck: Deck) => { 
      deck.deleting = !deck.deleting;
    },
    resetDeck: (deck: Deck) => { deck.cards = generateDeck() }
  },
})

export const { selectDeckCard, toggleDeleting } = deckSlice.actions;
export const deckReducer = deckSlice.reducer;