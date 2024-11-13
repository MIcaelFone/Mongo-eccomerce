db.usuarios.updateMany(
    { "localizacao": { $exists: false } }, // Filtra usuários sem campo de localização
    { $set: { 
        "localizacao": { 
            type: "Point", 
            coordinates: [-49.2767, -25.4284]  // Valor de exemplo para Curitiba, altere conforme necessário
        } 
    }}
 );
 
 