const axios = require('axios');
const { stripIndent } = require('common-tags');
const { escape } = require('querystring');

const api_key = 'be659c47b5f9b600c3132fd023e6dcc7';
const lang = 'pt_br';
const unit = 'metric';

function formatar(weather, main, name) {
    const { description } = weather[0]
    const { temp, feels_like, temp_min, temp_max, humidity } = main
    return stripIndent `
        *${name}* ( ${temp} C )
        sensação de ${feels_like} C
        mínima de ${temp_min} C
        máxima de ${temp_max} C
        umidade ${humidity}%
        ${description}
    `
}

exports.handler = function(context, event, callback) {
	const twiml = new Twilio.twiml.MessagingResponse();
	
	const query = escape(event.Body);
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&lang=${lang}&units=${unit}&appid=${api_key}`;

	axios
	    .get(url)
        .then(res => {
            return formatar(res.data.weather, res.data.main, res.data.name )
        })
	    .catch((err) => {
	        console.log(err)
	        return ('Erro ao obter dados');
	    })
	    .then((response) => {
        	twiml.message(response);
        	callback(null, twiml);
	        
	    });


};
