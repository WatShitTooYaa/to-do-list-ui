import { describe, expect, it } from 'vitest'
import { normalizeTask, toApiDeadline, toDateInputValue, unwrapTask } from './taskService'

describe('taskService helpers', () => {
  it('keeps date-only deadline unchanged for input fields', () => {
    expect(toDateInputValue('2026-05-13')).toBe('2026-05-13')
  })

  it('extracts YYYY-MM-DD from ISO string deadline', () => {
    expect(toDateInputValue('2026-05-13T23:59:59.000Z')).toBe('2026-05-13')
  })

  it('converts date input to UTC end-of-day string', () => {
    expect(toApiDeadline('2026-05-13')).toBe('2026-05-13T23:59:59.000Z')
  })

  it('unwraps nested task payload', () => {
    expect(unwrapTask({ data: { task: { id: 7, title: 'Test' } } })).toEqual({
      id: 7,
      title: 'Test',
    })
  })

  it('normalizes backend task shape', () => {
    expect(
      normalizeTask({
        _id: 'abc',
        name: 'Ship feature',
        isCompleted: true,
        deadline: '2026-05-13T23:59:59.000Z',
        user: { name: 'Alice' },
      }),
    ).toEqual({
      id: 'abc',
      title: 'Ship feature',
      completed: true,
      deadline: '2026-05-13',
      creatorName: 'Alice',
    })
  })

  it('returns null for empty task payload', () => {
    expect(normalizeTask(null)).toBeNull()
  })
})
