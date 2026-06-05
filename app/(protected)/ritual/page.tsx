import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { RitualFlow } from './ritual-flow'

export default async function RitualPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: children } = await supabase
    .from('children')
    .select('id, name, age')
    .eq('user_id', user!.id)
    .limit(1)

  if (!children?.length) redirect('/onboarding')

  return <RitualFlow child={children[0]} />
}
