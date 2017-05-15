
/**
 * Module dependencies
 */

const {vk} = require("./vkConnector");
const config = require("./config");
const request = require("request-promise");

vk.longpoll.on("message", msg => {
    if (msg.flags.indexOf('outbox') !== -1) {
        return;
    }
    makeReuqest(msg)
        .then(JSON.parse)
        .then(data => {
            if (data.cod !== 200) {
                return msg.send("Please provide existing city");
            }
            let result;
            if (data.main.temp > 0) {
                result = `+${data.main.temp}, ${data.weather[0].main}, ${data.weather[0].description}, ${data.name}, ${data.sys.country}`;
            }
            msg.send(result);
        })
        .catch(err => {console.error(err)})
});

const makeReuqest = msg => {
    return new Promise((resolve, reject) => {
        request(`http://api.openweathermap.org/data/2.5/weather?q=${msg.text}&APPID=${config.weatherKey}&units=metric`)
            .then((doc) => {
                return resolve(doc);
            })
            .catch((err) => {
                return reject(err);
            });
    });
};
