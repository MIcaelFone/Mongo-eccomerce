use('ecommerce');
db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "email", "endereco"],
            properties: {
                nome: {
                    bsonType: "string",
                    description: "Nome must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    description: "Email must be a string and is required"
                },
                endereco: {
                    bsonType: "string",
                    description: "Endereco must be a string and is required"
                }
            }
        }
    }
});

db.createCollection('products', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["nome", "preco", "descricao", "quantidade_disponivel", "idcategoria"],
            properties: {
                nome: {
                    bsonType: "string",
                    description: "Nome must be a string and is required"
                },
                preco: {
                    bsonType: "double",
                    description: "Preco must be a double and is required"
                },
                descricao: {
                    bsonType: "string",
                    description: "Descricao must be a string and is required"
                },
                quantidade_disponivel: {
                    bsonType: "int",
                    description: "Quantidade disponivel must be an int and is required"
                },
                idcategoria: {
                    bsonType: "objectId",
                    description: "Idcategoria must be an objectId and is required"
                }
            }
        }
    }
});

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
});

db.createCollection('transacoes', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["idproduto", "idusuario", "quantidade", "valor_total"],
            properties: {
                idproduto: {
                    bsonType: "objectId",
                    description: "Idproduto must be an objectId and is required"
                },
                idusuario: {
                    bsonType: "objectId",
                    description: "Idusuario must be an objectId and is required"
                },
                quantidade: {
                    bsonType: "int",
                    description: "Quantidade must be an int and is required"
                }
            }
        }
    }
});

db.createCollection('avaliacoes', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["idproduto", "idusuario", "nota"],
            properties: {
                idproduto: {
                    bsonType: "objectId",
                    description: "Idproduto must be an objectId and is required"
                },
                
                idtransacao: {
                    bsonType: "objectId",
                    description: "Idusuario must be an objectId and is required"
                },
                nota: {
                    bsonType: "int",
                    description: "Nota must be an int and is required"
                }
            }
        }
    }
});

db.getCollection('users').insertMany([
    { nome: "Alice", email: "alice@example.com", endereco: "Rua A, 123" },
    { nome: "Bob", email: "bob@example.com", endereco: "Rua B, 456" },
    { nome: "Carlos", email: "carlos@example.com", endereco: "Rua C, 789" },
    { nome: "Daniela", email: "daniela@example.com", endereco: "Rua D, 101" },
    { nome: "Evelyn", email: "evelyn@example.com", endereco: "Rua E, 202" }
]);
console.log("Usuários inseridos com sucesso");

db.getCollection('categories').insertMany([
    { nome: "Roupas", subcategories: ["Camisetas", "Calças", "Tênis"] },
    { nome: "Eletrônicos", subcategories: ["Celulares", "Notebooks"] },
    { nome: "Livros", subcategories: ["Ficção", "Não-ficção"] },
    { nome: "Alimentos", subcategories: ["Perecíveis", "Não-perecíveis"] },
    { nome: "Brinquedos", subcategories: ["Bonecas", "Carrinhos"] }
]);
console.log("Categorias inseridas com sucesso");

db.getCollection('products').insertMany([
    { 
        nome: "Camiseta", 
        preco: Double("50.00"), 
        descricao: "Camiseta branca", 
        quantidade_disponivel: Int32("100"), 
        idcategoria: ObjectId("67308a34d9328edf2cb7b363") 
    },
    { 
        nome: "Calça Jeans", 
        preco: Double("120.00"), 
        descricao: "Calça jeans de corte reto", 
        quantidade_disponivel: Int32("75"), 
        idcategoria: ObjectId("67308a34d9328edf2cb7b363") 
    },
    { 
        nome: "Tênis Esportivo", 
        preco: Double("200.00"), 
        descricao: "Tênis esportivo de corrida", 
        quantidade_disponivel: Int32("50"), 
        idcategoria: ObjectId("67308a34d9328edf2cb7b363") 
    },
    { 
        nome: "Jaqueta de Couro", 
        preco: Double("350.00"), 
        descricao: "Jaqueta de couro preta", 
        quantidade_disponivel: Int32("30"), 
        idcategoria: ObjectId("67308a34d9328edf2cb7b363") 
    },
    { 
        nome: "Chapéu de Sol", 
        preco: Double("40.00"), 
        descricao: "Chapéu de sol estilo fedora", 
        quantidade_disponivel: Int32("200"), 
        idcategoria: ObjectId("67308a34d9328edf2cb7b363") 
    }
]);
console.log("Produtos inseridos com sucesso");
 
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
 