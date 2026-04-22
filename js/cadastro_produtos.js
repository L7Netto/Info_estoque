import { supabase } from './supabase.js'


const urlParams = new URLSearchParams(window.location.search);
const produtoId = urlParams.get('id');

const form = document.getElementById('formProduto');


if (produtoId) {
    async function preencherCampos() {
        const { data } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', produtoId)
            .single();

        if (data) {
            document.getElementById('nome').value = data.nome;
            document.getElementById('categoria').value = data.categoria;
            document.getElementById('quantidade').value = data.quantidade;
            document.getElementById('minimo').value = data.quantidade_minima;
        }
    }
    preencherCampos();
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const minimo = parseInt(document.getElementById('minimo').value);

   
    const dadosAtualizados = {
        nome: nome,
        categoria: categoria,
        quantidade: quantidade,
        quantidade_minima: minimo,
        preco: 0 
    };

    if (produtoId) {
       
        const { error } = await supabase
            .from('produtos')
            .update(dadosAtualizados) 
            .eq('id', produtoId);    

        if (error) {
            alert("Erro ao atualizar o item: " + error.message);
        } else {
            alert("Informações do produto alteradas com sucesso!");
            window.location.href = "produtos.html";
        }
    } else {
       
        const { error } = await supabase
            .from('produtos')
            .insert([dadosAtualizados]);
            
        if (error) alert("Erro ao cadastrar: " + error.message);
        else window.location.href = "produtos.html";
    }
});