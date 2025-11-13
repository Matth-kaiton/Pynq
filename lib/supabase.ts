import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sehrxaegegccrgmgyhcl.supabase.co'
const supabasePublishableKey = 'sb_publishable_4x9RjysKMufYNmyJok8Pow_3Ex0lbHy'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})