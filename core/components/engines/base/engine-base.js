'use strict';

let engineFunction = require("./engine-function");
let engineContainer = require("./engine-container");

class EngineBase {
    constructor() {
        this.id = "BaseEngine";
        this.name = "BaseEngine";
        this.description = "A description of BaseEngine";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
        this.debugMode = false;
        this.functions = [];
    }

    getDataSchema(){
        return {};
    }



    getDefaultData(){
        let defaults = require('json-schema-defaults');
        return defaults(this.getDataSchema());
    }

    getFunctions(){
        return {};
    }

    getEngineIdentifier(){

        return {
            "id" : this.id,
            "version": this.version,
            "debugMode" : this.debugMode,

        }
    }

    createFunctions(engineDir){

        this.baseDir = engineDir;
        let Ajv = require('ajv');
        let ajv = new Ajv();

        let functions = this.getFunctions();


        for (let i = 0; i < functions.length; i++) {

            let bundle = null;
            if ('bundle' in functions[i]) {
                bundle = functions[i].bundle;
            }

            if(functions[i].type === engineFunction.FuntionType.REMOTE){

                let valid = ajv.validate(engineFunction.RemoteFunctionSchema, functions[i]);
                if (!valid){
                    throw {
                        name: "Exception",
                        message:ajv.errorsText(),
                        toString: function() {
                            return this.name + ": " + this.message;
                        }
                    };

                }else{

                    let remoteFunction = new engineFunction.RemoteFunction(this,functions[i].id,functions[i].name,functions[i].description,functions[i].inputTypes,functions[i].outputTypes,functions[i].defaultIcon,functions[i].entryPoint, bundle);
                    remoteFunction.validateProperties();
                    this.functions.push(remoteFunction);
                }

            }else if(functions[i].type === engineFunction.FuntionType.LOCAL){

                let valid = ajv.validate(engineFunction.LocalFunctionSchema, functions[i]);
                if (!valid){
                    console.log(ajv.errorsText());
                }else{

                    let localFunction = new engineFunction.LocalFunction(this,functions[i].id,functions[i].name,functions[i].description,functions[i].inputTypes,functions[i].outputTypes,functions[i].defaultIcon,functions[i].javaScripts,functions[i].styleSheets,functions[i].entryPoint, bundle);
                    localFunction.validateProperties();
                    this.functions.push(localFunction);
                }
            }else{

                console.log("Function with type:"+functions[i].type+" is not valid!");
            }




        }
    }

    getFunction(id){
        for(let i=0; i < this.functions.length; i++){
            if(this.functions[i].id === id){
                return this.functions[i];
            }
        }
    }

    async createConfigTable(tableName){

        let errorMsg = null;

        try{
            let schema = this.getDataSchema();
            if(Object.keys(schema).length !== 0 && schema.constructor === Object){
                let databaseManager = require("../../../database/database-manager");
                await databaseManager.createOrSyncTablesFromSchema(schema,tableName);

            }
        }catch (error){
            errorMsg = error;
        }




        return new Promise(function (resolve, reject) {
            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve();
            }
        });
    }


}

class FunctionBundle {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }
}

module.exports.FunctionBundle = FunctionBundle;
module.exports.EngineBase = EngineBase;
module.exports.EngineFunction = engineFunction;
module.exports.EngineContaner = engineContainer;
