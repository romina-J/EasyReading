let feedbackForm = {

    dialogVisible: false,
    visiblePage: 1,
    showFeedbackForm: function() {

        feedbackForm.killFeedbackForm();

        let langStrings = feedbackForm.i18n.de;
        if (easyReading.uiCollection.lang === "en") {
            langStrings = feedbackForm.i18n.en;
        } else if (easyReading.uiCollection.lang === "sv") {
            langStrings = feedbackForm.i18n.sv;
        } if (easyReading.uiCollection.lang === "es") {
            langStrings = feedbackForm.i18n.es;
        }
        let formHTML =  '<div class="modal micromodal-slide" id="er-feedback" aria-hidden="true">\n' +
            '    <div class="modal__overlay" tabindex="-1" data-micromodal-close>\n' +
            '        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="er-feedback-title">\n' +
            '            <header class="modal__header">\n' +
            '                <h2 class="modal__title" id="er-feedback-title">\n' +
            '                    ' + langStrings.heading + '\n' + 
            '                    <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/logo_w.png" alt="' + langStrings.alt_logo + '" title="' + langStrings.alt_logo + '" id="er-feedback-logo"">' + 
            '                </h2>\n' +
            '                <button id="erFeedbackCancel" class="modal__close" aria-label="' + langStrings.closeBtn_ariaLabel + '" data-micromodal-close></button>'+
            '            </header>\n' +
            '            <main class="modal__content" id="er-feedback-content">\n' +
            '                <div class="erFeedback erFeedback_page1">' + langStrings.hello + '</div>\n' +             
            '                <fieldset class="erFeedback erFeedback_page2">\n' + 
            '                <legend id="legend_q1">' + langStrings.q1_legend + '</legend>\n' +
            '                    <div>\n' +
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/logo_w.png" alt="">' +
            '                        <label id="q1_1_label" class="erRadioLabel" for="q1_1">' + langStrings.q1_1 + '</label>\n' +
            '                        <input type="radio" name="triedER" id="q1_1" value="1">\n' +
            '                    </div>\n' + 
            '                    <div>\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/logo_w.png" alt="">' +            
            '                        <label id="q1_2_label" class="erRadioLabel" for="q1_2">' + langStrings.q1_2 + '</label>\n' +
            '                        <input type="radio" name="triedER" id="q1_2" value="2">\n' +
            '                    </div>\n' + 
            '                    <div>\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/woman_page1.png" alt="">' +            
            '                        <label id="q1_3_label" class="erRadioLabel" for="q1_3">' + langStrings.q1_3 + '</label>\n' +
            '                        <input type="radio" name="triedER" id="q1_3" value="3">\n' +
            '                    </div>\n' + 
            '                    <div>\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/guy_page1.png" alt="">' +            
            '                        <label id="q1_4_label" class="erRadioLabel" for="q1_4">' + langStrings.q1_4 + '</label>\n' +
            '                        <input type="radio" name="triedER" id="q1_4" value="4">\n' +
            '                    </div>\n' +                                     
            '                </fieldset>\n' +
            '                <fieldset class="erFeedback erFeedback_page3">\n' + 
            '                <legend><strong>' + langStrings.q2_legend_1 + '</strong>' + langStrings.q2_legend_2 + '</legend>\n' +
            '                    <div class="radioDiv">\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_like_594444.png" alt="">' +            
            '                        <label for="q2_1">' + langStrings.q2_1 + '</label>\n' +
            '                        <input type="radio" name="likeER" id="q2_1" value="1">\n' +
            '                    </div>\n' + 
            '                    <div class="radioDiv">\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_speechless_594443(1).png" alt="">' +            
            '                        <label for="q2_2">' + langStrings.q2_2 + '</label>\n' +
            '                        <input type="radio" name="likeER" id="q2_2" value="2">\n' +
            '                    </div>\n' + 
            '                    <div class="radioDiv">\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_Dislike_594447(1).png" alt="">' +            
            '                        <label for="q2_3">' + langStrings.q2_3 + '</label>\n' +
            '                        <input type="radio" name="likeER" id="q2_3" value="3">\n' +
            '                    </div>\n' + 
            '                    <div class="radioDiv">\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_Question_70964.png" alt="">' +            
            '                        <label for="q2_4">' + langStrings.q2_4 + '</label>\n' +
            '                        <input type="radio" name="likeER" id="q2_4" value="4">\n' +
            '                    </div>\n' +                                     
            '                </fieldset>\n' +
            '                <fieldset class="erFeedback erFeedback_page4">\n' + 
            '                <legend><strong>' + langStrings.q3_legend_1 + '</strong>' + langStrings.q3_legend_2 + '</legend>\n' +
            '                    <div class="radioDiv">\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_like_594444.png" alt="">' +             
            '                        <label for="q3_1">' + langStrings.q3_1 + '</label>\n' +
            '                        <input type="radio" name="usageER" id="q3_1" value="1">\n' +
            '                    </div>\n' + 
            '                    <div class="radioDiv">\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_speechless_594443(1).png" alt="">' +            
            '                        <label for="q3_2">' + langStrings.q3_2 + '</label>\n' +
            '                        <input type="radio" name="usageER" id="q3_2" value="2">\n' +
            '                    </div>\n' + 
            '                    <div class="radioDiv">\n' + 
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_Dislike_594447(1).png" alt="">' +            
            '                        <label for="q3_3">' + langStrings.q3_3 + '</label>\n' +
            '                        <input type="radio" name="usageER" id="q3_3" value="3">\n' +
            '                    </div>\n' + 
            '                    <div class="radioDiv">\n' +
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_Question_70964.png" alt="">' +            
            '                        <label for="q3_4">' + langStrings.q3_4 + '</label>\n' +
            '                        <input type="radio" name="usageER" id="q3_4" value="4">\n' +
            '                    </div>\n' +
            '                    <div class="addDiv">\n' +
            '                        <label for="q3_add">' + langStrings.q3_add + '</label>\n' +
            '                        <div>' +
            '                            <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_Pencil_2486149.png" alt="">' +            
            '                            <textarea id="q3_add" rows="3" columns="50"></textarea>\n' + 
            '                        </div>' +       
            '                    </div>\n' +            
            '                </fieldset>\n' +
            '                <fieldset class="erFeedback erFeedback_page5">\n' + 
            '                <legend><strong>' + langStrings.q4_legend_1 + '</strong>' + langStrings.q4_legend_2 + '</legend>\n' +
            '                    <div class="radioDiv">\n' +
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_like_594444.png" alt="">' +             
            '                        <label for="q4_1">' + langStrings.q4_1 + '</label>\n' +
            '                        <input type="radio" name="helpedER" id="q4_1" value="1">\n' +
            '                    </div>\n' + 
            '                    <div class="radioDiv">\n' +
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_Dislike_594447(1).png" alt="">' +            
            '                        <label for="q4_2">' + langStrings.q4_2 + '</label>\n' +
            '                        <input type="radio" name="helpedER" id="q4_2" value="2">\n' +
            '                    </div>\n' + 
            '                    <div class="radioDiv">\n' +
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_Question_70964.png" alt="">' +            
            '                        <label for="q4_3">' + langStrings.q4_3 + '</label>\n' +
            '                        <input type="radio" name="helpedER" id="q4_3" value="3">\n' +
            '                    </div>\n' +
            '                    <div class="addDiv">\n' +
            '                        <label for="q4_add">' + langStrings.q4_add + '</label>\n' +
            '                        <div>' +            
            '                            <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_Pencil_2486149.png" alt="">' +            
            '                            <textarea id="q4_add" rows="3" columns="50"></textarea>\n' + 
            '                        </div>' +                   
            '                    </div>\n' +            
            '                </fieldset>\n' +        
            '                <div class="erFeedback erFeedback_page6">\n' +
            '                    <label for="q5"><strong>' + langStrings.q5_1 + '</strong>' + langStrings.q5_2 + '</label>\n' +
            '                    <div>' +
            '                        <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/noun_Pencil_2486149.png" alt="">' +            
            '                        <textarea id="q5" rows="3" columns="50"></textarea>\n' +
            '                    </div>' +                    
            '                </div>\n' +
            '                <div class="erFeedback erFeedback_page7">' + langStrings.thx + '</div>\n' +             
            '            </main>\n' +
            '            <footer class="modal__footer">\n' +
            '                <img src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/EU_logo.png" alt="' + langStrings.alt_EU + '" title="' + langStrings.alt_EU + '">' +            
            '                <div id="erH2020Note">' + langStrings.H2020 + '</div>' +
            '                <input type="image" id="erBackBtn" alt="' + langStrings.alt_back + '" src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/arrow_left.png">' +
            '                <input type="image" id="erForwardBtn" alt="' + langStrings.alt_fwd + '" src="' + easyReading.uiCollection.serverURL + '/images/feedbackForm/arrow_right.png">' +
            '            </footer>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';

        $("body").append(formHTML);

        feedbackForm.adjustPageVisibility();

        MicroModal.show('er-feedback');

        feedbackForm.dialogVisible = true;

        $("#erForwardBtn").click(function() {
            if (feedbackForm.visiblePage === 6) {
                let formData =  '{';
                if ($('input[name=triedER]:checked').val() != undefined) {
                    formData += '"q1" : ' + $('input[name=triedER]:checked').val() + ',';
                } else {
                    formData += '"q1" : 0,';
                }
                if ($('input[name=likeER]:checked').val() != undefined) {
                    formData += '"q2" : ' + $('input[name=likeER]:checked').val() + ',';
                } else {
                    formData += '"q2" : 0,';
                }
                formData += '"q3" : {';
                if ($('input[name=usageER]:checked').val() != undefined) {
                    formData += '"q3_main" : ' + $('input[name=usageER]:checked').val() + ',';
                } else {
                    formData += '"q3_main" : 0,';
                } 
                formData += '"q3_add" : "' + $('#q3_add').val() + '"},';
                formData += '"q4" : {';
                if ($('input[name=helpedER]:checked').val() != undefined) {
                    formData += '"q4_main" : ' + $('input[name=helpedER]:checked').val() + ',';
                } else {
                    formData += '"q4_main" : 0,';
                } 
                formData += '"q4_add" : "' + $('#q4_add').val() + '"},';
                formData += '"q5" : "' + $('#q5').val().replace(/(\r\n|\n|\r)/gm, "") + '"}';
                //console.log($.parseJSON(formData));
                contentScriptController.sendMessageToBackgroundScript({
                    type: "surveyResult",
                    data: formData,
                });
            }
            feedbackForm.visiblePage++;
            feedbackForm.adjustPageVisibility();
        });

        $("#erBackBtn").click(function() {
            feedbackForm.visiblePage--;
            feedbackForm.adjustPageVisibility();
        });

        $("#erFeedbackCancel").click(function () {
            feedbackForm.killFeedbackForm();
        });

    },

    killFeedbackForm: function () {
        if(feedbackForm.dialogVisible){
            MicroModal.close('er-feedback');
            $("#er-feedback").remove();
            feedbackForm.dialogVisible = false;
            feedbackForm.visiblePage = 1;
        }
    },

    adjustPageVisibility: function() {
        if (feedbackForm.visiblePage === 1) {
            $('#erBackBtn').prop('disabled', true);
        } else if (feedbackForm.visiblePage === 7) {
            $("#erBackBtn").remove();
            $("#erForwardBtn").remove();
        } else {
            $('#erBackBtn').prop('disabled', false);
        }
        $(".erFeedback").css("display", "none");
        $(".erFeedback_page" + feedbackForm.visiblePage).css("display", "block");
    },

    i18n: {
        de: {
            heading: "R&uuml;ckmelde-Bogen Easy Reading",
            alt_logo: "Logo Easy Reading",
            closeBtn_ariaLabel: "Fenster schlie&szlig;en",
            hello: "Hallo,<br>k&ouml;nnen sie uns ein paar Fragen beantworten?",
            q1_legend: "Hallo, Sie haben Easy Reading ausprobiert.",
            q1_1: "Ich habe Easy Reading das 1. Mal benutzt.",
            q1_2: "Ich habe Easy Reading schon &ouml;fter benutzt.",
            q1_3: "Ich bin eine Benutzerin oder ein Benutzer.",
            q1_4: "Ich bin eine Unterst&uuml;tzerin oder Unterst&uuml;tzer,<br>und dies ist meine eigene R&uuml;ckmeldung.",
            q2_legend_1: "Frage 1<br>",
            q2_legend_2: "Gef&auml;llt Ihnen Easy Reading?",
            q2_1: "ja",
            q2_2: "teilweise",
            q2_3: "nein",
            q2_4: "wei&szlig; nicht",
            q3_legend_1: "Frage 2<br>",
            q3_legend_2: "Ist Easy Reading einfach zu bedienen?",
            q3_1: "ja",
            q3_2: "teilweise",
            q3_3: "nein",
            q3_4: "wei&szlig; nicht",
            q3_add: "Wenn nein,<br>was ist schwierig an den Easy Reading Hilfen?",
            q4_legend_1: "Frage 3<br>",
            q4_legend_2: "Hat Ihnen Easy Reading im Internet geholfen?",
            q4_1: "ja",
            q4_2: "nein",
            q4_3: "wei&szlig; nicht",
            q4_add: "Wenn nein,<br>was hat gefehlt?", 
            q5_1: "Frage 4<br>",
            q5_2: "Wie  kann man Easy Reading noch besser machen?",
            thx: "Danke f&uuml;r Ihre Mitarbeit",
            alt_EU: "Logo Europ&auml;ische Union",
            H2020: "Dieses Projekt hat unter Vertragsnummer 780529 F&ouml;rdergelder aus dem Horizon 2020 Programm der Europ&auml;ischen Union erhalten",
            alt_back: "zur&uuml;ck",
            alt_fwd: "weiter"
        },
        en: {
            heading: "Feedback Sheet Easy Reading",
            alt_logo: "Logo Easy Reading",
            closeBtn_ariaLabel: "Close",
            hello: "Hello,<br>can you answer a few questions?",
            q1_legend: "Hello,<br>you have tried Easy Reading?",
            q1_1: "I used Easy Reading for the first time.",
            q1_2: "I have used Easy Reading before.",
            q1_3: "I am a User.",
            q1_4: "I am a supporter and this is my own review.",
            q2_legend_1: "Question 1<br>",
            q2_legend_2: "Do you like Easy Reading?",
            q2_1: "yes",
            q2_2: "partly",
            q2_3: "no",
            q2_4: "I don't know",
            q3_legend_1: "Question 2<br>",
            q3_legend_2: "Is Easy Reading easy to use?",
            q3_1: "yes",
            q3_2: "partly",
            q3_3: "no",
            q3_4: "I don't know",
            q3_add: "If no,<br>what is difficult about the Easy Reading aids?",
            q4_legend_1: "Question 3<br>",
            q4_legend_2: "Did Easy Reading help you?",
            q4_1: "yes",
            q4_2: "no",
            q4_3: "I don't know",
            q4_add: "If no,<br>what did you miss", 
            q5_1: "Question 4<br>",
            q5_2: "What can be improved with Easy Reading?",
            thx: "Thank you for your cooperation",
            alt_EU: "Logo European Union",
            H2020: "This project has received funding from the European Union's Horizon 2020 research and innovation programme under grant agreement No.780529",
            alt_back: "back",
            alt_fwd: "forward"
        },
        sv: {
            heading: "Utv&auml;rdering av Easy Reading",
            alt_logo: "Logga Easy Reading",
            closeBtn_ariaLabel: "st&auml;nga",
            hello: "Hej, vill du svara p&aring; ett par fr&aring;gor?", 
            q1_legend: "Hej, har du provat Easy Reading?",
            q1_1: "Det &auml;r f&ouml;rsta g&aring;ngen jag anv&auml;nder Easy Reading",
            q1_2: "Jag har anv&auml;nt Easy Reading f&ouml;rut",
            q1_3: "Jag &auml;r anv&auml;ndare",
            q1_4: "Jag &auml;r st&ouml;dperson och svarar f&ouml;r mig sj&auml;lv",
            q2_legend_1: "Fr&aring;ga 1",
            q2_legend_2: "Tycker du om Easy Reading?",
            q2_1: "ja",
            q2_2: "delvis",
            q2_3: "nej",
            q2_4: "jag vet inte",
            q3_legend_1: "Fr&aring;ga 2<br>",
            q3_legend_2: "&Auml;r Easy Reading enkelt att anv&auml;nda?",
            q3_1: "ja",
            q3_2: "delvis",
            q3_3: "nej",
            q3_4: "jag vet inte", 
            q3_add: "Om du svarade nej,<br>vad &auml;r sv&aring;rt n&auml;r du anv&auml;nder Easy Reading?",
            q4_legend_1: "Fr&aring;ga 3<br>",
            q4_legend_2: "Hj&auml;lpte Easy Reading dig?",
            q4_1: "ja",
            q4_2: "nej",
            q4_3: "jag vet inte",
            q4_add: "Om du svarade nej,<br>vad hade du velat ha f&ouml;r hj&auml;lp?", 
            q5_1: "Fr&aring;ga 4<br>",
            q5_2: "Hur kan Easy Reading bli b&auml;ttre?",
            thx: "Tack f&ouml;r din medverkan!",
            alt_EU: "Logga Europeiska unionen",
            H2020: "Det h&auml;r projektet har f&aring;tt finansiering fr&aring;n Horisont 2020, Europeiska Unionens ramprogram f&ouml;r forskning och innovation, avtal nr 780529",
            alt_back: "tillbaka",
            alt_fwd: "forts&auml;tta"
        },
        es: {
            // TODO: someone translate to Spanish
            heading: "Feedback Sheet Easy Reading",
            alt_logo: "Logo Easy Reading",
            closeBtn_ariaLabel: "Close",
            hello: "Hello,<br>can you answer a few questions?",
            q1_legend: "Hello,<br>you have tried Easy Reading?",
            q1_1: "I used Easy Reading for the first time.",
            q1_2: "I have used Easy Reading before.",
            q1_3: "I am a User.",
            q1_4: "I am a supporter and this is my own review.",
            q2_legend_1: "Question 1<br>",
            q2_legend_2: "Do you like Easy Reading?",
            q2_1: "yes",
            q2_2: "partly",
            q2_3: "no",
            q2_4: "I don't know",
            q3_legend_1: "Question 2<br>",
            q3_legend_2: "Is Easy Reading easy to use?",
            q3_1: "yes",
            q3_2: "partly",
            q3_3: "no",
            q3_4: "I don't know",
            q3_add: "If no,<br>what is difficult about the Easy Reading aids?",
            q4_legend_1: "Question 3<br>",
            q4_legend_2: "Did Easy Reading help you?",
            q4_1: "yes",
            q4_2: "no",
            q4_3: "I don't know",
            q4_add: "If no,<br>what did you miss", 
            q5_1: "Question 4<br>",
            q5_2: "What can be improved with Easy Reading?",
            thx: "Thank you for your cooperation",
            alt_EU: "Logo European Union",
            H2020: "This project has received funding from the European Union's Horizon 2020 research and innovation programme under grant agreement No.780529",
            alt_back: "back",
            alt_fwd: "forward"
        }        
    }

};