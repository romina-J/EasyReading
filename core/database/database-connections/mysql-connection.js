let DatabaseConnectionBase =  require("./database-connection-base");

class MysqlConnection extends DatabaseConnectionBase{
    constructor(){
        super();
    }


    async init(configuration){
        return new Promise(function (resolve,reject) {


            let mysql = require('mysql');
            connection = mysql.createConnection({
                host: configuration.host,
                port: configuration.port,
                user: configuration.user,
                password: configuration.password,
                database: configuration.database
            });

            connection.connect(function (err) {
                if (err){
                    reject(err);
                }else{

                    console.log("connected");
                    resolve();
                }

            });

        });


    }


    createInsertSQL(request){

        let sql = "INSERT INTO "+request.tableName+" (";

        for(let i=0; i < request.columnValues.length; i++){
            sql+=request.columnValues[i].column;
            if(i < request.columnValues.length-1){
                sql+=",";
            }

        }

        sql+=")VALUES(";

        for(let i=0; i < request.columnValues.length; i++){
            sql+=this.getFormattedValue(request.columnValues[i]);
            if(i < request.columnValues.length-1){
                sql+=",";
            }
        }
        sql+=");";

        return sql;

    }

    createUpdateSQL(request){

        let sql = "UPDATE "+request.tableName+" SET ";

        for(let i=0; i < request.columnValues.length; i++){
            if(request.columnValues[i].column !== "id") {
                sql+=request.columnValues[i].column+" = "+this.getFormattedValue(request.columnValues[i]);
                sql+=", ";
            }


        }
        if(request.columnValues.length > 0 ){
            sql = sql.substring(0, sql.length-2);
        }
        if(request.conditions.length > 0){
            sql+=" WHERE ";
            for(let i = 0; i < request.conditions.length; i++){

                if(typeof request.conditions[i][2] === "string"){

                    sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" '"+request.conditions[i][2]+"'";
                }else{

                    sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" "+request.conditions[i][2];

                }

                if(i < request.conditions.length-1){
                    sql+=" AND ";
                }
            }
        }else{
            throw Error("UPDATE without creating a where clause or providing row id");

        }

        return sql;

    }

    createSelectSQL(request){

        let selector = "*";
        if(request.selectors.length !== 0){

            //TODO

        }

        let sql = "SELECT "+selector+" FROM "+request.tableName;

        if(request.conditions.length > 0){
            sql+=" WHERE ";
        }

        for(let i = 0; i < request.conditions.length; i++){

            if(typeof request.conditions[i][2] === "string"){

                sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" '"+request.conditions[i][2]+"'";
            }else{

                sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" "+request.conditions[i][2];

            }

            if(i < request.conditions.length-1){
                sql+=" AND ";
            }
        }

        if(request.orders.length > 0){
            sql+=" ORDER BY ";
        }

        for(let i=0; i < request.orders.length; i++){

            sql+=request.orders[i].columnName+" "+request.orders[i].direction;
            if(i < request.orders.length-1){
                sql+=", ";
            }

        }

        return sql;
    }

    createDeleteSQL(request){


        let sql = "DELETE FROM "+request.tableName;

        if(request.conditions.length > 0){
            sql+=" WHERE ";
        }

        for(let i = 0; i < request.conditions.length; i++){

            if(typeof request.conditions[i][2] === "string"){

                sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" '"+request.conditions[i][2]+"'";
            }else{

                sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" "+request.conditions[i][2];

            }

            if(i < request.conditions.length-1){
                sql+=" AND ";
            }
        }


        return sql;
    }

    insert(tableName,fields,values){

        let sql = "INSERT INTO "+tableName+" (";
        for(let i = 0; i <fields.size; i++){
            sql+=fields[i];
            if(i < fields.size-1){
                sql+=",";
            }
        }

        sql+=")VALUES(";

        for(let i=0; i < values.size; i++){
            sql+="'"+values[i]+"'";
            if(i < values.size-1){
                sql+=",";
            }
        }
        sql+=");";

        return this.executeSQL(sql);

    }


    async executeSQL(sql, parameters){
        //console.log("Executing:"+sql);
        //console.log("parameters:"+JSON.stringify(parameters));

        return new Promise(function (resolve,reject) {
            connection.query(sql, parameters, function (err, result) {
                if (err) {
                    console.log("Error: " + err);
                    reject(err);
                } else {
                    //console.log("Result: " + result);

                    resolve(
                        {result:result,
                            id:result.insertId,
                    });
                }
            });
        });

    }




    getTableDescription(tableName,columnDescription,uniqueKeys){

        let description = "CREATE TABLE IF NOT EXISTS "+tableName+" (";
        description+="id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY";
    //    description+="user_id INT NOT NULL";
        for(let i=0; i < columnDescription.length; i++){
            description+=","+columnDescription[i];
        }

        if (uniqueKeys !== undefined && uniqueKeys.length > 0) {
            for(let uniqueKey of uniqueKeys) {
                description+=","+ "UNIQUE KEY("+uniqueKey.join(",")+") "
            }
        }        
        description+=")";

        return description;


    }


    getColumnDescriptionForString(fieldname,specification){


        //Special cases of string
        if(typeof specification.format !== "undefined"){

            switch(specification.format){
                case "date-time":{
                    return fieldname+" DATETIME"+getDefaultValueOfSpecification(specification);
                }
                case "color":
                case "email": {
                    return fieldname+" VARCHAR (255)"+getDefaultValueOfSpecification(specification);
                }
                case "hostname" :
                case "ipv4":
                case "ipv6":
                case "uri":{
                   // TEXT/BLOB CANNOT HAVE A DEFAULT VALUE
                    return fieldname+" TEXT"; //+getDefaultValueOfSpecification(specification);
                }
                default:
                    throw "Format not supported:"+specification.format;

            }

        }else{

            if(typeof specification.maxLength !== "undefined"){
                return fieldname+" VARCHAR("+specification.maxLength+")"+getDefaultValueOfSpecification(specification);
            }

            // TEXT/BLOB CANNOT HAVE A DEFAULT VALUE
            return fieldname+" TEXT"; //+getDefaultValueOfSpecification(specification);

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


    getFormattedValue(columnValue){
        switch(columnValue.type){
            case "boolean":{
                return columnValue.value;
            }
            case "number" : {
                return columnValue.value;
            }

            case "integer" : {
                return columnValue.value;
            }

            case "string" : {
                return "'"+columnValue.value+"'";
            }

            default : {
                return columnValue.value;
            }
        }
    }


}

let connection = null;

function getDefaultValueOfSpecification(specification) {
    if(typeof specification.default !== "undefined"){
        return ' DEFAULT "'+specification.default+'"';
    }
    return "";
}

module.exports = MysqlConnection;