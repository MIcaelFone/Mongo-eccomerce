use('ecommerce');

db.getCollection('products').find( // Busca todos os produtos
    { idcategoria: ObjectId("67328153a45cda7afe4cd0f4") },   
    { nome: 1, descricao: 1 }  // Projeção para exibir apenas os campos 'nome' e 'descricao'
);
console.log("Produtos da categoria 'Eletrônicos' exibidos com sucesso");


db.getCollection('transacoes').insertOne({ // Insere uma transação de teste
    idproduto: ObjectId("67328153a45cda7afe4cd0fe"),
    idusuario: ObjectId("67328153a45cda7afe4cd0f5"),
    quantidade: 2,
    valor_total: 200
});

console.log("Transação inserida com sucesso");
db.getCollection("avaliacoes").insertMany([ // Insere avaliações de teste
    {
        idproduto: ObjectId("67328153a45cda7afe4cd0ff"),
        idtransacao: ObjectId('673105ed366b0e83553d4822'),
        idusuario: ObjectId("67328153a45cda7afe4cd0f4"),
        nota: Int32(5)
    },
    {
        idproduto: ObjectId("67328153a45cda7afe4cd0fe"),
        idtransacao: ObjectId('673105ed366b0e83553d4822'),
        idusuario: ObjectId("67328153a45cda7afe4cd0f5"),
        nota: Int32(20)
    }
]);

console.log("Avaliação inserida com sucesso");
// Questao 3
function procurarAvaliacoes(idProduto) { // Função para procurar avaliações de um produto
    return db.getCollection('avaliacoes').find(
        { idproduto: ObjectId(idProduto) }
    ).toArray(); // Retorna um array de documentos
}
procurarAvaliacoes("67328153a45cda7afe4cd0ff");
function atualizaProduto(idproduto){
    
}

db.getCollection('products').find().forEach(function(product) {
    var product_id = product._id;
    var quantidade_original=product.quantidade_disponivel;
    var quantidade_vendida=db.transacoes.find({idproduto:product_id}).count();
    var quantidade_disponivel=quantidade_original-quantidade_vendida;
    db.products.updateOne(
        { _id: product_id },
        { $set: { quantidade_disponivel: quantidade_disponivel } }
    );
});    


// Calcula a quantidade disponível de cada produto


db.getCollection('transacoes').aggregate([ // Calcula o total de vendas por categoria
    {
        $lookup: {
            from: "products",
            localField: "idproduto",
            foreignField: "_id",
            as: "produto"
        }
    },
    { $unwind: "$produto",preserveNullAndEmptyArrays: true },
    {
        $lookup: {
            from: "categories",
            localField: "idcategoria",
            foreignField: "_id",
            as: "categorias"
        }
    },
    { $unwind: "$categorias",preserveNullAndEmptyArrays: true },
    {
        $group: {
            _id: "$categorias.nome",
            soma_total: { 
                $sum: { $multiply: ["$quantidade", "$produto.preco"] }
            }
        }
    },
    { $project: { id:1  } }
]);
db.createCollection('categories', { // Cria a coleção de categorias

    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "subcategories"],
            properties: {
                nome: {
                    bsonType: "string",
                    description: "Nome must be a string and is required"
                },
                subcategories: {
                    bsonType: "array",
                    description: "Subcategories must be an array"
                }
            }
        }
    }
})
db.transacoes.aggregate([
    {
        $lookup: {
            from: "products",
            localField: "idproduto",
            foreignField: "_id",
            as: "produto"
        }
    },
    {
        $unwind: {
            path: "$produto",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $lookup: {
            from: "categories",
            localField: "produto.idcategoria",
            foreignField: "_id",
            as: "categorias"
        }
    },
    {
        $unwind: {
            path: "$categorias",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: "$categorias.nome",  // Agrupa por nome da categoria
            totalVendas: { 
                $sum: "$valor_total"  // Soma o valor total das transações testes
            }
        }
    },
    {
        $project: {
            _id: 1,
            totalVendas: 1
        }
    }
]);

