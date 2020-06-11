const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://dbUSer:b4ZvOtiDCDo3ORsI@cluster0-cnzzj.azure.mongodb.net/test";
const conf = { useNewUrlParser: true, useUnifiedTopology: true }

const client = new MongoClient(uri, conf);
  return client.connect()
    .then(res => res.db("dbCotacoes"))
    .then(res => res.collection("opcoes").find({ Produto: { $regex: `^` } }))
    .then(res => res.toArray())
    .then(res => {
      let text = '';
      res.map(dado => {
        text += `${dado.Produto}\n`
        return text
      })
      client.close()
      console.log(text)
      return text
    })
    .catch(err => console.log(err))