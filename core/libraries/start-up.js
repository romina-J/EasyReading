var easyReading = {
    started: false,
    init: function () {
        easyReading.uiCollection = [];
        easyReading.userInterfaces = [];
        easyReading.widgets = [];
        easyReading.presentations = [];
        easyReading.busyAnimation = null;
    },

    startup: function (uiCollection) {
        console.log("startup");
        this.init();
        easyReading.started = true;
        globalEventListener.init();
        this.uiCollection = uiCollection;

        //https://jsperf.com/fast-array-foreach

        for (let i = 0; i < this.uiCollection.userInterfaces.length; i++) {
            let currentUserInterface = new classMapping[this.uiCollection.userInterfaces[i].source.implementationClass](this.uiCollection.userInterfaces[i].configuration);
            currentUserInterface.id = this.uiCollection.userInterfaces[i].source.id;
            currentUserInterface.uiId = i;
            currentUserInterface.initUI();
            currentUserInterface.tools = [];

            for (let j = 0; j < this.uiCollection.userInterfaces[i].tools.length; j++) {

                this.uiCollection.userInterfaces[i].tools[j].function.toolId = j;

                let targetID = currentUserInterface.getContainerIDForLayout(this.uiCollection.userInterfaces[i].tools[j].layout);
                let currentWidget = new classMapping[this.uiCollection.userInterfaces[i].tools[j].widget.source.implementationClass](this.uiCollection.userInterfaces[i].tools[j].function, currentUserInterface, targetID, this.uiCollection.userInterfaces[i].tools[j].widget.configuration);
                this.widgets.push(currentWidget);
                let currentPresentation = null;

                if (typeof this.uiCollection.userInterfaces[i].tools[j].presentation !== "undefined") {

                    currentPresentation = new classMapping[this.uiCollection.userInterfaces[i].tools[j].presentation.source.implementationClass](this.uiCollection.userInterfaces[i].tools[j].function, currentUserInterface, this.uiCollection.userInterfaces[i].tools[j].presentation.configuration);

                    this.presentations.push(currentPresentation);
                }

                currentUserInterface.tools.push(
                    {
                        function: this.uiCollection.userInterfaces[i].tools[j].function,
                        widget: currentWidget,
                        presentation: currentPresentation,

                    }
                );

            }
            easyReading.userInterfaces.push(currentUserInterface);
        }

        easyReading.busyAnimation = new classMapping[this.uiCollection.busyAnimation.source.implementationClass](this.uiCollection.busyAnimation.configuration);


        globalEventListener.initEventListeners();

    },

    shutdown: function () {

        if(easyReading.started){
            console.log("reset");
            globalEventListener.reset();
            easyReading.widgets.forEach(function(widget) {
                widget.remove();
            });

            easyReading.presentations.forEach(function(presentation) {
                presentation.remove();
            });

            easyReading.userInterfaces.forEach(function(userInterface) {
                userInterface.remove();
            });

            easyReading.started = false;
        }

    }
};


document.addEventListener('easyReadingStartUp', function (event) {
    let requestResult = document.getElementById('easy-reading-debug');
    let uiCollection = JSON.parse(requestResult.dataset.result);
    easyReading.shutdown();
    easyReading.startup(uiCollection);


});

document.addEventListener('userLogout', function (event) {
    easyReading.shutdown();

});