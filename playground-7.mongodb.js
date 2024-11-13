db.users.getIndexes();
db.products.getIndexes();
function buscarProdutosPorProximidadeGeografica(userLongitude, userLatitude, raioEmMetros) {
    db.products.find({
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [userLongitude, userLatitude] },
                $maxDistance: raioEmMetros
            }
        }
    });
}
buscarProdutosPorProximidadeGeografica(-46.633309, -23.55052, 1000);
console.log("Produtos encontrados com sucesso");
//Agregação para Média de Distância entre Compradores e Vendedores:
