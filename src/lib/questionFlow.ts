function createRandom(seed: string) {
  let state = 2166136261
  for (const character of seed) {
    state ^= character.charCodeAt(0)
    state = Math.imul(state, 16777619)
  }
  return () => {
    state += 0x6D2B79F5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

function makeOrder(length: number, seed: string) {
  const random = createRandom(seed)
  const order = Array.from({ length }, (_, index) => index)
  for (let index = order.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[order[index], order[swapIndex]] = [order[swapIndex], order[index]]
  }
  return order
}

/** Returns a stable shuffled item index for a cycle, without repeating the last item at a cycle boundary. */
export function shuffledCycleIndex(length: number, step: number, seed: string) {
  if (length <= 1) return 0
  const cycle = Math.floor(step / length)
  const position = step % length
  const order = makeOrder(length, `${seed}:${cycle}`)

  if (cycle > 0) {
    const previousOrder = makeOrder(length, `${seed}:${cycle - 1}`)
    const previousLast = previousOrder[previousOrder.length - 1]
    if (order[0] === previousLast) {
      const random = createRandom(`${seed}:${cycle}:boundary`)
      const swapIndex = 1 + Math.floor(random() * (length - 1))
      ;[order[0], order[swapIndex]] = [order[swapIndex], order[0]]
    }
  }

  return order[position] ?? 0
}
