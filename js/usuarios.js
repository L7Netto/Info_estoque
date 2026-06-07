import { supabase } from './supabase.js'

const form = document.getElementById('cadastroForm')

const mensagem = document.getElementById('mensagem')

form.addEventListener('submit', async (e) => {

  e.preventDefault()

  const email =
    document.getElementById('email')
      .value
      .trim()
      .toLowerCase()

  const senha =
    document.getElementById('senha')
      .value
      .trim()

  mensagem.innerHTML = ''

  if (!email || !senha) {

    mostrarMensagem(
      'Preencha todos os campos',
      'erro'
    )

    return
  }

  if (senha.length < 4) {

    mostrarMensagem(
      'A senha deve ter no minimo 4 caracteres',
      'erro'
    )

    return
  }

  const {
    data: usuarioExistente,
    error: erroBusca
  } = await supabase
    .from('usuarios')
    .select('*')
    .eq('usuario', email)

  if (erroBusca) {

    console.error(erroBusca)

    mostrarMensagem(
      'Erro ao verificar usuario',
      'erro'
    )

    return
  }

  if (usuarioExistente.length > 0) {

    mostrarMensagem(
      'Usuario ja cadastrado',
      'erro'
    )

    return
  }

  const { error } = await supabase
    .from('usuarios')
    .insert([
      {
        usuario: email,
        senha: senha,
        tipo: 'funcionario'
      }
    ])

  if (error) {

    console.error(error)

    mostrarMensagem(
      'Erro ao cadastrar usuario',
      'erro'
    )

    return
  }

  mostrarMensagem(
    'Conta criada com sucesso!',
    'sucesso'
  )

  form.reset()

  setTimeout(() => {

    window.location.href = 'index.html'

  }, 1500)

})

function mostrarMensagem(texto, tipo) {

  mensagem.innerHTML = `
    <div class="alert ${tipo}">
      ${texto}
    </div>
  `
}
