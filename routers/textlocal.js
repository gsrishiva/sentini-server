const axios = require("axios");

const tlClient = axios.create({
    baseURL: "https://api.textlocal.in/",
    params: {
        apiKey: "Oo4nTJbjGP0-lil1xlv09wXnaGEIh24nue8vTB5gJm", //Text local api key
        sender: "6 CHARACTER SENDER ID"
    }
});

const smsClient = {
    sendVerificationMessage: user => {
        if (user && user.phone) {
            const params = new URLSearchParams();
            params.append("numbers", [parseInt("91" + user.phone)]);
            params.append(
                "message",
                `Your  verification code for this Order is ${user.verifyCode}`
            );
            tlClient.post("/send", params);
        }
    }
};

module.exports = smsClient;