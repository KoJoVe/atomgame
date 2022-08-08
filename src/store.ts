import { configureStore } from '@reduxjs/toolkit';

import { boardReducer } from './slices/board';
import { deckReducer } from './slices/deck';

export const store = configureStore({
  reducer: {
    board: boardReducer,
    deck: deckReducer,
  },
});

export type GameState = ReturnType<typeof store.getState>;
export type GameDispatch = typeof store.dispatch;