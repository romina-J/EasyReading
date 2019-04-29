class DatabaseConnectionBase{
    constructor(){

    }

    async init(callback){


    }

    async executeSQL(sql, parameters){

    }


    getTableDescription(tableName,fields, uniqueKeys){

    }

    createInsertSQL(request){

    }

    createUpdateSQL(request){

    }
    createSelectSQL(request){

    }

    createDeleteSQL(request){

    }

    getColumnDescriptionForString(fieldname,specification){


        //Special cases of string
        if(typeof specification.format !== "undefined"){

            switch(specification.format){
                case "date-time":{
                    return fieldname+" DATETIME"+getDefaultValueOfSpecification(specification);
                }
                case "email": {
                    return fieldname+" VARCHAR (255)"+getDefaultValueOfSpecification(specification);
                }
                case "hostname" :
                case "ipv4":
                case "ipv6":
                case "uri":{
                    return fieldname+" TEXT"+getDefaultValueOfSpecification(specification);
                }
                default:
                    throw "Format not supported:"+specification.format;

            }

        }else{

            return fieldname+" TEXT"+getDefaultValueOfSpecification(specification);

        }
    }

    getColumnDescriptionForNumber(fieldname,specification){
        return fieldname+" FLOAT"+getDefaultValueOfSpecification(specification);
    }

    getColumnDescriptionForInteger(fieldname,specification){
          return fieldname+" INT"+getDefaultValueOfSpecification(specification);

    }

    getColumnDescriptionForBool(fieldname,specification){
        //THERE ARE NO DEFAULT VALUES FOR BOOL
        return fieldname+" BOOLEAN";
    }


    getFormattedValue(columnValues){

    }



}




let connection = null;



module.exports = DatabaseConnectionBase;