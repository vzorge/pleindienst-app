export function splitArray(allDates: Date[], desiredLength: number): [Date[], Date[]] {
  const length = Math.min(allDates.length, desiredLength);
  const split = allDates.splice(0, length);

  return [split, allDates];
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

export function splitArrayOn<T>(arr: T[], func: (val: T) => boolean): [T[], T[]] {
  const truth: T[] = [];
  const falsy: T[] = [];

  arr.forEach(t => {
      (func(t) ? truth : falsy).push(t);
  });

  return [truth, falsy];
}