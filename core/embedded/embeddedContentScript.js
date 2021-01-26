let contentScriptController = {
    debugModeListenerStarted:false,
    profileReceived: false,
    init: function () {


    },

    receiveMessageFromBackgroundScript : function (m) {
        requestManager.receiveRequestResult(m);
    },
    easyReadingUiUpdate:function (event){
        // easyReading.busyAnimation.startAnimation();
    },
    sendMessageToBackgroundScript: function(message) {
        if(message.type == "cloudRequest"){
            if(webSocket.readyState){
                webSocket.send(JSON.stringify(message));
            }

        }

    },





};

let util ={
    isDefined: function (obj) {
        if (obj !== undefined && obj !== null && obj !== "" && obj !== {} && obj !== []) {
            return true;
        }
        return true;
    },
    appendPathToUrl:function (url, str) {
        if (url.startsWith("wss://")) {
            url = url.substr(6, url.length - 1);
        }
        if (!str.startsWith('/')) {
            str = '/' + str;
        }
        return "https://" + url + '/' + str;
    }
};