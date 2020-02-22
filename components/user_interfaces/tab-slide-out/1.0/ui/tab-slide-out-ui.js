class TabSlideOutUserInterface extends UserInterfaceBase {
    constructor(configuration, tabConfiguration) {
        super(configuration, tabConfiguration);

        this.configuration = configuration;
        this.currentToolId = 1;

        this.toolsContainers = [];
    }        

    initUI(){
        let userInterface = this;
        $("body").prepend(
            '<div id="er-tab-slide-out" class="easy-reading-interface draggable ui-widget-content" style="z-index: 99999">' +
                '<div id="er-tab-slide-out-handle" class="handle" tabindex="0" style="width: ' + (this.configuration.buttonSize) + 'px;height: ' + (this.configuration.buttonSize) + 'px;"></div>' +
                '<div id="er-tab-slide-out-grid-container"></div>' +
            '</div>');
        let panVis = false;
        let panPos = {top: 200, left: 200};
        let hanPos = {top: 0, left: 0};
        if (this.tabConfiguration && (this.configuration.tabPositioning === this.tabConfiguration.tabPos)) {
            console.log(this.tabConfiguration);
            panVis = this.tabConfiguration.panVis;
            panPos = this.tabConfiguration.panPos;
            hanPos = this.tabConfiguration.hanPos;
        }
        $("#er-tab-slide-out").erTabSlideOut({
            tabPositioning: this.configuration.tabPositioning,
            panelVisible: panVis,
            panelPos: panPos,
            handlePos: hanPos,
            saveConfig: function(oldConf) {
                uiUpdateManager.saveCurrentConfiguration(userInterface, oldConf);
            }
        });
    }

    show(){
        $("#er-tab-slide-out").show();
    }

    hide(){
        $("#er-tab-slide-out").hide();
    }

    getToolContainerIDForLayout(toolID, layoutConfig, order) {

        let animatedCSSClass = "";
        if (typeof order !== "undefined") {
            animatedCSSClass = " tab-slide-out-animated";
        }

        let currentContainerID = "tab-slide-out-container-" + this.currentToolId;
        this.currentToolId++;

        let toolInfo = {
            toolID: toolID,
            containerID: currentContainerID,
        };


        if (typeof order !== "undefined" && order < this.toolsContainers.length) {

            let currentToolInThatOrder = this.toolsContainers[order];

            if ($("#er-tab-slide-out").erTabSlideOut("option", "panelVisible")) {

                $("#" + currentToolInThatOrder.containerID).before('<div class="er-tab-slide-out-grid-item' + animatedCSSClass + '" id="' + currentContainerID + '" style="width: ' + this.configuration.buttonSize + 'px;height: ' + this.configuration.buttonSize + 'px;"></div>');

            } else {

                $("#" + currentToolInThatOrder.containerID).before('<div class="er-tab-slide-out-grid-item" id="' + currentContainerID + '" style="width: ' + this.configuration.buttonSize + 'px;height: ' + this.configuration.buttonSize + 'px;"></div>');
                $("#" + currentContainerID).hide();
                setTimeout(function () {
                    $("#" + currentContainerID).show();
                    $("#" + currentContainerID).addClass("tab-slide-out-animated");
                }, 500);

            }

            this.toolsContainers.splice(order, 0, toolInfo);


        } else {

            if (typeof order === "undefined") {

                $('#er-tab-slide-out-grid-container').append('<div class="er-tab-slide-out-grid-item" id="' + currentContainerID + '" style="width: ' + this.configuration.buttonSize + 'px;height: ' + this.configuration.buttonSize + 'px;"></div>');

            } else {
                if ($("#er-tab-slide-out").erTabSlideOut("option", "panelVisible")) {

                    $('#er-tab-slide-out-grid-container').append('<div class="er-tab-slide-out-grid-item' + animatedCSSClass + '" id="' + currentContainerID + '" style="width: ' + this.configuration.buttonSize + 'px;height: ' + this.configuration.buttonSize + 'px;"></div>');
                } else {

                    $('#er-tab-slide-out-grid-container').append('<div class="er-tab-slide-out-grid-item" id="' + currentContainerID + '" style="width: ' + this.configuration.buttonSize + 'px;height: ' + this.configuration.buttonSize + 'px;"></div>');
                    $("#" + currentContainerID).hide();
                    setTimeout(function () {
                        $("#" + currentContainerID).show();
                        $("#" + currentContainerID).addClass("tab-slide-out-animated");
                    }, 500);
                }
            }

            this.toolsContainers.push(toolInfo);

        }
        return currentContainerID;
    }

    removeContainerForTool(toolID) {

        for (let i = 0; i < this.toolsContainers.length; i++) {
            if (this.toolsContainers[i].toolID === toolID) {


                $('#' + this.toolsContainers[i].containerID).remove();
                this.toolsContainers.splice(i, 1);
                console.log("REMOVING:" + toolID);
                return;
            }
        }
    }

    toolsLoaded() {
        $("#er-tab-slide-out").erTabSlideOut("refresh");
    }

    remove(){
        $("#er-tab-slide-out").remove();
    }

    uiUpdated() {
        if (!$("#er-tab-slide-out").erTabSlideOut("option", "panelVisible")) {
            $("#er-tab-slide-out").erTabSlideOut("option", "panelVisible", true);
        }
        $("#er-tab-slide-out").erTabSlideOut("updatePanel");
        $("#er-tab-slide-out").erTabSlideOut("refresh");
        setTimeout(function () {
            $(".er-tab-slide-out-grid-item").removeClass("tab-slide-out-animated");
        }, 1000);
    }


}