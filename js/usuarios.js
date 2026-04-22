import { supabase } from './supabase.js'

document.getElementById('formUser').addEventListener('submit', async (e)=>{
  e.preventDefault()

 
  const emailDigitado = document.getElementById('email').value
  const senhaDigitada = document.getElementById('senha').value
  const tipoSelecionado = document.getElementById('tipo').value


  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ 
      usuario: emailDigitado,
      senha: senhaDigitada,
      tipo: tipoSelecionado
    }])

  if (error) {
    console.error("Erro detalhado do Supabase:", error)
    alert("Erro ao cadastrar: " + error.message)
    return
  }

  alert("Usuário cadastrado com sucesso!")
  window.location.href = "index.html"
})