const request = require('node-fetch');
module.exports = async function (url, data) {
    const obj = data;
    data.timeout = 3000;
    try {
        const res = await request(url, data);
        return await res.json()
    } catch (e) {return false;}
}