use('ecommerce');
 
 
db.users.updateMany({}, { $set: { "pontos.valorTotal": 0 } });
db.categorias.updateMany({}, { $set: { "pontos.valorTotal": 0 } });

// Função para adicionar pontos ao usuário
function userGanharPontos(idUsuario, pontosGanhos) {
    if (!pontosGanhos || pontosGanhos <= 0) {
        print("Pontos ganhos inválidos");
        return;
    }
    const usuario = db.users.findOne({ _id: idUsuario });
    if (usuario) {
        const pontosAtuais = usuario.pontos?.valorTotal || 0;
        const novosPontos = pontosAtuais + pontosGanhos;
        db.users.updateOne({ _id: idUsuario }, { $set: { "pontos.valorTotal": novosPontos } });
        print("Pontos adicionados com sucesso");
    } else {
        print("Usuário não encontrado");
    }
}

// Função para gastar pontos
function userGastarPontos(idUsuario, idCategoria, pontosNecessarios) {
    const usuario = db.users.findOne({ _id: idUsuario });
    const categoria = db.categories.findOne({ _id: idCategoria });
    if (!usuario || !categoria) {
        print("Usuário ou categoria não encontrado");
        return;
    }
    const pontosAtuais = usuario.pontos?.valorTotal || 0;
    if (pontosAtuais < pontosNecessarios) {
        print("Pontos insuficientes");
    } else {
        const novosPontos = pontosAtuais - pontosNecessarios;
        db.users.updateOne({ _id: idUsuario }, { $set: { "pontos.valorTotal": novosPontos } });
        print("Pontos gastos com sucesso");
    }
}
userGastarPontos(ObjectId("6732b521ed38e04887379d31"), ObjectId("6732b521ed38e04887379d36"), 0);


function categoriaGanharPontos(idCategoria, pontosGanhos) {
  if (!pontosGanhos || pontosGanhos <= 0) {
      print("Pontos ganhos inválidos");
      return;
  }

  // Verifica se o idCategoria está no formato ObjectId
  if (typeof idCategoria === "string") {
      idCategoria = ObjectId(idCategoria);
  }

  const categoria = db.categories.findOne({ _id: idCategoria });

  if (categoria) {
      const pontosAtuais = categoria.pontos && categoria.pontos.valorTotal ? categoria.pontos.valorTotal : 0;
      const novosPontos = pontosAtuais + pontosGanhos;

      db.categories.updateOne(
          { _id: idCategoria },
          { $set: { "pontos.valorTotal": novosPontos } }
      );
      
      print("Pontos adicionados com sucesso");
  } else {
      print("Categoria não encontrada");
  }
}

// Exemplo de uso
categoriaGanharPontos("6732b521ed38e04887379d36", 100); //

// Função para calcular desconto com pontos
function ganhaDesconto(idProduto, idUsuario, quantidade) {
    const usuario = db.users.findOne({ _id: idUsuario });
    if (!usuario) {
        print("Usuário não encontrado");
        return;
    }
    const pontosAtuais = usuario.pontos?.valorTotal || 0;
    const produto = db.products.findOne({ _id: idProduto });
    if (!produto) {
        print("Produto não encontrado");
        return;
    }
    let desconto = 0;
    if (pontosAtuais > 300) desconto = 0.3;
    else if (pontosAtuais > 200) desconto = 0.2;
    else if (pontosAtuais > 100) desconto = 0.1;

    const valorTotal = (produto.preco * quantidade) * (1 - desconto);
    db.transacoes.insertOne({ idProduto, idUsuario, quantidade, valorTotal });
    print("Transação com desconto aplicada");
}
