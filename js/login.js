import { supabase } from './supabase.js'

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value.trim().toLowerCase()
  const senha = document.getElementById('senha').value.trim()

  if (!email || !senha) {
    alert("Preencha todos os campos")
    return
  }

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('usuario', email)
    .eq('senha', senha)

  console.log(data, error) //

  if (error || data.length === 0) {
    alert('Login inválido')
  } else {
    localStorage.setItem('usuario', JSON.stringify(data[0]))
    window.location.href = 'home.html'
  }
})