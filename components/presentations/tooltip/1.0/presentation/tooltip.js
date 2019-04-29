class Tooltip extends Presentation{
    constructor(functionInfo, userInterface,configuration){

        super(functionInfo, userInterface,configuration);

        this.requestCounter = 0;

    }

    renderResult(request,result){
        let ioRes = ioTypeUtils.toIOTypeInstance(result.result);
        let resultHTML = ioRes.toHtml();
        if (ioRes instanceof Word) {
            for(let i=0; i < request.input.textNodes.length;i++){
                if($(request.input.textNodes[i]).parent().hasClass("easy-reading-result")){
                    if($(request.input.textNodes[i]).next().hasClass("easy-reading-result")){
                        $(request.input.textNodes[i]).next().remove();
                    }
                    $(request.input.textNodes[i]).unwrap();
                }
            }
            pageUtils.wrapWordIn(request.input, "span","easy-reading-result easy-reading-tooltip easy-reading-tooltip-"+this.requestCounter);
            $( ".easy-reading-tooltip-"+this.requestCounter ).append("<span class='easy-reading-tooltip-text easy-reading-result'>"+resultHTML+"</span>");
            this.requestCounter++;
        } else if (ioRes instanceof Paragraph) {
            $( request.input.element).wrap( "<div class='easy-reading-result easy-reading-tooltip easy-reading-tooltip-"+this.requestCounter+"'></div>" );
            $( ".easy-reading-tooltip-"+this.requestCounter ).append("<span class='easy-reading-tooltip-text easy-reading-result'>"+resultHTML+"</span>");
            this.requestCounter++;
        }
    }

    undo(){

    }
}