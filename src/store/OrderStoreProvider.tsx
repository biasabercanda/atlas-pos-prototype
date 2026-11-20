import { useReducer, type ReactNode } from 'react'
import { menu } from '../data/menu'
import { PosDispatchContext, PosStateContext } from './context'
import { createPosReducer, initialPosState } from './order-reducer'

const posReducer = createPosReducer(menu)

function readInitOptions() {
  const params = new URLSearchParams(window.location.search)
  return { emptyOrder: params.get('order') === 'empty' }
}

/**
 * Holds the one POS store. Mounted ABOVE the presentation shell, so switching
 * devices (which only resizes the frame) keeps the order, tab and open folder.
 */
export function OrderStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(posReducer, undefined, () =>
    initialPosState(menu, readInitOptions()),
  )
  return (
    <PosStateContext.Provider value={state}>
      <PosDispatchContext.Provider value={dispatch}>{children}</PosDispatchContext.Provider>
    </PosStateContext.Provider>
  )
}
