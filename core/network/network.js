const app = require('../../portal/app');

let network = {
    server: null,
    webSocketServer: null,
    webSocketConnections: [],
    initServer: function () {
        this.app = app;


        let http = require('http');
        let https = require('https');
        const fs = require('fs');

        if (!process.env.CLOUD_ENV) {
            const options = {
                key: fs.readFileSync('local/cert/localhost.key'),
                cert: fs.readFileSync('local/cert/localhost.cert'),
                requestCert: false,
                rejectUnauthorized: false
            };

            this.server = https.createServer(options, app);
            this.server.listen(8080);


        } else {

            this.server = http.createServer(app);
            this.server.listen(process.env.PORT || 3000);
        }

        let WebSocketServerClass = require('ws').Server;
        this.webSocketServer = new WebSocketServerClass({
            server: this.server
        });

        this.webSocketServer.on('connection', function connection(ws, req) {
            //Host url

            const url = require('url');
            let hostname = req.headers.host;
            let pathname = url.parse(req.url).pathname;
            let baseUrl = 'https://' + hostname + pathname;

            let webSocketConnection = require("./websocket-connection");
            network.addWebSocketConnection(new webSocketConnection(ws, baseUrl));

        });


    },
    addWebSocketConnection: function (webSocketConnection) {
        this.webSocketConnections.push(webSocketConnection);

    },
    removeWebSocketConnection: function (webSocketConnection) {

        let index = this.webSocketConnections.indexOf(webSocketConnection);
        if (index > -1) {
            this.webSocketConnections.splice(index, 1);
        }
    },

    getConnectionWithUUID: function (uuid) {

        for (let i = 0; i < this.webSocketConnections.length; i++) {
            if (this.webSocketConnections[i].uuid === uuid) {
                return this.webSocketConnections[i];
            }
        }
        return null;

    },

    updateProfileForConnectedClients:function (profile) {
        console.log("Updating profile - active connections:"+this.webSocketConnections.length);
        let profileNormalized = false;
        for (let i = 0; i < this.webSocketConnections.length; i++) {

            console.log("Comparing id: "+this.webSocketConnections[i].profile.id+ " with profile.id "+profile.id);
            if (this.webSocketConnections[i].profile.id === profile.id) {


                console.log("Found match");
                this.webSocketConnections[i].updateProfile(profile,profileNormalized);
                profileNormalized = true;

            }
        }

    }


};


module.exports = network;
