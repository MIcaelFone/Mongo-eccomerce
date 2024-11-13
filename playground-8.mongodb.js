use('ecommerce');
function procurarAvaliacoes(idProduto) { // Função para buscar avaliações de um produto
    db.getCollection('avaliacoes').find
    ( // Busca todas as avaliações
        { idproduto: ObjectId(idProduto) },
        {  }
    )
}
procurarAvaliacoes("6732b55c8756ccd77f1b9b41");