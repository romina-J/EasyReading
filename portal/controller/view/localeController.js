const profileRepo = require("../../repository/profileRepo");

module.exports = {
    /**
     * Locale middleware: Try to fetch locale from URI param. If not available, fetch locale from user profile.
     * Otherwise, defaults to English.
     */
    setLocale: async (req, res, next) => {
        let loc = 'en';
        let localeInURL = false;
        const queryParam = 'lang';
        
        if (req.url) {
            let url = require('url');
            const urlObject = url.parse(req.url, true);

            if (urlObject.query[queryParam]) {
                loc = urlObject.query[queryParam].toLowerCase();
                
                req.locale = loc;
                localeInURL = true;
            }
        }

        if (!localeInURL) {
            if ('user' in req.session) {
                loc = await profileRepo.getProfileLanguage(req.session.user.id);
                if (loc) {
                    req.locale = loc;
                }
            }
        }
        
        return next();
    },




    translateMain: async (req, res, next) => {

        let loc = {
            'logout_text': req.__("Logout"),
            'login_text': req.__("Login"),
            'anonymous_user': req.__("Anonymous user"),

            'name_text': req.__("Name"),
            'role_text': req.__("Role"),

            'healthcareworker_role_text': req.__("Healthcare worker"),
            'client_role_text': req.__("Client"),

            'menu_home_text': req.__("Home"),
            'menu_welcome_text': req.__("Welcome"),
            'menu_config_your_toolbar_text': req.__("Config your toolbar"),
            'menu_config_your_custom_dom': req.__('Config your custom Web elements'),
            'menu_configure_toolbar_for_clients_text': req.__("Configure toolbar for clients"),
            'menu_caretaker_list_text': req.__("Configure caretaker"),

            'Save': req.__("Save"),
            'Saved': req.__("Saved"),
            'EnableSave': req.__("EnableSave"),
            'Cancel': req.__("Cancel"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateBackEnd: async (req, res, next) => {

        let loc = {
            'er_backend_title': req.__("Easy Reading Backend"),
            'configure_own_engines_text': req.__("Config your toolbar"),
            'admin_text': req.__("Caretaker administration"),
            'registerprofile_text': req.__("Register new caretaker"),
            'healthcareworker_text': req.__("Configure caretaker"),
            'healthcareworker_title': req.__("Health care worker"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateConfigure: async (req, res, next) => {
        let loc = {
            'page_configure_title': req.__("page_configure_title"),
            
            'page_configure_settings_header': req.__("page_configure_settings_header"),

            'page_configure_settings_type_header': req.__("page_configure_settings_type_header"),
            'page_configure_settings_type_description': req.__("page_configure_settings_type_description"),
            'page_configure_settings_type_how_to_use': req.__("page_configure_settings_type_how_to_use"),
            'page_configure_settings_type_legend': req.__("page_configure_settings_type_legend"),
            'page_configure_settings_type_overlay': req.__("page_configure_settings_type_overlay"),
            'page_configure_settings_type_slideout': req.__("page_configure_settings_type_slideout"),

            'page_configure_description': req.__("page_configure_description"),
	        'page_configure_tool_section_tile': req.__("page_configure_tool_section_tile"),
            'page_configure_tool_about': req.__("page_configure_tool_about"),
            'page_configure_tool_how_to_use': req.__("page_configure_tool_how_to_use"),
            'page_configure_tool_settings_title': req.__("page_configure_tool_settings_title"),
            'page_configure_tool_card_collapse_settings': req.__("page_configure_tool_card_collapse_settings"),
            'page_configure_tool_card_collapse_close': req.__("page_configure_tool_card_collapse_close"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateDomHelpers: async (req, res, next) => {
        let loc = {
            'page_domhelper_title': req.__("page_domhelper_title"),
            'page_domhelper_edit_intro_text': req.__("page_domhelper_edit_intro_text"),
            'page_domhelper_new_intro_text': req.__("page_domhelper_new_intro_text"),
            'page_domhelper_list_intro_text': req.__('page_domhelper_list_intro_text'),
            'page_domhelper_list_create_new': req.__('page_domhelper_list_create_new'),
            'element_id_pattern_label': req.__("element_id_pattern_label"),
            'url_pattern_label': req.__("url_pattern_label"),
            'element_content_label': req.__("element_content_label"),
            'element_fieldset_no_title': req.__("element_fieldset_no_title"),
            'page_domhelper_invalid_id_msg': req.__("page_domhelper_invalid_id_msg"),
            'element_title_label': req.__("element_title_label"),
            'element_desc_label': req.__("element_desc_label"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateClientWelcome: async (req, res, next) => {

        let loc = {
            'page_client_welcome_title': req.__("page_client_welcome_title"),
	        'page_client_welcome_intro_title': req.__("page_client_welcome_intro_title"),
            'page_client_welcome_intro_description_1': req.__("page_client_welcome_intro_description_1"),
            'page_client_welcome_intro_description_2': req.__("page_client_welcome_intro_description_2"),
            'page_client_welcome_intro_description_3': req.__("page_client_welcome_intro_description_3"),
            'page_client_welcome_intro_description_4': req.__("page_client_welcome_intro_description_4"),
            'page_client_welcome_intro_description_5': req.__("page_client_welcome_intro_description_5"),
            'page_client_welcome_tool_panel_layout_description': req.__("page_client_welcome_tool_panel_layout_description"),
            'page_client_welcome_to_configuration_title': req.__("page_client_welcome_to_configuration_title"),
            'page_client_welcome_to_configuration_link_text': req.__("page_client_welcome_to_configuration_link_text"),
            'page_client_welcome_to_configuration_description': req.__("page_client_welcome_to_configuration_description")
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateClientCaretakerRegister: async (req, res, next) => {

        let loc = {
            'page_registercaretaker_title': req.__("page_registercaretaker_title"),
            'page_registercaretaker_label_google': req.__("page_registercaretaker_label_google"),
            'caretaker_already_assigned': req.__("caretaker_already_assigned"),
            'caretaker_cannot_be_you': req.__("caretaker_cannot_be_you"),
            'user_is_not_a_caretaker': req.__("user_is_not_a_caretaker"),
            'user_not_found': req.__("user_not_found"),
        };
/*
 'caretaker_already_assigned': req.__(" is already assigned to you as a caretaker!"),
            'caretaker_cannot_be_you': req.__("You cannot assign yourself!"),
            'user_is_not_a_caretaker': req.__("is not a caretaker"),
            'user_not_found': req.__("User not found!"),
 */
        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    } ,

    translateCaretaker: async (req, res, next) => {

        let loc = {
            'page_caretaker_title': req.__("page_caretaker_title"),
            'page_caretaker_select': req.__("page_caretaker_select"),
            'page_caretaker_clients': req.__("page_caretaker_clients"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    } ,

    translateCaretakerList: async (req, res, next) => {

        let loc = {
            'page_caretakerlist_title': req.__("page_caretakerlist_title"),
            'page_caretakerlist_select': req.__("page_caretakerlist_select"),
            'page_registercaretaker_title': req.__("page_registercaretaker_title"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },
    
    translateClientList: async (req, res, next) => {

        let loc = {
            'page_clientlist_title': req.__("page_clientlist_title"),
            'page_clinetlist_edit': req.__("page_clinetlist_edit"),
            'page_clinetlist_clients': req.__("page_clinetlist_clients"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    }  

};
