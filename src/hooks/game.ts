import { 
  TypedUseSelectorHook, 
  useDispatch as uD, 
  useSelector as uS 
} from 'react-redux';

import { GameState, GameDispatch } from '../store';

export const useDispatch = () => uD<GameDispatch>();
export const useSelector: TypedUseSelectorHook<GameState> = uS;