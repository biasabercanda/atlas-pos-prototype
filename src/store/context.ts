import { createContext, useContext, type Dispatch } from 'react'
import type { PosAction, PosState } from './order-reducer'

export const PosStateContext = createContext<PosState | null>(null)
export const PosDispatchContext = createContext<Dispatch<PosAction> | null>(null)

/** Current store state. Must be used under <OrderStoreProvider>. */
export function usePosState(): PosState {
  const state = useContext(PosStateContext)
  if (!state) throw new Error('usePosState must be used inside <OrderStoreProvider>')
  return state
}

/** Store dispatch. Components that only act (tiles, tabs) don't re-render on state changes. */
export function usePosDispatch(): Dispatch<PosAction> {
  const dispatch = useContext(PosDispatchContext)
  if (!dispatch) throw new Error('usePosDispatch must be used inside <OrderStoreProvider>')
  return dispatch
}
