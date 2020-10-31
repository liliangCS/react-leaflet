import { renderHook } from '@testing-library/react-hooks'

import { createControlHook, createElementHook } from '../src'

import { createWrapper } from './context'

describe('control', () => {
  test('useLeafletControl() adds and removes the control', () => {
    const context = { map: jest.fn() }
    const wrapper = createWrapper(context)

    const instance = { addTo: jest.fn(), remove: jest.fn() }
    const useElement = createElementHook(() => ({ instance }))
    const useControl = createControlHook(useElement)

    const { unmount } = renderHook(() => useControl({}), { wrapper })
    expect(instance.addTo).toBeCalledTimes(1)
    expect(instance.addTo).toBeCalledWith(context.map)

    unmount()
    expect(instance.remove).toBeCalledTimes(1)
  })

  test('useLeafletControl() updates the position', () => {
    const instance = {
      addTo: jest.fn(),
      setPosition: jest.fn(),
      remove: jest.fn(),
    }
    const useElement = createElementHook(() => ({ instance }))
    const useControl = createControlHook(useElement)

    const { rerender } = renderHook((p) => useControl(p), {
      initialProps: { position: 'topleft' },
      wrapper: createWrapper({ map: true }),
    })
    rerender({ position: 'topleft' })
    expect(instance.setPosition).toBeCalledTimes(0)

    rerender({ position: 'topright' })
    expect(instance.setPosition).toBeCalledTimes(1)
    expect(instance.setPosition).toBeCalledWith('topright')
  })
})
