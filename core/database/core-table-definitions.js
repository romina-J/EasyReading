let Profile = {
    "$id": "https://www.easyreading.eu/schemas/Profile.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "profile",
    "type": "object",
    "properties": {
        "googleID": {
            "type": "string"
        },
        "facebookID": {
            "type": "string"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "role": {
            "type": "integer",
            "title": "Role for this profile ",
            "default": 0,
        },
        "locale": {
            "type": "string",
            "maxLength": 255,
            "title": "Language of the user",
            "default": "en",
        },
    },
    "required": [
        "email"
    ],
    "unique": [
        ["email"]
    ]
};

let Role = {
    "$id": "https://www.easyreading.eu/schemas/Profile.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "role",
    "type": "object",
    "properties": {
        "user_id": {
            "$id": "/properties/ui_id",
            "type": "integer",
            "title": "User ID ",

        },
        "role": {
            "$id": "/properties/ui_id",
            "type": "string",
            "title": "Role",
            "enum": ["administrator", "client", "caretaker"],

        },
    },
};

let ClientCarerRelation = {
    "$id": "https://www.easyreading.eu/schemas/Profile.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "client_carer_relation",
    "type": "object",
    "properties": {
        "client_id": {
            "$id": "/properties/ui_id",
            "type": "integer",
            "title": "client ID ",

        },
        "carer_id": {
            "$id": "/properties/ui_id",
            "type": "integer",
            "title": "client ID ",

        },
        "state": {
            "$id": "/properties/ui_id",
            "type": "integer",
            "title": "client ID ",
            "default": 0,

        },
    },
};


let UICollection = {
    "$id": "https://www.easyreading.eu/schemas/UICollection.json",
    "type": "object",
    "title": "ui_collection",
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
    "title": "ui_conf",
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
    "title": "plugin_conf",
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
    "title": "busy_animation_conf",
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
    "title": "tool_conf",
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
    "title": "health_care_worker_patient",
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
    "unique": [
        ["health_care_worker_id", "patient_id"]
    ]
};

let ContentReplacement = {
    "$id": "https://www.easyreading.eu/schemas/ContentReplacement.json",
    "type": "object",
    "title": "content_replacement",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "title": {
            "$id": "/properties/title",
            "type": "string",
            "title": "Title",
            "description": "Title for the content replacement"
        },
        "description": {
            "$id": "/properties/description",
            "type": "string",
            "title": "Description",
            "description": "Short description of the content replacement (optional)"
        },
        "url": {
            "$id": "/properties/url",
            "type": "string",
            "title": "Site URL",
            "description": "URL of the page where the replacement should be applied",
        },

        "selector": {
            "$id": "/properties/selector",
            "type": "string",
            "title": "Selector",
            "description": "The selector of the element within the DOM",
        },
        "selector_type": {
            "$id": "/properties/selector_type",
            "type": "string",
            "title": "Selector Type",
            "description": "Defines which selector to use. E.g: jQuery selector",
        },

        "scope": {
            "$id": "/properties/scope",
            "type": "string",
            "enum": ["pubic", "clients"],
            "title": "Scope",
            "description": "Defines which this replacement is visible for everybody, or only for the clients of the person that created the replacement",
        },
        "replacement": {
            "$id": "/properties/replacement",
            "type": "string",
            "title": "Replacement",
            "description": "The content of the replacement",
        },
        "language": {
            "$id": "/properties/language",
            "type": "string",
            "title": "Language",
            "description": "Language code of the replacement language",
        },
        "active": {
            "$id": "/properties/active",
            "type": "boolean",
            "default": true,
            "title": "Active",
            "description": "Defines if the replacement is active or not. Only active replacements are shown to users."
        },
        "pid": {
            "$id": "/properties/pid",
            "type": "integer",
            "title": "Profile ID",
            "description": "The profile ID of the user who created the replacement",
        },
    }
};

let CustomFunction = {

    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "https://www.easyreading.eu/schemas/customFunction.json",
    "type": "object",
    "title": "custom_function",
    "required": [
        "creator",
        "function_code",
        "title",
        "description"
    ],
    "properties": {
        "creator": {
            "$id": "#/properties/creator",
            "type": "integer",
            "title": "id of the creator",
        },
        "function_code": {
            "$id": "#/properties/function_code",
            "type": "string",
            "title": "json of the function",
        },
        "title": {
            "$id": "#/properties/title",
            "type": "string",
            "title": "title of the combined function",

        },
        "description": {
            "$id": "#/properties/description",
            "type": "string",
            "title": "desrciption of the combined function",
            "default": "",

        }
    }
};

let CustomToolConf = {
    "$id": "https://www.easyreading.eu/schemas/ToolConf.json",
    "type": "object",
    "title": "custom_tool_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "ui_conf_id": {
            "$id": "/properties/ui_conf_id",
            "type": "integer",
            "title": "The Ui_conf_id Schema ",


        },
        "custom_function_id": {
            "$id": "/properties/engine_id",
            "type": "string",
            "title": "Id of the custom function",


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
        "icon": {
            "$id": "/properties/widget_version",
            "type": "string",
            "title": "The Icon Schema ",


        },
        "order_in_ui": {
            "$id": "/properties/order_in_ui",
            "type": "integer",
            "title": "The Order_in_ui Schema ",
            "default": 0,

        }
    }
};


let coreTableDefinitions = {

    baseTableDefinitions: [
        Profile,
        Role,
        UICollection,
        UIConf,
        ToolConf,
        HealthCareWorkerPatient,
        PluginConf,
        BusyAnimationConf,
        CustomFunction,
        CustomToolConf,
        ContentReplacement,
        ClientCarerRelation,
    ],


    getDefinitions: function () {


        return this.baseTableDefinitions;

    }


};
module.exports = coreTableDefinitions;

