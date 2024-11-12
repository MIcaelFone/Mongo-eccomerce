use('ecommerce');
db.products.updateMany({}, {
    $set: {
        promocao: {
            percentual_desconto: null,  // Porcentagem de desconto (ex: 20 para 20%)
            data_inicio: null,          // Data de início da promoção
            data_fim: null               // Data de término da promoção
        }
    }
});
function definirPromocao(produtoId, percentualDesconto, dataInicio, dataFim) {
    db.products.updateOne(
        { _id: produtoId },
        {
            $set: {
                "promocao.percentual_desconto": percentualDesconto,
                "promocao.data_inicio": new Date(dataInicio),
                "promocao.data_fim": new Date(dataFim)
            }
        }
    );
}
const produtoId = db.products.findOne({ nome: "Camiseta" })._id;
definirPromocao(produtoId, 20, "2024-11-01", "2024-11-15");

// Função para calcular o preço final de um produto com base em uma transação e promoção ativa
function calcularPrecoFinal(produtoId) {
    const produto = db.products.findOne({ _id: produtoId });
    const dataAtual = new Date();

    let precoFinal = produto.preco;
    if (
        produto.promocao &&
        produto.promocao.percentual_desconto &&
        produto.promocao.data_inicio <= dataAtual &&
        produto.promocao.data_fim >= dataAtual
    ) {
        precoFinal = produto.preco * (1 - produto.promocao.percentual_desconto / 100);
    }

    return precoFinal;
}

// Exemplo de cálculo do preço com promoção ativa
const precoFinal = calcularPrecoFinal(produtoId);
print("Preço final com promoção:", precoFinal);
 