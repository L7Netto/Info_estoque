import { supabase } from './supabase.js'

const tabela = document.getElementById('tabelaProdutos')
const pesquisa = document.getElementById('pesquisa')

let produtos = []

async function carregarProdutos() {

  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('data', { ascending: false })

  if (error) {
    console.error(error)
    return
  }

  produtos = data

  atualizarCards()
  renderizarTabela(produtos)
}

function atualizarCards() {

  document.getElementById('totalProdutos').textContent =
    produtos.length

  document.getElementById('estoqueBaixo').textContent =
    produtos.filter(
      p => p.quantidade <= p.quantidade_minima
    ).length
}

function renderizarTabela(lista) {

  tabela.innerHTML = ''

  if (lista.length === 0) {

    tabela.innerHTML = `
      <tr>
        <td colspan="5">
          Nenhum produto encontrado
        </td>
      </tr>
    `

    return
  }

  lista.forEach(produto => {

    tabela.innerHTML += `
      <tr>

        <td>${produto.nome}</td>

        <td>${produto.categoria || 'Sem categoria'}</td>

        <td>${produto.quantidade}</td>

        <td>
          <span class="${
            produto.quantidade <= produto.quantidade_minima
              ? 'status-low'
              : 'status-ok'
          }">

            ${
              produto.quantidade <= produto.quantidade_minima
                ? 'Baixo'
                : 'OK'
            }

          </span>
        </td>

        <td class="acoes">

          <button
            class="btn-edit"
            onclick="editarProduto(${produto.id})"
          >
            ✏️ Editar
          </button>

          <button
            class="btn-delete"
            onclick="deletarProduto(${produto.id})"
          >
            🗑 Excluir
          </button>

        </td>

      </tr>
    `
  })
}

pesquisa.addEventListener('input', () => {

  const valor = pesquisa.value.toLowerCase()

  const filtrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(valor)
  )

  renderizarTabela(filtrados)
})

window.editarProduto = (id) => {

  localStorage.setItem(
    'produtoEditar',
    id
  )

  window.location.href =
    'cadastro_produto.html'
}

window.deletarProduto = async (id) => {

  const confirmar = confirm(
    'Deseja realmente excluir este produto?'
  )

  if (!confirmar) return

  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)

  if (error) {
    alert('Erro ao excluir produto')
    return
  }

  carregarProdutos()
}

window.logout = () => {

  localStorage.removeItem('usuario')

  window.location.href =
    'index.html'
}

document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos()
})
