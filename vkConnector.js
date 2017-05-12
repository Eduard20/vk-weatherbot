
const VK = require('vk-io');
const config = require("./config");

const vk = new VK(config.vkConf);

vk.longpoll.start()
    .then(() => {
        console.log('Long Poll запущен');
    })
    .catch((error) => {
        console.error(error);
    });

module.exports = {vk};