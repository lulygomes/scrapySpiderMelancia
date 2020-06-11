const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const axios = require('axios');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function lerCardapio(agent) {
    const url = 'https://sheet.best/api/sheets/016e437c-7b5b-4e3e-b7e6-9d3da39c60f1';
    let menu = '*Esse aqui é o nosso cardápio* \n';
    return axios
      .get(url)
      .then((res) => {
        res.data.map(card => {
          menu += `\n-Cod:${card.Codigo} *${card.Nome}* Valor: ${card.Preco} \n`;
        });
        agent.add(menu);
      })
      .catch(err => console.log(err));

  }
  function gravaPedido(agent) {
    const url = 'https://sheet.best/api/sheets/016e437c-7b5b-4e3e-b7e6-9d3da39c60f1/tabs/pedidos';
    const { quantidade, obs, cod_produto, nome, metodo_pag } = agent.parameters;
	  let zap = request.body.queryResult.outputContexts[0].parameters.twilio_sender_id
    ;
    zap = zap.split(':')[1];

    axios
      .post(url, [{
        Codigo: Math.floor(Math.random() * 10000) + 1,
        Whatsapp: zap,
        Nome: nome,
        CodProduto: cod_produto,
        Quantidade: quantidade,
        Obs: obs,
        MetodoPagamento: metodo_pag,
        Status: "Pedido Realizado"
      }])
      .then((res) => {
        let num = res.data[0].Codigo;
        agent.add(`Pedido realizado com sucesso! \n Seu código de pedido é o ${num}, você pode utlizar esse código para consultar o estatus do seu pedido, basta enviar "Qual o status do meu pedido?". `)
      })
      .catch(err => console.log(err))

    /* 
    agent.add(`${nome} você pediu ${quantidade} do produto com cod ${cod_produto} com obs ${obs} vai pagar ${metodo_pag} seu contato é ${zap} `); */
  }
  function lerStatus(agent) {
    agent.add('Olha eu acabei de olhar, e seu pedido está ... .');
  }


  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Cardapio', lerCardapio);
  intentMap.set('Pedido', gravaPedido);
  intentMap.set('Status', lerStatus);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
