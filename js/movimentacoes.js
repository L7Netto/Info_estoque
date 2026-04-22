import { supabase } from './supabase.js'

async function carregarProdutos() {
    const { data } = await supabase.from('produtos').select('*')
    const select = document.getElementById('produto_id')
    
    select.innerHTML = '<option value="">Selecione um produto</option>' 
    data.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.nome} (Saldo: ${p.quantidade})</option>`
    })
}

async function carregarHistorico() {
    const tabela = document.getElementById('tabelaHistórico');
    if (!tabela) return; 

    const { data: movs, error } = await supabase
        .from('movimentacoes')
        .select(`
            id,
            tipo,
            quantidade,
            data,
            produtos ( nome )
        `)
        .order('data', { ascending: false });

    if (error) {
        console.error("Erro ao carregar histórico:", error);
        return;
    }

    tabela.innerHTML = "";
    movs.forEach(m => {
        const corTipo = m.tipo === 'entrada' ? 'style="color: green; font-weight: bold;"' : 'style="color: red; font-weight: bold;"';
        const dataFormatada = new Date(m.data).toLocaleString('pt-BR');

        tabela.innerHTML += `
            <tr>
                <td>${m.produtos ? m.produtos.nome : 'Produto excluído'}</td>
                <td ${corTipo}>${m.tipo.toUpperCase()}</td>
                <td>${m.quantidade}</td>
                <td>${dataFormatada}</td>
            </tr>
        `;
    });
}

document.getElementById('movForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    const produto_id = document.getElementById('produto_id').value
    const tipo = document.getElementById('tipo').value
    const quantidade = parseInt(document.getElementById('quantidade').value)

    if (!produto_id || quantidade <= 0) {
        alert("Selecione um produto e uma quantidade válida")
        return
    }

    const { data: produto } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', produto_id)
        .single()


    if (tipo === 'saida' && quantidade > produto.quantidade) {
        alert(`Estoque insuficiente! Você só tem ${produto.quantidade} unidades.`);
        return
    }

    let novaQtd = tipo === 'entrada' ? produto.quantidade + quantidade : produto.quantidade - quantidade

    
    await supabase.from('produtos').update({ quantidade: novaQtd }).eq('id', produto_id)

    
    await supabase.from('movimentacoes').insert([
        { 
            produto_id, 
            tipo, 
            quantidade,
            data: new Date().toISOString()
        }
    ])

    
    if (novaQtd <= produto.quantidade_minima) {
        alert(`⚠️ Atenção: Estoque baixo para este produto! (Mínimo: ${produto.quantidade_minima})`);
    }

    alert("Movimentação realizada com sucesso!")
    
   
    carregarProdutos();
    carregarHistorico();
    e.target.reset(); 
})


carregarProdutos();
carregarHistorico();