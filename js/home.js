import { supabase } from './supabase.js'

async function carregarDashboard() {

  try {

    const { data: produtos, error: erroProdutos } = await supabase
      .from('produtos')
      .select('*')
      .order('data', { ascending: false })

    if (erroProdutos) throw erroProdutos

    const { data: movimentacoes, error: erroMovimentacoes } = await supabase
      .from('movimentacoes')
      .select('*')

    if (erroMovimentacoes) throw erroMovimentacoes

    const totalProdutos = produtos.length

    const entradas = movimentacoes.filter(
      m => m.tipo === 'entrada'
    ).length

    const saidas = movimentacoes.filter(
      m => m.tipo === 'saida'
    ).length

    const estoqueBaixo = produtos.filter(
      p => p.quantidade <= p.quantidade_minima
    ).length

    document.getElementById('totalProdutos').textContent =
      totalProdutos

    document.getElementById('totalEntradas').textContent =
      entradas

    document.getElementById('totalSaidas').textContent =
      saidas

    document.getElementById('estoqueBaixo').textContent =
      estoqueBaixo

    const tabela =
      document.getElementById('tabelaProdutos')

    tabela.innerHTML = ''

    produtos.forEach(produto => {

      tabela.innerHTML += `
        <tr>
          <td>${produto.nome}</td>

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
        </tr>
      `
    })

  } catch (erro) {

    console.error('Erro ao carregar dashboard:', erro)

  }
}

window.logout = () => {

  localStorage.removeItem('usuario')

  window.location.href = 'index.html'
}

document.addEventListener('DOMContentLoaded', () => {
  carregarDashboard()
})