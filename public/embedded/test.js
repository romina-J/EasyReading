var classMapping = {'ContinuousChoiceButton':ContinuousChoiceButton,'AudioHighlighter':AudioHighlighter,'TwoStateButton':TwoStateButton,'AutoButton':AutoButton,'ContentReplacementSwitcher':ContentReplacementSwitcher,'Button':Button,'SingleChoiceButton':SingleChoiceButton,'TippyTooltip':TippyTooltip,'TabSlideOutUserInterface':TabSlideOutUserInterface,'SpinnerBusyAnimation':SpinnerBusyAnimation,};if(functionMapping){delete functionMapping;}  var functionMapping = {'colorize':colorize,'magnifyFont':magnifyFont,'shrinkFont':shrinkFont,'increaseLineHeight':increaseLineHeight,'decreaseLineHeight':decreaseLineHeight,'readability':readability,'easyReadingScreenRuler':easyReadingScreenRuler,};

let webSocket = new WebSocket("wss://localhost:8080");
webSocket.onopen = function(ev){
    webSocket.send(JSON.stringify({
        type:"embeddedLogin"
    }));
};
webSocket.onmessage = function(message){
    let receivedMessage = JSON.parse(message.data);

    if(receivedMessage.type === "userLoginResult"){
        let uiCollection = receivedMessage.result;
        easyReading.startup(uiCollection);
    }else{
        contentScriptController.receiveMessageFromBackgroundScript(receivedMessage);
    }


};
webSocket.onclose = function(ev){
    console.log(ev);
};
webSocket.onerror = function(ev){
    console.log(ev);
};

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
