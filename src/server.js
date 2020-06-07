const express =  require("express")
const server = express ()

//pegar o banco de dados
const db = require("./database/db.js")

//configurar pasta publica através da função static
server.use(express.static("public"))

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }))

/* usando template engine 
-nunjucks é um modulo que foi instalando com o npm
a pasta é o primeiro parametro
o servidor é o express
*/
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {   
    express: server,
    noCache: true
})



//configurar caminhos da minha app
/* pagina inicial 
req:requisição
res:resposta

__dirname  : é pra concatenar c o caminho
*/
/* pagina inicial é   "/" */
server.get("/", (req,res) => {
    return res.render("index.html")
})


server.get("/create-point", (req,res) => {
    //re.query: query strings da nossa url
    console.log(req.query)

    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    //req.body: corpo do nosso formulario
    //consol.log(req.body)

    //Inserir dados no banco de dados 
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})


/* Sem nuncjuks : res.sendFile(__dirname + "/views/search-results.html"); */
/* com Nunjucks */
server.get("/search", (req,res) => {

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html", { total: 0 })

    }

    //Consultar os dados da tabela
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err)
        }
        
        const total = rows.length; 

        //mostrar pag html com os dados do bd
        return res.render("search-results.html", { places: rows , total: total})
    })

})

//ligar o servidor, porta 3000
server.listen(3000)











/*no git bash(linha de comando) digitar : node src/server, p criar o servidor.. ou ir no package.json e mudar
onde tem test p start e botar "node src/server.js"

o nodemon é pra n ter q ficar reiniciando o server
altera no package.json pra nodemon src/server



npm install nunjucks
npm start

lembrar de instalar o template do nunjucks nas extensões
*/