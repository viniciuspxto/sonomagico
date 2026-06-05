'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function createProfile(fullName: string) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('profiles')
    .upsert({ user_id: user.id, full_name: fullName }, { onConflict: 'user_id' })

  if (error) {
    console.error('[createProfile] Supabase error:', error)
    return { error: `Erro ao salvar perfil: ${error.message}` }
  }
  return { error: null }
}

export async function createChild(data: {
  name: string
  age: number
  challenges: string[]
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { error } = await supabase
    .from('children')
    .insert({ user_id: user.id, ...data })

  if (error) return { error: 'Erro ao salvar dados da criança.' }

  redirect('/dashboard')
}
