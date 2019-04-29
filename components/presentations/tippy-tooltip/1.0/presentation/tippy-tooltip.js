class TippyTooltip extends Presentation{
    constructor(functionInfo, userInterface,configuration){
        super(functionInfo, userInterface,configuration);

        this.requestCounter = 0;

    }

    renderResult(request,result){
        if(request.input.type === Word.className){

            for(let i=0; i < request.input.textNodes.length;i++) {
                if($(request.input.textNodes[i]).parent().hasClass("easy-reading-result")){

                    if($(request.input.textNodes[i]).next().hasClass("easy-reading-result")){
                        $(request.input.textNodes[i]).next().remove();
                    }
                    $(request.input.textNodes[i]).unwrap();
                }
            }

            let className = "easy-reading-tippy-tooltip-"+this.requestCounter;
            pageUtils.wrapWordIn(request.input, "span","easy-reading-result easy-reading-tippy-tooltip "+className);
            if(result.result.name === ImageIOType.className){

                if(result.result.url){
                    const INITIAL_CONTENT = 'Loading...';

                    const state = {
                        isFetching: false,
                        canFetch: true
                    };

                    tippy("."+className,{
                        content: INITIAL_CONTENT,
                        async onShow(tip) {
                            if (state.isFetching || !state.canFetch) return;

                            state.isFetching = true;
                            state.canFetch = false;

                            try {


                                let downloadingImage = new Image();
                                downloadingImage.onload = function(){
                                    if (tip.state.isVisible) {
                                        this.width = 100;
                                        tip.setContent(this)
                                    }
                                };
                                downloadingImage.src = result.result.url;

                            } catch (e) {
                                tip.setContent(`Fetch failed. ${e}`)
                            } finally {
                                state.isFetching = false
                            }
                        },
                        onHidden(tip) {

                        }
                    });

                }else{
                    tippy("."+className, {
                        content: "No images found",
                    });
                }

            }
            this.requestCounter++;
        }else if(request.input.type === Paragraph.className){

            let id = "easy-reading-tippy-tooltip-icon-"+this.userInterface.id+"-"+this.requestCounter;
            let tooltipID = "easy-reading-tippy-tooltip-"+this.userInterface.id+"-"+this.requestCounter;
            $( "<img id='"+id+"' src='"+this.configuration.remoteAssetDirectory+"/help-logo.png' alt='Show tooltip' style='height: 1em; width: 1em;'>" ).insertAfter($(request.input.textNodes[request.input.textNodes.length-1]));
            $( "body" ).append($( "<div id='"+tooltipID+"'>"+result.result+"</div>" ));
            tippy(document.getElementById(id), {content: document.querySelector('#'+tooltipID), size: 'large',});

            this.requestCounter++;
        }

    }

    undo(){

    }
}