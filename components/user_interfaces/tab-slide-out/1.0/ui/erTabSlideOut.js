/*
tab slide out interface, double-draggable (drag the whole element and drag the handle relative to the whole element), 
capable of holding n DOM elements in a line-layout (horizontal version) or 2-column-grid (vertical version)
for usage, your page must contain the following DOM elements:
    '<div id="er-tab-slide-out">' +
        '<div id="er-tab-slide-out-handle"></div>' +
        '<div id="er-tab-slide-out-grid-container"></div>' +
    '</div>');

options 
tabPositioning: top, bottom, left, right (default)
panelVisible: true, false (default)

methods
refresh: refresh view status of panel
*/

$.widget("ui.erTabSlideOut", {
    
    // default options
    options: {
        tabPositioning: "right",
        panelVisible: false
    },

    _create: function() {
        this.ignoreNextClick = false;
        this.panel = $("#er-tab-slide-out");
        this.handle = $("#er-tab-slide-out-handle");
        this.dragAxis = 'y';
        if (this.options.tabPositioning === "top" || this.options.tabPositioning === "bottom") {
            $('#er-tab-slide-out-grid-container').addClass('er-tab-slide-out-grid-horizontal');
            this.dragAxis = 'x';
        }

        // enable 2-level dragging of the panel
        let prevMouseX = 0;
        let prevMouseY = 0;
        let handleOffsetXOnMousedown = 0;
        let handleOffsetYOnMousedown = 0;
        let mouseXInHandleOnMousedown = 0;
        let mouseYInHandleOnMousedown = 0;
        let haveBeenDraggingHandle = false;
        let erTSO = this;
        this.handle.mousedown(function(event){
            prevMouseX = event.clientX; // needed for dragging handle horizontally
            prevMouseY = event.clientY; // needed for dragging handle vertically
            handleOffsetXOnMousedown = erTSO.handle.position().left;
            handleOffsetYOnMousedown = erTSO.handle.position().top;
            mouseXInHandleOnMousedown = event.clientX - erTSO.handle.position().left - erTSO.panel.position().left;
            mouseYInHandleOnMousedown = event.clientY - erTSO.handle.position().top - erTSO.panel.position().top;
            haveBeenDraggingHandle = false;
            erTSO.ignoreNextClick = false; // click-events shall be ignored, if fired directly after a drag-event; on mousedown, we assume this is going to be a click; ignorenextClick is set to true in the drag-event
        });
             
        this.panel.draggable({
            axis: this.dragAxis,
            scroll: false,
            drag: function(evt, ui) {
                erTSO.ignoreNextClick = true;
                if (erTSO.dragAxis === 'x') {
                    let handleLeft = evt.clientX - erTSO.panel.position().left - mouseXInHandleOnMousedown;
                    if (ui.position.left < 0) {
                        ui.position.left = 0;
                        haveBeenDraggingHandle = true;
                        if (handleLeft < 0) {
                            handleLeft = 0;
                        }
                        if (evt.clientX > prevMouseX) {
                            if (evt.clientX >= mouseXInHandleOnMousedown) {
                                erTSO.handle.css('left', handleLeft);
                            }
                        } else {
                            erTSO.handle.css('left', handleLeft);
                        }
                    } else {
                        let leftMax = document.documentElement.clientWidth - erTSO.panel.outerWidth();
                        if (ui.position.left > leftMax) {
                            ui.position.left = leftMax;
                            haveBeenDraggingHandle = true;
                            let handleLeftMax = erTSO.panel.outerWidth() - erTSO.handle.outerWidth();
                            if (handleLeft > handleLeftMax) {
                                handleLeft = handleLeftMax;
                            }
                            if (evt.clientX < prevMouseX) {
                                let mouseXMostRightPosition = document.documentElement.clientWidth - (erTSO.handle.outerWidth() - mouseXInHandleOnMousedown); 
                                if (evt.clientX <= mouseXMostRightPosition) { // avoid moving handle while mouse is outside the page
                                    erTSO.handle.css('left', handleLeft);
                                }
                            } else {
                                erTSO.handle.css('left', handleLeft);
                            }
                        } else {
                            if (haveBeenDraggingHandle) {
                                // set handle to the position it had at mousdown (otherwise the last step in dragging it back would get lost)
                                erTSO.handle.css('left', handleOffsetXOnMousedown);
                                haveBeenDraggingHandle = false;
                            }
                        }
                    }
                    prevMouseX = evt.clientX;
                } else {
                    let handleTop = evt.clientY - erTSO.panel.position().top - mouseYInHandleOnMousedown;
                    if (ui.position.top < 0) {
                        ui.position.top = 0;
                        haveBeenDraggingHandle = true;
                        if (handleTop < 0) {
                            handleTop = 0;
                        }
                        if (evt.clientY > prevMouseY) {
                            if (evt.clientY >= mouseYInHandleOnMousedown) {
                                erTSO.handle.css('top', handleTop);
                            }
                        } else {
                            erTSO.handle.css('top', handleTop);
                        }
                    } else {
                        let topMax = window.innerHeight - erTSO.panel.outerHeight();
                        if (ui.position.top > topMax) {
                            ui.position.top = topMax;
                            haveBeenDraggingHandle = true;
                            let handleTopMax = erTSO.panel.outerHeight() - erTSO.handle.outerHeight();
                            if (handleTop > handleTopMax) {
                                handleTop = handleTopMax;
                            }
                            if (evt.clientY < prevMouseY) {
                                let mouseYBottommostPosition = window.innerHeight - (erTSO.handle.outerHeight() - mouseYInHandleOnMousedown); 
                                if (evt.clientY <= mouseYBottommostPosition) { // avoid moving handle while mouse is outside the page
                                    erTSO.handle.css('top', handleTop);
                                    }
                            } else {
                                erTSO.handle.css('top', handleTop);
                            }
                        } else {
                            if (haveBeenDraggingHandle) {
                                // set handle to the position it had at mousdown (otherwise the last step in dragging it back would get lost)
                                erTSO.handle.css('top', handleOffsetYOnMousedown);
                                haveBeenDraggingHandle = false;
                            }
                        }
                    }
                    prevMouseY = evt.clientY; 
                }
            }
        });

        // add callbacks for panel/handle positioning
        // (otherwise it might be positioned incorrectly if images in panel are not fully loaded yet)
        if (this.options.tabPositioning === 'top') {
            this.panel.imagesLoaded(function() {
                erTSO.panel.css({'top' : '-' + erTSO.panel.outerHeight() + 'px'});
                erTSO.handle.css({'top' : (erTSO.panel.outerHeight() - 1) + 'px'});
                erTSO._adaptToWindowSize();
                erTSO.refresh();
                erTSO._setTransitions();
            });
        } else if (this.options.tabPositioning === 'left') {
            this.panel.imagesLoaded(function() {
                erTSO.panel.css({'left' : '-' + erTSO.panel.outerWidth() + 'px'});
                erTSO.handle.css({'left' : (erTSO.panel.outerWidth() - 1) + 'px'});
                erTSO._adaptToWindowSize();
                erTSO.refresh();
                erTSO._setTransitions();
            });
        } else {
            this.panel.imagesLoaded(function() {
                erTSO._adaptToWindowSize();
                erTSO.refresh();
                erTSO._setTransitions();
            });
        }

        // change panel visibility on handle-click
        this.handle.click(function(evt) {
            if (!erTSO.ignoreNextClick) {
                erTSO.options.panelVisible = !erTSO.options.panelVisible;
                erTSO.refresh();
            }
        });

        // window resize (or scaling) might change panel size
        $(window).resize(function(evt) {
            $('.er-tab-slide-out-grid-horizontal').css({'flex-wrap' : 'nowrap'});
            erTSO._adaptToWindowSize();
            erTSO.refresh();
        });

        // set handler for keyboard accessibility
        $(document).on('keydown', function(evt) {
            if ($(evt.target).attr('id') === 'er-tab-slide-out-handle') {
                
                // open/close panel on Enter
                if (evt.which === 13) {
                    erTSO.options.panelVisible = !erTSO.options.panelVisible;
                    erTSO.refresh();
                }

                // drag with shift-arrowKey
                if (evt.shiftKey) {
                    switch(evt.which) {
                        case 37: { // arrow left
                            if (erTSO.dragAxis === 'x') {
                                evt.preventDefault(); // prevent default action for keys
                                let nextPosXHandle = parseFloat(erTSO.handle.css('left')) - 2;
                                if (nextPosXHandle < 0) {
                                    let nextPosXPanel = parseFloat(erTSO.panel.css('left')) - 2;
                                    if (nextPosXPanel >= 0) {
                                        erTSO.panel.css('left', (nextPosXPanel) + 'px');
                                    }
                                } else {
                                    erTSO.handle.css('left', (nextPosXHandle) + 'px');
                                }
                            }
                            break;
                        }
                        case 38: { // arrow up
                            if (erTSO.dragAxis === 'y') {
                                evt.preventDefault();
                                let nextPosYHandle = parseFloat(erTSO.handle.css('top')) - 2;
                                if (nextPosYHandle < 0) {
                                    let nextPosYPanel = parseFloat(erTSO.panel.css('top')) - 2;
                                    if (nextPosYPanel >= 0) {
                                        erTSO.panel.css('top', (nextPosYPanel) + 'px');
                                    }
                                } else {
                                    erTSO.handle.css('top', (nextPosYHandle) + 'px');
                                }
                            }
                            break;
                        }
                        case 39: { // arrow right
                            if (erTSO.dragAxis === 'x') {
                                evt.preventDefault();
                                let handleLeftMax = erTSO.panel.outerWidth() - erTSO.handle.outerWidth();
                                let nextPosXHandle = parseFloat(erTSO.handle.css('left')) + 2;
                                if (nextPosXHandle > handleLeftMax) {
                                    let panelLeftMax = document.documentElement.clientWidth - erTSO.panel.outerWidth();
                                    let nextPosXPanel = parseFloat(erTSO.panel.css('left')) + 2;
                                    if (nextPosXPanel <= panelLeftMax) {
                                        erTSO.panel.css('left', (nextPosXPanel) + 'px');
                                    }
                                } else {
                                    erTSO.handle.css('left', (nextPosXHandle) + 'px');
                                }
                            }
                            break;
                        }
                        case 40: { // arrow down
                            if (erTSO.dragAxis === 'y') {
                                evt.preventDefault();
                                let handleTopMax = erTSO.panel.outerHeight() - erTSO.handle.outerHeight();
                                let nextPosYHandle = parseFloat(erTSO.handle.css('top')) + 2;
                                if (nextPosYHandle > handleTopMax) {
                                    let panelTopMax = window.innerHeight - erTSO.panel.outerHeight();
                                    let nextPosYPanel = parseFloat(erTSO.panel.css('top')) + 2;
                                    if (nextPosYPanel < panelTopMax) {
                                        erTSO.panel.css('top', (nextPosYPanel) + 'px');
                                    }
                                } else {
                                    erTSO.handle.css('top', (nextPosYHandle) + 'px');
                                }
                            }
                            break;
                        }
                    }
                }
            }
        });
    },

    _setTransitions: function() {
        if (this.options.tabPositioning === 'left' || this.options.tabPositioning === 'right') {
            this.panel.css({'-webkit-transition' : 'left 0.5s, top 0s', '-moz-transition' : 'left 0.5s, top 0s',
            '-o-transition' : 'left 0.5s, top 0s', 'transition' : 'left 0.5s, top 0s'});
        } else {
            this.panel.css({'-webkit-transition' : 'left 0s, top 0.5s', '-moz-transition' : 'left 0s, top 0.5s',
            '-o-transition' : 'left 0s, top 0.5s', 'transition' : 'left 0s, top 0.5s'});
        }
    },

    _adaptToWindowSize: function() {
        if (this.dragAxis === 'x') {
            if (this.panel.position().left + this.panel.outerWidth() > document.documentElement.clientWidth) {
                let newPosLeft = document.documentElement.clientWidth - this.panel.outerWidth();
                if (newPosLeft >= 0) {
                    this.panel.css({'left' : newPosLeft + 'px'});
                } else {
                    this.panel.css({'left' : '0px'});
                }
            }
            if (this.handle.position().left > document.documentElement.clientWidth - this.handle.outerWidth()) {
                this.handle.css({'left' : (document.documentElement.clientWidth - this.handle.outerWidth()) + 'px'});
            }
        } else {
            if (this.panel.position().top + this.panel.outerHeight() > window.innerHeight) {
                let newPosTop = window.innerHeight - this.panel.outerHeight();
                if (newPosTop >= 0) {
                    this.panel.css({'top' : newPosTop + 'px'});
                } else {
                    this.panel.css({'top' : '0px'});
                }
            }
            if (this.handle.position().top > window.innerHeight - this.handle.outerHeight()) {
                if (window.innerHeight - this.handle.outerHeight() > 0) {
                    this.handle.css({'top' : (window.innerHeight - this.handle.outerHeight()) + 'px'});
                } else {
                    this.handle.css({'top' : '0px'});
                }
            }            
        }
        $('.er-tab-slide-out-grid-horizontal').css({'flex-wrap' : 'wrap'});
    },

    _setOption: function(key, value) {
        this._super(key, value);
        if (key === "tabPositioning") {
            if (value === "top" || value === "bottom") {
                $('#er-tab-slide-out-grid-container').addClass('er-tab-slide-out-grid-horizontal');
                this.dragAxis = x;
            } else {
                this.dragAxis = y;
            }
            this.refresh();
            this._setTransitions();
        } else if(key === "panelVisible") {
            this.refresh();
        }
    },

    refresh: function() {
        if (this.options.tabPositioning === 'right') {
            this.handle.css({'left' : '-' + (this.handle.outerWidth() + 1) + 'px'});
            if (this.options.panelVisible) {
                this.panel.css({'left' : document.documentElement.clientWidth - this.panel.outerWidth() + 'px'});
            } else {
                this.panel.css({'left' : document.documentElement.clientWidth + 'px'});
            }
        } else if (this.options.tabPositioning === 'top') {
            this.handle.css({'top' : (this.panel.outerHeight() - 1) + 'px'});
            if (this.options.panelVisible) {
                this.panel.css({'top' : '0px'});
            } else {
                this.panel.css({'top' : '-' + this.panel.outerHeight() + 'px'});
            }
        } else if (this.options.tabPositioning === 'bottom') {
            this.handle.css({'top' : '-' + (this.handle.outerHeight() + 1) + 'px'});
            if (this.options.panelVisible) {
                this.panel.css({'top' : window.innerHeight-this.panel.outerHeight() + 'px'});
             } else {
                this.panel.css({'top' : window.innerHeight + 'px'});
            }
        } else if (this.options.tabPositioning === 'left') {
            this.handle.css({'left' : (this.panel.outerWidth() - 1) + 'px'});
            if (this.options.panelVisible) {
                this.panel.css({'left' : '0px'});
            } else {
                this.panel.css({'left' : '-' + this.panel.outerWidth() + 'px'});
            }
        }
    }
});

console.log('do not delete this comment - workaround to make injected code work properly in firefox'); // injecting the code in firefox will not work, if script returns nothing