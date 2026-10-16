export function nextSeed(seed        ) {
  return (seed * 1664525 + 1013904223) >>> 0;
}

export function randomFloat(seed        ) {
  const next = nextSeed(seed);
  return { seed: next, value: next / 0x100000000 };
}

export function shuffleWithSeed   (items     , seed        ) {
  const copy = [...items];
  let currentSeed = seed >>> 0;
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const random = randomFloat(currentSeed);
    currentSeed = random.seed;
    const j = Math.floor(random.value * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return { items: copy, seed: currentSeed };
}
