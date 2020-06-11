const MongoClient = require('mongodb');
const { stripIndent } = require('common-tags');

const uri = "mongodb+srv://dbUSer:b4ZvOtiDCDo3ORsI@cluster0-cnzzj.azure.mongodb.net/test";

async function formata(main) {
    data = await getData();
    let text = `Data da cotação. \n*${data}*\n`;
    main.forEach((main) => {
        text = text + `\n \n *Produto: ${main.Produto}* \n Valor: ${main.Valor} \n Unidade: ${main.Unidade} \n Mercado: ${main.Mercado} \n Descricao: ${main.Descricao}`
        return (text);
    })
    text = text + '\n \n*Fonte: Instituto de Economia Agrícola (IEA)*\n '
    return(text);

}


function formataOpcao(main) {
    let text = 'Desculpa, Sua solicitacao não foi atendida, verifique abaixo as opcoes.\nLembre-se que é necessário colocar a primeira letra em *maiúsculo*. \nEx: Cafe \n ';
    main.forEach((main) => {
        text = text + `${main.Produto}, \n`
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
    const query = { Produto:{ $regex:`^${nome}`}};
    const resposta = await db.collection("cotacoes").find(query).toArray();
    console.log('logs de busca', resposta)
    return resposta;
}


async function buscaOpcao() {
        const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db("dbCotacoes");
    //const nome = 'Ovo';
    const query = { Produto: {$regex: `^`} };
    const resposta = await db.collection("opcoes").find(query).toArray();

    return await formataOpcao(resposta) ;
}

async function getData() {
        const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db("dbCotacoes");
    //const nome = 'Ovo';
    const query = { data: {$regex: `^`} };
    const resposta = await db.collection("cotacoes").find(query).toArray();
    return resposta[0].data ;
}



async function validaRes(res) {
    if (res.length > 0 ){
        return await formata(res) 
    } else {
        return await buscaOpcao()
    }
}

exports.handler = async function(context, event, callback) {
    let twiml = new Twilio.twiml.MessagingResponse();
    const query = escape(event.Body);
    busca(query)
        .then(res => {
            return validaRes(res)
        })
        .then((res) => {
            twiml.message(res)
            callback(null, twiml) 
        })
        .catch(err => { 
            return 'erro do app'
        });
}