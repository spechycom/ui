import { describe, expect, it } from 'vitest'
import { getPaginationRange } from './pagination-range'

describe('getPaginationRange', () => {
  it('returns an empty array for zero pages', () => {
    expect(getPaginationRange(1, 0)).toEqual([])
  })

  it('returns a single page for one page', () => {
    expect(getPaginationRange(1, 1)).toEqual([1])
  })

  it('lists every page when the total is small', () => {
    expect(getPaginationRange(2, 4)).toEqual([1, 2, 3, 4])
  })

  it('collapses the gap on one side with an ellipsis', () => {
    expect(getPaginationRange(1, 10)).toEqual([1, 2, 'ellipsis', 10])
    expect(getPaginationRange(10, 10)).toEqual([1, 'ellipsis', 9, 10])
  })

  it('collapses both sides when the current page is in the middle', () => {
    expect(getPaginationRange(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10])
  })

  it('respects a wider siblingCount', () => {
    expect(getPaginationRange(5, 10, 2)).toEqual([1, 'ellipsis', 3, 4, 5, 6, 7, 'ellipsis', 10])
  })
})
