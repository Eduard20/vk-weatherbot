
/**
 * Module dependencies
 */

const VK = require('vk-io');
const config = require("./config");
const request = require("request");

const vk = new VK(config.vkConf);

vk.longpoll.start()
    .then(() => {
        console.log('Long Poll запущен');
    })
    .catch((error) => {
        console.error(error);
    });
vk.longpoll.on("message", (msg) => {
    if (msg.flags.indexOf('outbox') !== -1) {
        return;
    }
    request(`http://api.openweathermap.org/data/2.5/weather?q=${msg.text}&APPID=${config.weatherKey}&units=metric`, (err, res, body) => {
        if (err) return console.error(err);
        console.log(body);
        let json = JSON.parse(body);
        let result;
        if (json.cod != 200) {
            return msg.send("Please provide existing city");
        }
        if (json.main.temp > 0) {
            result = `+${json.main.temp}, ${json.weather[0].main}, ${json.weather[0].description}, ${json.name}, ${json.sys.country}`;
        }
        msg.send(result);
    });
});
