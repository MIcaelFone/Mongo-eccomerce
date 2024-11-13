use("ecommerce");
function criando_localizacao_geografica_produtos() {
    db.products.updateMany({}, {
        $set: {
            localizacao_geografica: {
                longitude: null ,  // Porcentagem de desconto (ex: 20 para 20%)
                latitude: null              // Data de término da promoção
            }
        }
    });
}
function criando_localizacao_users(){
    db.users.updateMany({}, {
        $set: {
            localizacao_geografica: {
                longitude: null ,  // Porcentagem de desconto (ex: 20 para 20%)
                latitude: null              // Data de término da promoção
            }
        }
    });
}
 
function coordinatesUsuario(longitude, latitude, idusuario) {
    db.users.updateOne(
        {_id: ObjectId(idusuario)},
        { $set: { localizacao_geografica: { type: "Point", coordinates: [longitude, latitude] } } }
    );
}

coordinatesUsuario(-49.633309, -23.55052, "6732b521ed38e04887379d31");

function coordinatesProduto(longitude, latitude,idproduto) {
    db.products.updateOne(
        {_id:ObjectId(idproduto)},
        { $set: { localizacao_geografica: { type: "Point", coordinates: [longitude, latitude] } } }
    );
    console.log("Coordenadas de produtos inseridas com sucesso");
}
coordinatesProduto(-47.633309, -23.55052,"6732b521ed38e04887379d3b");
 
function buscarProdutosPorProximidadeGeografica(userLongitude, userLatitude, raioEmMetros) {
    db.products.find({
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [userLongitude, userLatitude] },
                $maxDistance: raioEmMetros
            }
        }
    });
    console.log("Produtos encontrados com sucesso");
}
buscarProdutosPorProximidadeGeografica(-46.633309, -23.55052, 1000);
