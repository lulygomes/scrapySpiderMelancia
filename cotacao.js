const MongoClient = require('mongodb');
const { stripIndent } = require('common-tags');

const uri = "mongodb+srv://dbUSer:b4ZvOtiDCDo3ORsI@cluster0-cnzzj.azure.mongodb.net/test";

function formata(main) {
    let text = '';
    main.forEach((main) => {
        text = text + stripIndent`
        
        #
        
        *Produto: ${main.Produto}*
        Valor: ${main.Valor}
        Unidade: ${main.Unidade}
        Mercado: ${main.Mercado}
        Descricao: ${main.Descricao}
        
        #
        
        `
        return (text);
    })
    return(text);

}

async function busca(nome) {
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db("dbCotacoes");
    //const nome = 'Ovo';
    const query = { Produto: {$regex: `^${nome}`} };
    const resposta = await db.collection("cotacoes").find(query).toArray();
    console.log('logs de busca', resposta)
    return resposta;
}

exports.handler = async function(context, event, callback) {
    let twiml = new Twilio.twiml.MessagingResponse();
    const query = escape(event.Body);
    busca(query)
        .then(res => {
            console.log('log de res: ',res)
            return formata(res) 
        })
        .then((res) => {
            twiml.message(res)
            callback(null, twiml) 
        })
        .catch(err => { 
            return 'erro do app'
        });
}