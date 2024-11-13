//Use o comando abaixo para executar o arquivo
function coordinatesUsuario(longitude, latitude,idusuario) {
    db.users.updateOne(
        {_id:ObjectId(idusuario)},
        { $set: { location: { type: "Point", coordinates: [longitude, latitude] } } }
    );
}
coordinatesUsuario(-46.633309, -23.55052,"6732b521ed38e04887379d31");

console.log("Coordenadas de usuários inseridas com sucesso");
//Criar índices 2dsphere
db.users.createIndex({ location: "2dsphere" });
db.products.createIndex({ location: "2dsphere" });
console.log("Índices 2dsphere criados com sucesso");
db.users.getIndexes();
db.products.getIndexes();
//Consulta de distancia    
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
console.log("Média de distância calculada com sucesso");
// Buscar Produtos por Proximidade Geográfica:
db.products.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [userLongitude, userLatitude] },
        $maxDistance: raioEmMetros
      }
    }
});
console.log("Produtos encontrados com sucesso");
  

 