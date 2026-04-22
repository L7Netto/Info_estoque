import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://cubkfqzhuiraaomfbymo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1YmtmcXpodWlyYWFvbWZieW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNjM1MzIsImV4cCI6MjA5MTkzOTUzMn0.8bMMGDI7ebjxKvgaufaTEtONVAErMsMWf0GmBFe0_IY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log("SUPABASE INICIADO")