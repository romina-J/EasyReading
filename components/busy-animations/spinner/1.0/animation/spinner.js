class SpinnerBusyAnimation extends BusyAnimation{

    constructor(configuration){
        super(configuration);

        this.numberOfBusyRequests = 0;

        $("body").append('<div id="er-busy-animation" style="display: none" class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        $(document).on('mousemove', function(e){
            $('#er-busy-animation').css({
                left:  e.pageX-30,
                top:   e.pageY+20
            });
        });
        console.log(configuration);
    }


    startAnimation(textnodes){
        this.numberOfBusyRequests++;
        if(this.numberOfBusyRequests === 1){
            $('#er-busy-animation').show();
        }
    }

    stopAnimation(){
        this.numberOfBusyRequests--;
        if(this.numberOfBusyRequests === 0){
            $('#er-busy-animation').hide();
        }
    }
}
