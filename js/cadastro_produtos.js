import { supabase } from './supabase.js'

const form = document.getElementById('formProduto')
const mensagem = document.getElementById('mensagem')

const produtoEditar =
  localStorage.getItem('produtoEditar')

if (produtoEditar) {
  carregarProduto()
}

async function carregarProduto() {

  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', produtoEditar)
    .single()

  if (error) {
    console.error(error)
    return
  }

  document.getElementById('nome').value =
    data.nome || ''

  document.getElementById('categoria').value =
    data.categoria || ''

  document.getElementById('quantidade').value =
    data.quantidade || 0

  document.getElementById('preco').value =
    data.preco || 0

  document.getElementById('quantidade_minima').value =
    data.quantidade_minima || 0
}

form.addEventListener('submit', async (e) => {

  e.preventDefault()

  const nome =
    document.getElementById('nome').value.trim()

  const categoria =
    document.getElementById('categoria').value.trim()

  const quantidade =
    parseInt(
      document.getElementById('quantidade').value
    )

  const preco =
    parseFloat(
      document.getElementById('preco').value
    )

  const quantidade_minima =
    parseInt(
      document.getElementById('quantidade_minima').value
    )

  mensagem.innerHTML = ''

  if (
    !nome ||
    isNaN(quantidade) ||
    isNaN(preco) ||
    isNaN(quantidade_minima)
  ) {

    mostrarMensagem(
      'Preencha todos os campos obrigatórios',
      'erro'
    )

    return
  }

  if (quantidade < 0) {

    mostrarMensagem(
      'Quantidade inválida',
      'erro'
    )

    return
  }

  if (preco < 0) {

    mostrarMensagem(
      'Preço inválido',
      'erro'
    )

    return
  }

  let error

  if (produtoEditar) {

    const resultado = await supabase
      .from('produtos')
      .update({
        nome,
        categoria,
        quantidade,
        preco,
        quantidade_minima
      })
      .eq('id', produtoEditar)

    error = resultado.error

  } else {

    const resultado = await supabase
      .from('produtos')
      .insert([
        {
          nome,
          categoria,
          quantidade,
          preco,
          quantidade_minima,
          data: new Date().toISOString()
        }
      ])

    error = resultado.error
  }

  if (error) {

    console.error(error)

    mostrarMensagem(
      produtoEditar
        ? 'Erro ao atualizar produto'
        : 'Erro ao cadastrar produto',
      'erro'
    )

    return
  }

  mostrarMensagem(
    produtoEditar
      ? 'Produto atualizado com sucesso!'
      : 'Produto cadastrado com sucesso!',
    'sucesso'
  )

  localStorage.removeItem('produtoEditar')

  form.reset()

  setTimeout(() => {
    window.location.href = 'produtos.html'
  }, 1200)

})

function mostrarMensagem(texto, tipo) {

  mensagem.innerHTML = `
    <div class="alert ${tipo}">
      ${texto}
    </div>
  `
}

window.logout = () => {

  localStorage.removeItem('usuario')

  window.location.href = 'index.html'
}
