use('ecommerce');
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
categoriaGanharPontos("6732b521ed38e04887379d36", 100); // Adiciona 100 pontos à categoria com o ID fornecido
