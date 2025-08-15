import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSupabaseQuery, useSupabaseInsert } from '../lib/useSupabase'

// Example interface for a simple todos table
interface Todo {
  id: string
  text: string
  completed: boolean
  created_at: string
}

export function SupabaseExample() {
  const [newTodoText, setNewTodoText] = useState('')

  // Example of fetching data
  const { 
    data: todos, 
    loading, 
    error, 
    refetch 
  } = useSupabaseQuery<Todo>('todos', {
    order: { column: 'created_at', ascending: false }
  })

  // Example of inserting data
  const { insert, loading: inserting } = useSupabaseInsert<Todo>('todos')

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoText.trim()) return

    const result = await insert({
      text: newTodoText,
      completed: false
    })

    if (result) {
      setNewTodoText('')
      refetch() // Refresh the list
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !completed })
      .eq('id', id)

    if (!error) {
      refetch()
    }
  }

  // Direct Supabase query example
  const testDirectQuery = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('completed', false)

    console.log('Incomplete todos:', data, error)
  }

  if (loading) return <div>Loading todos...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Supabase Todo Example</h2>
      
      <form onSubmit={handleAddTodo} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={inserting}
          />
          <button
            type="submit"
            disabled={inserting || !newTodoText.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inserting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {todos?.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 p-2 border border-gray-200 rounded-md"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.id, todo.completed)}
              className="w-4 h-4"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>

      {todos?.length === 0 && (
        <p className="text-gray-500 text-center mt-4">No todos yet. Add one above!</p>
      )}

      <button
        onClick={testDirectQuery}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 w-full"
      >
        Test Direct Query (Check Console)
      </button>
    </div>
  )
}

export default SupabaseExample
