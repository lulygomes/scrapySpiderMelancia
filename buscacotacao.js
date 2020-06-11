const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://dbUSer:b4ZvOtiDCDo3ORsI@cluster0-cnzzj.azure.mongodb.net/test";
const conf = { useNewUrlParser: true, useUnifiedTopology: true }

function buscaCotacao(produto) {

  const client = new MongoClient(uri, conf);
  return client.connect()
    .then(res => res.db("dbCotacoes"))
    .then(res => res.collection("cotacoes").find({ Produto: { $regex: `^${produto}` } }))
    .then(res => res.toArray())
    .then(res => {
      let text = '';
      text = text + res.map(dado => {
        text = text + `\n \n *Produto: ${dado.Produto}* \n Valor: ${dado.Valor} \n Unidade: ${dado.Unidade} \n Mercado: ${dado.Mercado} \n Descricao: ${dado.Descricao}`
        return text
      })
      client.close()
      return text
    })
    .catch(err => console.log(err))

}
/*  err => {
 let text = '';
 const banco = client.db("test");
 banco.collection("devices")
   .then(res => {
     return res.find({ Produto: {$regex: `^${produto}`} }).toArray()
   })
   .then(res => {
     let text = '';
     text = text + res.map(dados => {
       text = text + `\n \n *Produto: ${dado.Produto}* \n Valor: ${dado.Valor} \n Unidade: ${dado.Unidade} \n Mercado: ${dado.Mercado} \n Descricao: ${dado.Descricao}`
       return text  
     })
     console.log(text)
   })
   .catch(err => console.log(err))
 
 console.log(dados)
 client.close();
});
} */

fetch(buscaCotacao('A'))
  .then(res => console.log(res))
  .catch(err => console.log(err))

console.log(teste)


/*
// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;


const uri = "mongodb+srv://dbUSer:b4ZvOtiDCDo3ORsI@cluster0-cnzzj.azure.mongodb.net/test";
const conf = { useNewUrlParser: true, useUnifiedTopology: true };

function buscaCotacao(produto) {


}



function formatarClima(weather, main, name) {
    const { description } = weather[0];
    const { temp, feels_like, temp_min, temp_max, humidity } = main;
    return `
        *${name}* ( ${temp} C ) \n
        sensação de ${feels_like} C \n
        mínima de ${temp_min} C \n
        máxima de ${temp_max} C \n
        umidade ${humidity}% \n
        ${description}
    `;
}
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));



    function clima(agent) {
        const api_key = 'be659c47b5f9b600c3132fd023e6dcc7';
        const lang = 'pt_br';
        const unit = 'metric';
        const query = agent.parameters.cidade;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&lang=${lang}&units=${unit}&appid=${api_key}`;
        console.log(url);
        return axios
            .get(url)
            .then(res => {
                const texto = formatarClima(res.data.weather, res.data.main, res.data.name);
                return agent.add(texto);
            })
            .catch((err) => {
                console.log(err);
                return ('Erro ao obter dados');
            });


    }

    function cotacao(agent) {
        let produto = agent.parameters.produto;
			const client = new MongoClient(uri, conf);
  			return client.connect()
    			.then(res => res.db("dbCotacoes"))
    			.then(res => res.collection("cotacoes").find({ Produto: { $regex: `^${produto}` } }))
    			.then(res => res.toArray())
    			.then(res => {
      			let text = '';
                text = text + res.map(dado => {
        		text = text + `\n \n *Produto: ${dado.Produto}* \n Valor: ${dado.Valor} \n Unidade: ${dado.Unidade} \n Mercado: ${dado.Mercado} \n Descricao: ${dado.Descricao}`;
        		console.log('******',text);
        		return text;
      		});
	  			console.log('Resposta do banco formatada',text);
      			client.close();
      				return agent.add(text);
    		})
    			.catch(err => console.log(err));

        }


    let intentMap = new Map();
    intentMap.set('Clima', clima);
    intentMap.set('Cotacao', cotacao);
    agent.handleRequest(intentMap);
});


*/
