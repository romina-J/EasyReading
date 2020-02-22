var KEYCODE = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    UP: 38
}

$(document).ready(function () {

    initCheckboxes();
    initRadioGroups();

});

function initRadioGroups(){
    $(".radio-button-container").each(function () {

        let $radioButtons = $(this).find(".radio-button");
        let $radioButtonsArray = $radioButtons.toArray();

        let name = $(this).data( "name" );
        $( this).append('<input type="hidden" name="'+name+'">');



        $radioButtons.click(function (event) {



            selectRadioButton($radioButtons,$(this));
            event.preventDefault();
            event.stopPropagation();

        });


        let selectedButtonFound = false;

        for(let i=0; i < $radioButtonsArray.length; i++){
            $($radioButtonsArray[i]).attr("role","radio");
            $($radioButtonsArray[i]).attr("aria-checked","false");
            $($radioButtonsArray[i]).attr("tabindex","-1");


            if($($radioButtonsArray[i]).hasClass("checked")){

                selectRadioButton($radioButtons,$($radioButtonsArray[i]),false);
                selectedButtonFound = true;
            }


            $($radioButtonsArray[i]).keydown(function( event ) {
                if ( event.which === 13 ) {
                    event.preventDefault();
                }
                let next = null;
                switch (event.which) {
                    case KEYCODE.DOWN:
                    case KEYCODE.RIGHT:
                        if(i === $radioButtonsArray.length-1){
                            next = $radioButtonsArray[0];
                        }else{
                            next = $radioButtonsArray[i+1];
                        }
                        break;

                    case KEYCODE.UP:
                    case KEYCODE.LEFT:
                        if(i === 0){
                            next = $radioButtonsArray[$radioButtonsArray.length-1];
                        }else{
                            next = $radioButtonsArray[i-1];
                        }
                        break;

                    case KEYCODE.SPACE:
                        next =  $radioButtonsArray[i];
                        break;
                }

                if(next){
                    event.preventDefault();
                    event.stopPropagation();
                    selectRadioButton($radioButtons,$(next));

                }



            });

        }

        if(!selectedButtonFound){
            $($radioButtonsArray[0]).attr("tabindex","0");
        }



    });
}

function selectRadioButton($allButtons,$buttonToSelect,setFocus = true) {




    $allButtons.attr("aria-checked","false");
    $allButtons.attr("tabindex","-1");
    $allButtons.removeClass("checked");
    $buttonToSelect.attr("aria-checked","true");
    $buttonToSelect.addClass("checked");
    $buttonToSelect.attr("tabindex","0");
    if(setFocus){

        $buttonToSelect.focus();
    }

    let name = $buttonToSelect.closest( '.radio-button-container').data("name");

    if(typeof name !== "undefined"){
        $('input[name ="'+name+'"]').val($buttonToSelect.data("value"));
    }

}


function initCheckboxes(){

    $checkboxes =  $(".checkbox");
    $checkboxes.click(function () {
        toggleCheckbox(this);
    });


    $checkboxes.each(function () {
        let name = $(this).data( "name" );
        if ($(this).hasClass("checked")) {
            $(this).attr("aria-checked", "true");
            $(this).append('<input type="hidden" name="'+name+'" value="true">');


        }else{
            $(this).append('<input type="hidden" name="'+name+'" value="false">');
        }

        $(this).prepend('<img class="check-mark" src="/images/check-mark.png" alt="">');

    });



    $checkboxes.keydown(function (e) {
        if (e.key === "Enter" || e.key === " ") {
            toggleCheckbox(this);
        }
    });

    $checkboxes.attr("aria-checked", "false");
    $checkboxes.attr("role", "checkbox");
    $checkboxes.attr("tabindex", "0");

}


function toggleCheckbox(checkbox){
    let name = $(checkbox).data( "name" );
    if ($(checkbox).hasClass("checked")) {
        $(checkbox).removeClass("checked");
        $(checkbox).attr("aria-checked", "false");
        $('input[name ="'+name+'"]').val("false");
    }else{
        $(checkbox).addClass("checked");
        $(checkbox).attr("aria-checked", "true");
        $('input[name ="'+name+'"]').val("true");
    }


}


