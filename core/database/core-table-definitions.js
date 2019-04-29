let Profile = {
    "$id": "https://www.easyreading.eu/schemas/Profile.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title":"profile",
    "type": "object",
    "properties": {
        "googleID": {
            "type": "string"
        },
        "email":{
            "type" : "string",
            "format" : "email"
        },
        "role":{
            "type": "integer",
            "title": "Role for this profile ",
            "default": 0,
        }
    },
    "required": [
        "email"
    ],
    "unique":[
        ["email"]
    ]
};



let UICollection = {
    "$id": "https://www.easyreading.eu/schemas/UICollection.json",
    "type": "object",
    "title":"ui_collection",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "pid": {
            "$id": "/properties/uid",
            "type": "integer",
            "title": "The pid Schema ",
            "default": 0,

        },
        "active": {
            "$id": "/properties/active",
            "type": "boolean",
            "title": "The Active Schema ",
            "default": false,

        }
    }
};

let UIConf = {
    "$id": "https://www.easyreading.eu/schemas/UIConf.json",
    "type": "object",
    "title":"ui_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "ui_id": {
            "$id": "/properties/ui_id",
            "type": "string",
            "title": "The Ui_id Schema ",

        },
        "ui_version": {
            "$id": "/properties/ui_version",
            "type": "string",
            "title": "The Ui_version Schema ",


        },
        "ui_conf_id": {
            "$id": "/properties/ui_conf_id",
            "type": "integer",
            "title": "The Ui_conf_id Schema ",

        },
        "ui_collection": {
            "$id": "/properties/ui_collection",
            "type": "integer",
            "title": "The Ui_collection Schema ",

        }
    }
};


let PluginConf = {
    "$id": "https://www.easyreading.eu/schemas/PluginConf.json",
    "type": "object",
    "title":"plugin_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "plugin_id": {
            "$id": "/properties/plugin_id",
            "type": "string",
            "title": "The Plugin_id Schema ",
        },
        "plugin_version": {
            "$id": "/properties/plugin_version",
            "type": "string",
            "title": "The Plugin_version Schema ",
        },
        "ui_collection": {
            "$id": "/properties/ui_collection",
            "type": "integer",
            "title": "The Ui_collection Schema ",
        },
        "plugin_conf_id": {
            "$id": "/properties/plugin_conf_id",
            "type": "integer",
            "title": "The Plugin_conf_id Schema ",
        },
    }
};



let BusyAnimationConf = {
    "$id": "https://www.easyreading.eu/schemas/PluginConf.json",
    "type": "object",
    "title":"busy_animation_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "busy_animation_id": {
            "$id": "/properties/busy_animation_id",
            "type": "string",
            "title": "The busy_animation_id Schema ",
        },
        "busy_animation_version": {
            "$id": "/properties/busy_animation_version",
            "type": "string",
            "title": "The busy_animation_version Schema ",
        },
        "ui_collection": {
            "$id": "/properties/ui_collection",
            "type": "integer",
            "title": "The Ui_collection Schema ",
        },
        "busy_animation_conf_id": {
            "$id": "/properties/busy_animation_conf_id",
            "type": "integer",
            "title": "The busy_animation_conf_id Schema ",
        },
    }
};


let ToolConf = {
    "$id": "https://www.easyreading.eu/schemas/ToolConf.json",
    "type": "object",
    "title":"tool_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "ui_conf_id": {
            "$id": "/properties/ui_conf_id",
            "type": "integer",
            "title": "The Ui_conf_id Schema ",


        },
        "engine_id": {
            "$id": "/properties/engine_id",
            "type": "string",
            "title": "The Engine_id Schema ",


        },
        "engine_version": {
            "$id": "/properties/engine_version",
            "type": "string",
            "title": "The Engine_version Schema ",


        },
        "function_id": {
            "$id": "/properties/function_id",
            "type": "string",
            "title": "The Function_id Schema ",


        },
        "engine_conf_id": {
            "$id": "/properties/engine_conf_id",
            "type": "integer",
            "title": "The Engine_conf_id Schema ",


        },
        "widget_id": {
            "$id": "/properties/widget_id",
            "type": "string",
            "title": "The Widget_id Schema ",


        },
        "widget_version": {
            "$id": "/properties/widget_version",
            "type": "string",
            "title": "The Widget_version Schema ",


        },
        "widget_conf_id": {
            "$id": "/properties/widget_conf_id",
            "type": "integer",
            "title": "The Widget_conf_id Schema ",


        },
        "presentation_id": {
            "$id": "/properties/presentation_id",
            "type": "string",
            "title": "The Presentation_id Schema ",


        },
        "presentation_version": {
            "$id": "/properties/presentation_version",
            "type": "string",
            "title": "The Presentation_version Schema ",

        },
        "presentation_conf_id": {
            "$id": "/properties/presentation_conf_id",
            "type": "integer",
            "title": "The Presentation_conf_id Schema ",
        },
        "layout_conf_id": {
            "$id": "/properties/layout_conf_id",
            "type": "integer",
            "title": "The Layout_conf_id Schema ",
        },
        "order_in_ui": {
            "$id": "/properties/order_in_ui",
            "type": "integer",
            "title": "The Order_in_ui Schema ",
            "default": 0,

        }
    }
};

let HealthCareWorkerPatient = {
    "$id": "https://www.easyreading.eu/schemas/HealthCareWorkerPatient.json",
    "type": "object",
    "title":"health_care_worker_patient",    
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "health_care_worker_id": {
            "$id": "/properties/health_care_worker_id",
            "type": "integer",
            "title": "The profile id Schema ",

        },
        "patient_id": {
            "$id": "/properties/patient_id",
            "type": "integer",
            "title": "The profile id Schema ",

        }
    },
    "unique":[
        ["health_care_worker_id", "patient_id"]
    ]
};

let coreTableDefinitions = {

    baseTableDefinitions: [
        Profile,
        UICollection,
        UIConf,
        ToolConf,
        HealthCareWorkerPatient,
        PluginConf,
        BusyAnimationConf,
    ],


    getDefinitions: function () {


        return this.baseTableDefinitions;

    }


};
module.exports = coreTableDefinitions;