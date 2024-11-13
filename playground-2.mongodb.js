use('ecommerce');

db.getCollection('products').find(
    { idcategoria: ObjectId("67328153a45cda7afe4cd0f4") },   
    { nome: 1, descricao: 1 }  // Projeção para exibir apenas os campos 'nome' e 'descricao'
);
console.log("Produtos da categoria 'Eletrônicos' exibidos com sucesso");


db.getCollection('transacoes').insertOne({
    idproduto: ObjectId("67328153a45cda7afe4cd0fe"),
    idusuario: ObjectId("67328153a45cda7afe4cd0f5"),
    quantidade: 2,
    valor_total: 200
});

console.log("Transação inserida com sucesso");
db.getCollection("avaliacoes").insertMany([
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
db.getCollection('avaliacoes').find(
    { idproduto: ObjectId("6731c95c31decff1925311ce") },
    { "nota": 1,  "idproduto": 1 }
)
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


db.getCollection('products').aggregate([
    {
        $lookup: {
            from: "avaliacoes",
            localField: "_id",
            foreignField: "idproduto",
            as: "avalia"
        }
    },
    {
        $unwind: { path: "$avalia", preserveNullAndEmptyArrays: true }
    },
    {
        $group: {
            _id: "$_id",  // Agrupa por ID de cada produto
            nome: { $first: "$nome" },
            soma_notas: { $sum: "$avalia.nota" },  // Soma das notas para cada produto
            quantidade_avaliacoes: { $sum: { $cond: [{ $ifNull: ["$avalia.nota", false] }, 1, 0] } }  // Quantidade de avaliações por produto
        }
    },
    {
        $project: {
            nome: 1,
            nota: 1,
            nota_media: {
                $cond: {
                    if: { $eq : ["$quantidade_avaliacoes", 0] },
                    then: null,
                    else: { $divide: ["$soma_notas", "$quantidade_avaliacoes"] }
                }
            }
        }
    }
]);
db.getCollection('transacoes').aggregate([
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
db.createCollection('categories', {

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

/*
    Otimização de Consultas no MongoDB

    Para melhorar a performance das consultas no banco de dados 'ecommerce', 
    consideramos a criação de índices nos campos que são frequentemente utilizados 
    em operações de busca, junção e filtragem. Abaixo estão as sugestões de índices:

    1. Índices em Campos Usados em Consultas

       Coleção 'products':
       - Índice em 'idcategoria': 
         Esse índice ajudará a acelerar as consultas que filtram produtos por categoria.
         Exemplo:
         db.products.createIndex({ idcategoria: 1 });

       - Índice em '_id': 
         O campo '_id' já é indexado por padrão, mas considere adicionar índices para outros campos 
         se houver muitas operações de busca.

       Coleção 'transacoes':
       - Índice em 'idproduto': 
         Esse índice melhorará a performance das operações de lookup ao buscar produtos.
         Exemplo:
         db.transacoes.createIndex({ idproduto: 1 });

       - Índice em 'idusuario': 
         Se houver buscas frequentes por transações de um usuário específico, este índice pode ser útil.
         Exemplo:
         db.transacoes.createIndex({ idusuario: 1 });

       Coleção 'avaliacoes':
       - Índice em 'idproduto': 
         Este índice acelerará as junções com a coleção 'products' usando 'idproduto'.
         Exemplo:
         db.avaliacoes.createIndex({ idproduto: 1 });

       - Índice em 'idtransacao': 
         Se houver buscas frequentes por avaliações associadas a uma transação, este índice pode ser útil.
         Exemplo:
         db.avaliacoes.createIndex({ idtransacao: 1 });

       Coleção 'categories':
       - Índice em 'nome': 
         Se houver buscas frequentes por categorias pelo nome, considere criar um índice nesse campo.
         Exemplo:
         db.categories.createIndex({ nome: 1 });

    2. Índices Compostos:
       Se houver filtros frequentes em múltiplos campos, considere criar índices compostos. Por exemplo:
       - Índice em 'transacoes' para 'idusuario' e 'idproduto':
         db.transacoes.createIndex({ idusuario: 1, idproduto: 1 });

    3. Análise de Consultas:
       Utilize o comando 'explain()' nas consultas para analisar como o MongoDB está executando-as
       e se está utilizando os índices corretamente. Isso ajuda a identificar consultas que podem ser otimizadas.
       Exemplo:
       db.transacoes.aggregate([...]).explain("executionStats");

    4. Considerações Finais:
       - Custo de Manutenção de Índices: 
         Lembre-se de que índices aumentam o custo de gravação e atualização, pois o índice precisa ser mantido. 
         Portanto, é importante encontrar um equilíbrio entre a velocidade de leitura e o custo de escrita.

       - Monitoramento de Performance: 
         Monitore regularmente o desempenho das suas consultas e ajuste os índices conforme necessário. 
         O padrão de acesso aos dados pode mudar com o tempo, e os índices devem ser ajustados para refletir isso.
*/