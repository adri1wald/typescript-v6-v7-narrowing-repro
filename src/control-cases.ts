export {}

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

declare function assertOneArg(condition: boolean): asserts condition

const singleAssertionSignatureInInferredArrow = () => {
  const { status, payload } = getState()

  if (status !== 'ready') {
    throw new Error('Value is not ready.')
  }

  assertOneArg(payload.value !== undefined)

  return payload.value
}

declare function assertOptionalMessage(
  condition: boolean,
  message?: string,
): asserts condition

const optionalMessageAssertionSignatureInInferredArrow = () => {
  const { status, payload } = getState()

  if (status !== 'ready') {
    throw new Error('Value is not ready.')
  }

  assertOptionalMessage(payload.value !== undefined)

  return payload.value
}

declare function assertOverloaded(condition: boolean): asserts condition

declare function assertOverloaded(
  condition: boolean,
  message: string,
): asserts condition

function overloadedAssertionInFunctionDeclaration() {
  const { status, payload } = getState()

  if (status !== 'ready') {
    throw new Error('Value is not ready.')
  }

  assertOverloaded(payload.value !== undefined)

  return payload.value
}

const overloadedAssertionInArrowWithSyntacticReturnType = (): string => {
  const { status, payload } = getState()

  if (status !== 'ready') {
    throw new Error('Value is not ready.')
  }

  assertOverloaded(payload.value !== undefined)

  return payload.value
}

const overloadedAssertionWithIntermediateValue = () => {
  const { status, payload } = getState()

  if (status !== 'ready') {
    throw new Error('Value is not ready.')
  }

  assertOverloaded(payload.value !== undefined)

  const value: string = payload.value
  return value
}

const overloadedAssertionWithUndestructuredState = () => {
  const state = getState()

  if (state.status !== 'ready') {
    throw new Error('Value is not ready.')
  }

  assertOverloaded(state.payload.value !== undefined)

  return state.payload.value
}

const inlineGuardInInferredArrow = () => {
  const { status, payload } = getState()

  if (status !== 'ready') {
    throw new Error('Value is not ready.')
  }

  if (payload.value === undefined) {
    throw new Error('Missing value.')
  }

  return payload.value
}

const overloadedAssertionWithoutReturnedPayloadUse = () => {
  const { status, payload } = getState()

  if (status !== 'ready') {
    throw new Error('Value is not ready.')
  }

  assertOverloaded(payload.value !== undefined)

  return 'value'
}
