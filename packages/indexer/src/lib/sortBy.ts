export const sortBy = <T, S extends number | bigint>(
  arr: T[],
  scoreFn: (item: T) => S,
  order: 'asc' | 'desc' = 'asc',
): T[] => {
  return [...arr].sort((a, b) => {
    if (scoreFn(a) < scoreFn(b)) {
      return order === 'asc' ? -1 : 1
    } else if (scoreFn(a) > scoreFn(b)) {
      return order === 'asc' ? 1 : -1
    } else {
      return 0
    }
  })
}
