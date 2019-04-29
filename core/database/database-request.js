class DatabaseRequest{
    constructor(tableName){

        this.selectors = [];
        this.conditions = [];
        this.orders = [];
        this.op = operation.SELECT;
        this.tableName = tableName;
    }


    select(selectors){



        return this;
    }



    insert(object){

        this.op = operation.INSERT;
        this.object = object;
        return this;
    }

    update(object){
        this.op = operation.UPDATE;
        this.object = object;
        return this;
    }

    delete(){
        this.op = operation.DELETE;
        return this;
    }

    where(identifier,compertator, value){

        if(typeof identifier !== 'undefined' && typeof compertator !== 'undefined'&& typeof value !== 'undefined'){
            this.conditions.push([identifier,compertator,value]);
        }else{
            if(Array.isArray(identifier)){
                this.conditions = identifier;
            }else{
                throw Error("Invalid where clause!");
            }

        }
        return this;
    }

    orderBy(columnName,direction){

        if(direction !== 'ASC' && direction != 'DESC'){
            throw Error("direction must be asc or desc");
        }

        this.orders.push({
            columnName: columnName,
            direction:direction
        });

        return this;


    }
}


module.exports  = DatabaseRequest;

let operation  ={
    INSERT:"INSERT",
    UPDATE:"UPDATE",
    DELETE:"DELETE",
    SELECT:"SELECT",
};