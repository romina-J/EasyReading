let easyReadingEndpointURL = "easy_reading_current_endpoint_url";
let webSocket = new WebSocket(easyReadingEndpointURL.replace("https","wss"));
let webSocketIsConnected = false;
webSocket.onopen = function(ev){
    webSocket.send(JSON.stringify({
        type:"embeddedLogin"
    }));

    webSocketIsConnected = true;
    setTimeout(function () {
        webSocketKeepAlivePing();
    }, 10000);


};

function webSocketKeepAlivePing(){

    if(webSocketIsConnected){
        webSocket.send({type: "ping"});
        setTimeout(function () {
            webSocketKeepAlivePing();
        }, 10000);
    }

}

webSocket.onmessage = function(message){
    let receivedMessage = JSON.parse(message.data);

    if(receivedMessage.type === "userLoginResult"){
        let uiCollection = receivedMessage.result;
        uiCollection.serverURL=easyReadingEndpointURL;
        easyReading.startup(uiCollection);
    }else if(receivedMessage.type === "userUpdateResult"){
        let uiCollection = receivedMessage.result;
        uiCollection.serverURL=easyReadingEndpointURL;
        easyReading.update(uiCollection);
    }else{
        contentScriptController.receiveMessageFromBackgroundScript(receivedMessage);
    }


};
webSocket.onclose = function(ev){
    console.log(ev);
    webSocketIsConnected =  false;

};
webSocket.onerror = function(ev){
    console.log(ev);
    webSocketIsConnected =  false;
};