import { supabase } from './supabase.js'

const tabela = document.getElementById('tabelaProdutos');
const busca = document.getElementById('busca');

async function carregarProdutos() {
    
    const { data: produtos, error } = await supabase
        .from('produtos')
        .select('*');

    if (error) {
        console.error("Erro ao buscar produtos:", error);
        return;
    }

    renderizarTabela(produtos);
}

function renderizarTabela(lista) {
    tabela.innerHTML = "";

    lista.forEach(prod => {
        
        const estoqueBaixo = prod.quantidade <= prod.quantidade_minima;
      
        const estiloCor = estoqueBaixo ? 'style="color: red; font-weight: bold;"' : '';
        const avisoTexto = estoqueBaixo ? ' ⚠️' : '';

        const linha = `
            <tr>
                <td>${prod.nome}</td>
                <td>${prod.categoria}</td>
                <td ${estiloCor}>
                    ${prod.quantidade}${avisoTexto}
                </td>
                <td>${prod.quantidade_minima}</td>
                <td>
                    <button onclick="window.editar('${prod.id}')">✏️</button>
                    <button onclick="window.excluir('${prod.id}')">🗑️</button>
                </td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });
}

busca.addEventListener('input', async () => {
    const termo = busca.value.toLowerCase();
    const { data } = await supabase.from('produtos').select('*');
    const filtrados = data.filter(p => p.nome.toLowerCase().includes(termo));
    renderizarTabela(filtrados);
});

window.editar = (id) => {
    window.location.href = `cadastro_produto.html?id=${id}`;
};


window.excluir = async (id) => {
    if (confirm("Deseja excluir este produto?")) {
        const { error } = await supabase.from('produtos').delete().eq('id', id);
        if (error) alert("Erro ao excluir");
        else carregarProdutos();
    }
};


carregarProdutos();