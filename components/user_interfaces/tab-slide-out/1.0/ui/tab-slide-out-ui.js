class TabSlideOutUserInterface extends UserInterfaceBase {
    constructor(configuration, tabConfiguration) {
        super(configuration, tabConfiguration);

        this.configuration = configuration;
        this.currentToolId = 1;
        this.w_prev = 0; // Keep track of panel width and height as it is being dragged
        this.h_prev = 0;

        this.isOpen = false;
        this.toolsContainers = [];
    }

    initUI() {
        let drag_axis = 'y';
        if (this.configuration.tabPositioning === 'top' || this.configuration.tabPositioning === 'bottom') {
            drag_axis = 'x';
        }
        $("body").append(
            '<div id="easy-reading-tab-slide-out" class="easy-reading-interface draggable ui-widget-content" style="z-index: 99999">' +
            '<a id="tab-slide-out-handle-container" class="handle">' +
            '<div id="tab-slide-out-handle"></div>' +
            '</a>' +
            '<div id="tab-slide-out-grid-container"></div>' +
            '</div>');
        let panel = $('#easy-reading-tab-slide-out');
        let handle = $('#tab-slide-out-handle-container');
        let tab_pos = this.configuration.tabPositioning;
        let tabSlideout = this;
        panel.tabSlideOut({
            tabLocation: tab_pos,
            clickScreenToClose: false,
        }).draggable({
            axis: drag_axis,
            drag: function (event, ui) {
                if (drag_axis === 'x') {
                    if (ui.position.left < 0) {
                        ui.position.left = 0;
                        let handle_left = event.pageX;
                        if (handle_left < 0) {
                            handle_left = 0;
                        }
                        handle.css('left', handle_left);
                    } else {
                        let left_max = $(window).width() - panel.outerWidth();
                        if (ui.position.left > left_max) {
                            ui.position.left = left_max;
                            let handle_left = event.pageX - left_max;
                            let handle_left_max = panel.outerWidth() - handle.outerWidth();
                            if (handle_left > handle_left_max) {
                                handle_left = handle_left_max;
                            }
                            handle.css('left', handle_left);
                        }
                    }
                } else {
                    if (ui.position.top < 0) {
                        ui.position.top = 0;
                        if (!handle.css('top').startsWith("-") && handle.css('top') !== "0px") {
                            let mouse_top = event.clientY;
                            if (mouse_top < 0) {
                                mouse_top = 0;
                            }
                            let handle_top = mouse_top;
                            let top_max = panel.outerHeight() - handle.outerHeight();
                            if (mouse_top > top_max) {
                                handle_top = top_max;
                            }
                            handle.css('top', handle_top);
                        }
                    } else {
                        let top_max = $(window).height() - panel.outerHeight();
                        if (ui.position.top > top_max) {
                            ui.position.top = top_max;
                            let handle_top = event.pageY - top_max;
                            let handle_top_max = panel.outerHeight() - handle.outerHeight();
                            if (handle_top > handle_top_max) {
                                handle_top = handle_top_max;
                            }
                            handle.css('top', handle_top);
                        }
                    }
                }
                if (tab_pos === 'top') {
                    let h_diff = tabSlideout.h_prev - panel.outerHeight();
                    if (Math.abs(h_diff) > 1) {
                        tabSlideout.h_prev = panel.outerHeight();
                        if (!panel.tabSlideOut('isOpen')) {
                            ui.position.top += h_diff;
                        }
                    }
                }

            }
        });

        if (drag_axis === 'x') {
            $('#tab-slide-out-grid-container').addClass('tab-slide-out-grid-horizontal');
            $('#tab-slide-out-handle').addClass('tab-slide-out-handle-horizontal');
        }

        $("#easy-reading-draggable-tab").show();

        $(document).on('slideouttabopen slideouttabclose slideouttabbounce', function (event) {

            if (event.type == "slideouttabopen") {
                tabSlideout.isOpen = true;
            } else {
                tabSlideout.isOpen = false;
            }
        });
    }


    show() {
        $("#easy-reading-tab-slide-out").show();
    }

    hide() {

        $("#easy-reading-tab-slide-out").hide();
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

            if (this.isOpen) {

                $("#" + currentToolInThatOrder.containerID).before('<div class="tab-slide-out-grid-item' + animatedCSSClass + '" id="' + currentContainerID + '"></div>');
            } else {

                $("#" + currentToolInThatOrder.containerID).before('<div class="tab-slide-out-grid-item" id="' + currentContainerID + '"></div>');
                $("#" + currentContainerID).hide();
                setTimeout(function () {
                    $("#" + currentContainerID).show();
                    $("#" + currentContainerID).addClass("tab-slide-out-animated");
                }, 500);

            }

            this.toolsContainers.splice(order, 0, toolInfo);


        } else {

            if (typeof order === "undefined") {

                $('#tab-slide-out-grid-container').append('<div class="tab-slide-out-grid-item" id="' + currentContainerID + '"></div>');

            } else {
                if (this.isOpen) {

                    $('#tab-slide-out-grid-container').append('<div class="tab-slide-out-grid-item' + animatedCSSClass + '" id="' + currentContainerID + '"></div>');
                } else {
                    $('#tab-slide-out-grid-container').append('<div class="tab-slide-out-grid-item" id="' + currentContainerID + '"></div>');
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
        if (this.configuration.tabPositioning === 'top') {
            let panel = $("#easy-reading-tab-slide-out");
            let tabSlideout = this;
            panel.imagesLoaded(function () {
                tabSlideout.w_prev = panel.outerWidth();
                tabSlideout.h_prev = panel.outerHeight();
                panel.css({'top': '-' + tabSlideout.h_prev + 'px'});
            });
        }
    }

    remove() {
        $("#easy-reading-tab-slide-out").remove();
    }

    uiUpdated() {

        if (!this.isOpen) {
            $('#easy-reading-tab-slide-out').tabSlideOut('open');
        }

    }


}