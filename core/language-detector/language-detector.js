let languageDetector = {
    init: function () {
        const LanguageDetect = require('languagedetect');
        this.detector = new LanguageDetect();
        this.languageList = require('language-list')();
        this.commonLanguages = [
            "en",
            "de",
            "sv",
            "es",
            "fr",
            "it",
            "pt",
            "nb",
            "nl",
            "el",
        ]

    },


    detectLanguage:function (text,profileLanguage, lang) {


        let trimmedText = text.substring(0, 200);

        let result = this.detector.detect(text);

        if(result.length === 0){
            if(lang !== "undefined"){
                return lang;
            }
            return profileLanguage;
        }

        if(result[0][1] < 0.15){

            if(lang !== "undefined"){
                return lang;
            }

            return profileLanguage;
        }

        //Iterate through results
        for(let i=0; i < result.length;i++) {
            if ((result[i][1] < 0.17)) {
                break;
            }
            //If profile language within 17% - it is very possible that its the profiles language
            let languageCode = this.languageList.getLanguageCode(result[i][0]);

            if(languageCode === profileLanguage){
                return profileLanguage;
            }
        }

        //Iterate through results - skip languages like "pidgin"
        for(let i=0; i < result.length;i++){
            if((result[i][1] < 0.15) && lang !== "undefined"){
                return lang;
            }
            let languageCode = this.languageList.getLanguageCode(result[i][0]);
            if(languageCode){
                if(this.commonLanguages.includes(languageCode)){


                    return languageCode;
                }
            }
        }


        return profileLanguage;


    }

};


module.exports = languageDetector;