use('ecommerce');
function userGastarPontos(idUsuario, pontosNecessarios) {
    const usuario = db.users.findOne({ _id: idUsuario });
    if (!usuario) {
        print("Usuário não encontrado");
        return;
    }

    const pontosAtuais = usuario.pontos ? usuario.pontos.valorTotal : 0;
    if (pontosAtuais < pontosNecessarios) {
        print("Pontos insuficientes");
    } else {
        db.users.updateOne(
            { _id: idUsuario },
            { $inc: { "pontos.valorTotal": -pontosNecessarios } }
        );
        print("Pontos gastos com sucesso");
    }
}

function categoriaGanharPontos(idCategoria, pontosGanhos) {
    if (pontosGanhos && pontosGanhos > 0) {
        const categoria = db.categorias.findOne({ _id: idCategoria });
        if (!categoria) {
            print("Categoria não encontrada");
            return;
        }
        db.categorias.updateOne(
            { _id: idCategoria },
            { $inc: { "pontos.valorTotal": pontosGanhos } }
        );
        print("Pontos adicionados à categoria com sucesso");
    } else {
        print("Pontos ganhos inválidos");
    }
}

function ganhaDesconto(idProduto, idUsuario, quantidade) {
    const usuario = db.users.findOne({ _id: idUsuario });
    const produto = db.products.findOne({ _id: idProduto });

    if (!usuario || !produto) {
        print("Usuário ou produto não encontrado");
        return;
    }

    const pontosAtuais = usuario.pontos ? usuario.pontos.valorTotal : 0;
    let desconto = 0;

    if (pontosAtuais >= 300) {
        desconto = 0.3;
    } else if (pontosAtuais >= 200) {
        desconto = 0.2;
    } else if (pontosAtuais >= 100) {
        desconto = 0.1;
    }

    const valorTotal = quantidade * produto.preco * (1 - desconto);

    db.transacoes.insertOne({
        idproduto: idProduto,
        idusuario: idUsuario,
        quantidade: quantidade,
        valorTotal: valorTotal,
    });

    print("Desconto aplicado e transação registrada com sucesso");
}
(ObjectId("648fad3b8d7f3e8d9a56d456"), 50);
userGastarPontos(ObjectId("648fad3b8d7f3e8d9a56d456"), 100);
// Adiciona 30 pontos à Categoria A
categoriaGanharPontos(ObjectId("650abe9b8d7f3e8d9a56e012"), 30);

// Saída esperada:
// "Pontos adicionados à categoria com sucesso"

// O valor total de pontos da Categoria A deve ser atualizado para 230 (200 + 30).
