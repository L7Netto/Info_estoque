import { supabase } from './supabase.js'

const form = document.getElementById('loginForm')
const mensagem = document.getElementById('mensagem')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('email').value.trim().toLowerCase()
  const senha = document.getElementById('senha').value.trim()

  mensagem.innerHTML = ''

  if (!email || !senha) {
    mostrarMensagem('Preencha todos os campos', 'erro')
    return
  }

  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('usuario', email)
    .eq('senha', senha)

  if (error || data.length === 0) {
    mostrarMensagem('Email ou senha inválidos', 'erro')
    return
  }

  localStorage.setItem('usuario', JSON.stringify(data[0]))

  mostrarMensagem('Login realizado com sucesso!', 'sucesso')

  setTimeout(() => {
    window.location.href = 'home.html'
  }, 1000)
})

function mostrarMensagem(texto, tipo) {
  mensagem.innerHTML = `
    <div class="alert ${tipo}">
      ${texto}
    </div>
  `
}
