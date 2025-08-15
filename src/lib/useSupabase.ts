import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import type { PostgrestError } from '@supabase/supabase-js'

interface UseSupabaseQuery<T> {
  data: T | null
  loading: boolean
  error: PostgrestError | null
  refetch: () => void
}

export function useSupabaseQuery<T = any>(
  table: string,
  query?: {
    select?: string
    filter?: Record<string, any>
    order?: { column: string; ascending?: boolean }
    limit?: number
  }
): UseSupabaseQuery<T[]> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<PostgrestError | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      let queryBuilder = supabase
        .from(table)
        .select(query?.select || '*')

      // Apply filters
      if (query?.filter) {
        Object.entries(query.filter).forEach(([key, value]) => {
          queryBuilder = queryBuilder.eq(key, value)
        })
      }

      // Apply ordering
      if (query?.order) {
        queryBuilder = queryBuilder.order(query.order.column, {
          ascending: query.order.ascending ?? false
        })
      }

      // Apply limit
      if (query?.limit) {
        queryBuilder = queryBuilder.limit(query.limit)
      }

      const { data: result, error: queryError } = await queryBuilder

      if (queryError) {
        setError(queryError)
      } else {
        setData(result || [])
      }
    } catch (err) {
      console.error('Supabase query error:', err)
      setError(err as PostgrestError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [table, JSON.stringify(query)])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

export function useSupabaseInsert<T = any>(table: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

  const insert = async (data: Partial<T>) => {
    try {
      setLoading(true)
      setError(null)

      const { data: result, error: insertError } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single()

      if (insertError) {
        setError(insertError)
        return null
      }

      return result
    } catch (err) {
      console.error('Supabase insert error:', err)
      setError(err as PostgrestError)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    insert,
    loading,
    error
  }
}

export function useSupabaseUpdate<T = any>(table: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

  const update = async (id: string | number, data: Partial<T>) => {
    try {
      setLoading(true)
      setError(null)

      const { data: result, error: updateError } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        setError(updateError)
        return null
      }

      return result
    } catch (err) {
      console.error('Supabase update error:', err)
      setError(err as PostgrestError)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    update,
    loading,
    error
  }
}

export function useSupabaseDelete(table: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)

  const deleteRecord = async (id: string | number) => {
    try {
      setLoading(true)
      setError(null)

      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (deleteError) {
        setError(deleteError)
        return false
      }

      return true
    } catch (err) {
      console.error('Supabase delete error:', err)
      setError(err as PostgrestError)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    deleteRecord,
    loading,
    error
  }
}
