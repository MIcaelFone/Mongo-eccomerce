//Use o comando abaixo para executar o arquivo
db.users.updateMany(
    {},
    { $set: { location: { type: "Point", coordinates: [longitude, latitude] } } }
);
//Criar índices 2dsphere
db.users.createIndex({ location: "2dsphere" });
db.products.createIndex({ location: "2dsphere" });
//Consulta de distancia    
db.products.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [userLongitude, userLatitude] },
        $maxDistance: raioEmMetros
      }
    }
});
//Agregação para Média de Distância entre Compradores e Vendedores:
db.transactions.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "idProduto",
        foreignField: "_id",
        as: "produto"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "usuario"
      }
    },
    {
      $addFields: {
        distancia: {
          $geoNear: {
            $geometry: { type: "Point", coordinates: ["$usuario.location", "$produto.location"] },
            spherical: true
          }
        }
      }
    },
    { $group: { _id: null, distanciaMedia: { $avg: "$distancia" } } }
]);
// Buscar Produtos por Proximidade Geográfica:
db.products.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [userLongitude, userLatitude] },
        $maxDistance: raioEmMetros
      }
    }
});
  
 
 