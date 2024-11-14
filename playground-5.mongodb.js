use("ecommerce");
db.createCollection("avaliacoes", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["idproduto", "idusuario", "comentario", "dataavaliacao","respostaVendedor"],
        properties: {
          _id: {
            bsonType: "string",
            description: "Identificador único da avaliação (obrigatório)"
          },
          idproduto: {
            bsonType: "string",
            description: "Identificador do produto avaliado (obrigatório)"
          },
          idusuario: {
            bsonType: "string",
            description: "Identificador do comprador (obrigatório)"
          },
           
          comentario: {
            bsonType: "string",
            description: "Comentário deixado pelo comprador (obrigatório)"
          },
          dataAvaliacao: {
            bsonType: "date",
            description: "Data da avaliação (obrigatório)"
          },
          respostaVendedor: {
            bsonType: "object",
            required: ["dataResposta", "comentario"],
            properties: {
              dataResposta: {
                bsonType: "date",
                description: "Data da resposta do vendedor"
              },
              comentario: {
                bsonType: "string",
                description: "Comentário deixado pelo vendedor"
              }
            },
            description: "Resposta opcional do vendedor à avaliação"
          }
        }
      }
    }
  });
 function adicionarAvaliacao(idProduto, idUsuario, comentario, dataAvaliacao) {
    if(dataAvaliacao.length !== 10){
        print("Data de avaliação inválida");
        return;
    }
    else if( comentario.length < 5){
        print("Comentário deve ter pelo menos 5 caracteres");
        return;
    }
    else{
        db.avaliacoes.insertOne({
            idproduto: idProduto,
            idusuario: idUsuario,
            comentario: comentario,
            dataAvaliacao: new Date(dataAvaliacao),
            respostaVendedor: null
        });
        print("Avaliação adicionada com sucesso");
    }
 }
 function responderAvaliacao(idAvaliacao, comentarioResposta) {
    const avaliacao = db.avaliacoes.findOne({ _id: idAvaliacao });
    if (!avaliacao) {
        print("Avaliação não encontrada");
        return;
    }
    if (avaliacao.respostaVendedor) {
        print("Avaliação já possui uma resposta");
        return;
    }
    else{
        db.avaliacoes.updateOne(
            { _id: idAvaliacao },
            {
                $set: {
                    "respostaVendedor": {
                        dataResposta: new Date(),
                        comentario: comentarioResposta
                    }
                }
            }
        );
        print("Resposta adicionada com sucesso");
    }    
}   

  