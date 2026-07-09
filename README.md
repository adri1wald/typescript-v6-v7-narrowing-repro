# TypeScript 6 vs 7 Narrowing Repro

This is a minimal repro for a TypeScript 7.0.2 type-checking discrepancy.

The same source passes with `@typescript/typescript6@6.0.2` and fails with `typescript@7.0.2`.

## Setup

This repo uses the package layout from the TypeScript 7.0 announcement:

- `typescript` is aliased to `npm:@typescript/typescript6@6.0.2`.
- `@typescript/native` is aliased to `npm:typescript@7.0.2`.
- `tsc6` runs TypeScript 6.
- `tsc` runs TypeScript 7.

`pnpm-workspace.yaml` only allows these TypeScript 7 packages through the local pnpm minimum-release-age policy. It does not affect type checking.

## Run

```sh
pnpm install
pnpm run check:ts6
pnpm run check:ts7
pnpm run check:controls
```

## Result

`pnpm run check:ts6` passes.

`pnpm run check:ts7` fails:

```text
src/repro.ts(31,10): error TS18048: 'payload' is possibly 'undefined'.
```

## Repro

```ts
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
```

After the `throw`, `status` has narrowed to `'ready'`, so `payload` should be the defined `payload` property from the ready union member.

The failing shape is an overloaded assertion inside an arrow function with no syntactic return type annotation. The function then returns the destructured `payload` property directly.

## Control Cases

`src/control-cases.ts` checks similar cases that pass with both TypeScript 6 and TypeScript 7:

- a single assertion signature
- a single assertion signature with an optional message parameter
- the same overloaded assertion in a function declaration
- the same overloaded assertion in an arrow function with a syntactic return type annotation
- the same overloaded assertion followed by an intermediate `const value: string = payload.value`
- the same overloaded assertion using the original `state` object instead of correlated destructuring
- an inline guard instead of an assertion function
- the same overloaded assertion when the narrowed `payload` value is not returned

These controls narrow the discrepancy to overloaded assertion functions inside function expressions that have no syntactic return type annotation and return the destructured value or property directly.
