const mysql = require('mysql2')
const express = require('express');
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.urlencoded({extended: false}))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crud'
});

connection.connect(function(err){
    if(err){
        console.error('Erro: ',err)
        return
    }
    console.log("Conexão estabelecida com sucesso!")
});
/*
connection.query("INSERT INTO clientes(nome, idade, uf) VALUES (?, ?, ?)", function(err, result){
    if(!err){
        console.log("Dados inseridos com sucesso")
    } else{
        console.log("Erro. Não foi possivel inserir os dados ", err)
    }
});

connection.query("SELECT * FROM clientes ", function(err, rows, result){
    if(!err){
        console.log("resultados: ", rows)
    }else {
        console.log("Erro: Não foi possivel inserir os dados ",err)
    }
})*/
app.get("/formulario", function(req, res){
    res.sendFile(__dirname + "/formulario.html")
})
app.post('/adicionar',(req, res) =>{
    const nome = req.body.nome;
    const idade = req.body.idade;
    const uf = req.body.uf;

    const values = [nome, idade, uf]
    const insert = "INSERT INTO clientes(nome, idade, uf) VALUES (?, ?, ?)"

    connection.query(insert, values, function(err, result){
        if(!err){
            console.log("Dados inseridos com sucesso!");
            res.send("Dados inseridos!");
        } else{
            console.log("Não foi possivel inserir os dados ", err);
            res.send("Erro!")
        }
    })
})
app.get("/listar", function(req, res){

    const selectAll = "SELECT * FROM clientes";

    connection.query(selectAll, function(err, rows){
        if(!err){
            console.log("Dados inseridos com sucesso!");
            res.send(`
            <html>
                    <head>
                        <title> Lista de Clientes </title>
                    </head>
                    <body>
                        <h1> Lista de Clientes </h1>
                        <table>
                            <tr>
                                <th> Nome </th>
                                <th> Idade </th>
                                <th> UF </th>
                            </tr>
                            ${rows.map(row => `
                            <tr>
                                <td>${row.nome}</td>
                                <td>${row.idade}</td>
                                <td>${row.uf}</td>
                            </tr>
                            `).join('')}
                        </table>
                    </body>
            </html>  
        `);
      } else{
            console.log("Erro ao listar dados!", err);
            res.send("Erro!")
      }
    })
})

app.get("/",function(req,res){
    res.send(`
    <html>
    <head>
        <title> Sistema de gerenciamento de Usuários </title>
    </head>
    <body>
        <h1> Sistema de gerenciamento de Usuários </h1>
        <p><a href="http://localhost:8081/formulario"> Cadastrar usuário</a></p>
        <p><a href="http://localhost:8081/formulario"> Listar usuário</a></p>
    </body>
    </html>
    `)
})

app.listen(8081, function(){
    console.log("Servidor rodando na url http://localhost:8081")
})