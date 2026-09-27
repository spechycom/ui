/**
 * Page number sequence: first, last, and `siblingCount` neighbors around the
 * current page — gaps in between are represented as 'ellipsis'.
 * Example: currentPage=1, totalPages=4 → [1, 2, 'ellipsis', 4]
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): (number | 'ellipsis')[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : []

  const left = Math.max(currentPage - siblingCount, 2)
  const right = Math.min(currentPage + siblingCount, totalPages - 1)

  const range: (number | 'ellipsis')[] = [1]
  if (left > 2) range.push('ellipsis')
  for (let page = left; page <= right; page++) range.push(page)
  if (right < totalPages - 1) range.push('ellipsis')
  range.push(totalPages)

  return range
}
