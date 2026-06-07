import { supabase } from './supabase.js'

const form = document.getElementById('formMovimentacao')

const tabela = document.getElementById(
  'tabelaMovimentacoes'
)

const selectProduto = document.getElementById('produto')

const mensagem = document.getElementById('mensagem')

async function carregarProdutos() {

  const { data } = await supabase
    .from('produtos')
    .select('*')

  data.forEach(produto => {

    selectProduto.innerHTML += `
      <option value="${produto.id}">
        ${produto.nome}
      </option>
    `
  })
}

async function carregarMovimentacoes() {

  const { data } = await supabase
    .from('movimentacoes')
    .select(`
      *,
      produtos(nome)
    `)
    .order('id', { ascending: false })

  tabela.innerHTML = ''

  data.forEach(mov => {

    tabela.innerHTML += `
      <tr>

        <td>${mov.produtos.nome}</td>

        <td>
          <span class="${
            mov.tipo === 'entrada'
              ? 'status-ok'
              : 'status-low'
          }">

            ${
              mov.tipo === 'entrada'
                ? 'Entrada'
                : 'Saída'
            }

          </span>
        </td>

        <td>${mov.quantidade}</td>

        <td>
          ${new Date(mov.data)
            .toLocaleDateString('pt-BR')}
        </td>

      </tr>
    `
  })
}

form.addEventListener('submit', async (e) => {

  e.preventDefault()

  const produto_id = selectProduto.value

  const tipo = document.getElementById('tipo').value

  const quantidade =
    parseInt(document.getElementById('quantidade').value)

  if (!produto_id || !tipo || !quantidade) {

    mostrarMensagem(
      'Preencha todos os campos',
      'erro'
    )

    return
  }

  const { data: produto } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', produto_id)
    .single()

  let novaQuantidade = produto.quantidade

  if (tipo === 'entrada') {
    novaQuantidade += quantidade
  } else {

    if (produto.quantidade < quantidade) {

      mostrarMensagem(
        'Quantidade insuficiente em estoque',
        'erro'
      )

      return
    }

    novaQuantidade -= quantidade
  }

  await supabase
    .from('produtos')
    .update({
      quantidade: novaQuantidade
    })
    .eq('id', produto_id)

  await supabase
    .from('movimentacoes')
    .insert([
      {
        produto_id,
        tipo,
        quantidade
      }
    ])

  mostrarMensagem(
    'Movimentação registrada com sucesso!',
    'sucesso'
  )

  form.reset()

  carregarMovimentacoes()
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

carregarProdutos()
carregarMovimentacoes()
