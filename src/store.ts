import { configureStore } from '@reduxjs/toolkit';

import { boardReducer } from './slices/board';
import { deckReducer } from './slices/deck';
import { roundReducer } from './slices/round';

const store = configureStore({
  reducer: {
    deck: deckReducer,
    board: boardReducer,
    round: roundReducer,
    // deck: {},
    // round: {}
  },
});

export type GameState = ReturnType<typeof store.getState>;
export type GameDispatch = typeof store.dispatch;