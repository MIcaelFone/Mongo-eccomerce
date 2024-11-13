use('ecommerce');

db.getCollection('products').find(
    { idcategoria: ObjectId("67328153a45cda7afe4cd0f4") },   
    { nome: 1, descricao: 1 }  // Projeção para exibir apenas os campos 'nome' e 'descricao'
);
console.log("Produtos da categoria 'Eletrônicos' exibidos com sucesso");

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
db.getCollection('transacoes').aggregate([
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
            _id: "$categorias.nome",
            soma_total: { 
                $sum: { $multiply: ["$quantidade", "$produto.preco"] }
            }
        }
    },
    {
        $project: {
            _id: 1,
            soma_total: 1
        }
    }
]);
