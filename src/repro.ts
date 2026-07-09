type State =
  | {
      status: 'ready'
      payload: {
        value?: string
      }
    }
  | {
      status: 'pending'
      payload?: undefined
    }

declare function getState(): State

declare function assert(
  condition: boolean,
): asserts condition

declare function assert(
  condition: boolean,
  message: string,
): asserts condition

const readValue = () => {
  const { status, payload } = getState()

  if (status !== 'ready') {
    throw new Error('Value is not ready.')
  }

  assert(payload.value !== undefined)

  return payload.value
}
