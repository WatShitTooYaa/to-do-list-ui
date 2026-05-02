import { useContext } from 'react'
import { TodoContext } from './todoContextValue'

export const useTodos = () => {
  const context = useContext(TodoContext)

  if (!context) {
    throw new Error('useTodos must be used within TodoProvider')
  }

  return context
}
