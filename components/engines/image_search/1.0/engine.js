let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class ImageSearch extends base.EngineBase {
    constructor() {
        super();
        this.id = "ImageSearch";
        this.name = "Image Search";
        this.description = "A simple online image search";
        this.version = "1.0";
        this.versionDescription = "Initial Version";

    }


    getFunctions() {
        return [
            {
                id: "image_search",
                name: "Image Search",
                description: "Simple image search using Google Image Search",
                defaultIcon: "assets/image-search.png",
                type: base.EngineFunction.FuntionType.REMOTE,
                inputTypes: [{
                    "inputType": ioType.IOTypes.Word.className,
                    "name": "Input word",
                    "description": "Word to translate",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.ImageIOType.className,
                    "name": "Image",
                    "description": "Image word",

                }],
                entryPoint: "getImage",
            }

        ];
    }

    getDataSchema() {
        return {};
    }

    getImage(webSocketConnection, req, config) {

        let https = require('follow-redirects').https;
        let optionsget = {
            host : 'www.googleapis.com',
            path : '/customsearch/v1?key=AIzaSyB20eOh1pzH6686EvT4FvXkFzyXVLbA5tE&cx=006907531626359346862:z3verovlhta&q='+encodeURIComponent(req.input.value)+'&searchType=image&alt=json&num=10&start=1&imgType=clipart',
            method : 'GET',

        };


        let reqGet = https.request(optionsget, function(res) {

            let allData = "";
            res.on('data', function(d) {
                 if(res.statusCode === 200) {
                     allData = allData + d;

                 }

            });

            res.on('end', function () {
                try {
                    let result =  JSON.parse(unescape(allData));
                    let ioType = rootRequire("core/IOtypes/iotypes");
                    let img = new ioType.IOTypes.ImageIOType("");
                    if(result.items[0].link !== null){
                        img.url = result.items[0].link;
                        img.alt = result.items[0].title;
                        img.title = result.items[0].title;
                    }
                    req.result = img;
                    res.outputType = ioType.IOTypes.ImageIOType.className;
                    req.type = "cloudRequestResult";
                    webSocketConnection.sendMessage(req);
                }catch(error){
                    console.log("errors occured while getting images");
                }
            });
        });
        reqGet.end();
        reqGet.on('error', function(e) {
            console.error(e);
        });


    }


}


module.exports.class = ImageSearch;