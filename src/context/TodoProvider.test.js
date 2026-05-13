import { describe, expect, it } from 'vitest'
import { mergeUpdatedTask } from './todoUtils'

describe('mergeUpdatedTask', () => {
  const baseTask = {
    id: 'task-1',
    title: 'Write docs',
    completed: false,
    deadline: '2026-05-13',
    creatorName: 'Alice',
  }

  it('applies optimistic updates when backend response is empty', () => {
    expect(mergeUpdatedTask(baseTask, { completed: true }, null)).toEqual({
      id: 'task-1',
      title: 'Write docs',
      completed: true,
      deadline: '2026-05-13',
      creatorName: 'Alice',
    })
  })

  it('does not let invalid backend payload erase existing task fields', () => {
    expect(
      mergeUpdatedTask(baseTask, { completed: true }, {
        id: null,
        title: '',
        completed: false,
        deadline: '',
        creatorName: 'Unknown',
      }),
    ).toEqual({
      id: 'task-1',
      title: 'Write docs',
      completed: true,
      deadline: '2026-05-13',
      creatorName: 'Alice',
    })
  })

  it('prefers valid backend payload when id exists', () => {
    expect(
      mergeUpdatedTask(baseTask, { completed: true }, {
        id: 'task-1',
        title: 'Write docs v2',
        completed: true,
        deadline: '2026-05-14',
        creatorName: 'Bob',
      }),
    ).toEqual({
      id: 'task-1',
      title: 'Write docs v2',
      completed: true,
      deadline: '2026-05-14',
      creatorName: 'Bob',
    })
  })
})
