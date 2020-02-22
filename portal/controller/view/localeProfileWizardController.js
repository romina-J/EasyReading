module.exports = {

    translateProfileWizard: async (req, res, next) => {

        let loc = {

            //Step 1
            'profile_wizard_step_1_heading': req.__("profile_wizard_step_1_heading"),
            'welcome_to_easy_reading': req.__("welcome_to_easy_reading"),
            'welcome_to_easy_reading_text': req.__("welcome_to_easy_reading_text"),
            'standard_profile_bullet': req.__("standard_profile_bullet"),
            'personalized_profile_bullet': req.__("personalized_profile_bullet"),
            'default_profile': req.__("default_profile"),
            'default_profile_text': req.__("default_profile_text"),
            'default_profile_button_label': req.__("default_profile_button_label"),
            'personalized__profile': req.__("personalized__profile"),
            'personalized__profile_text': req.__("personalized__profile_text"),
            'personalized__profile_button_label': req.__("personalized__profile_button_label"),


            //Step 2
            'profile_wizard_step_2_heading': req.__("profile_wizard_step_2_heading"),
            'understandable_title': req.__("understandable_title"),
            'easy_text_label': req.__("easy_text_label"),
            'translation_label': req.__("translation_label"),
            'multimedia_label': req.__("multimedia_label"),

            //Step 3
            'profile_wizard_step_3_heading': req.__("profile_wizard_step_3_heading"),
            'symbol_title': req.__("symbol_title"),
            'bliss_label': req.__("bliss_label"),
            'arasaac_label': req.__("arasaac_label"),
            'widgit_label': req.__("widgit_label"),
            'none_label': req.__("none_label"),


            //Step 4
            'profile_wizard_step_4_heading': req.__("profile_wizard_step_4_heading"),
            'layout_title': req.__("layout_title"),
            'bigger_font_label': req.__("bigger_font_label"),
            'inverted_color_label': req.__("inverted_color_label"),
            'simplified_layout_label': req.__("simplified_layout_label"),
            'advertisment_label': req.__("advertisment_label"),
            'easier_to_see_links_label': req.__("easier_to_see_links_label"),



            //Step 5
            'profile_wizard_step_5_heading': req.__("profile_wizard_step_5_heading"),
            'reading_title': req.__("reading_title"),
            'slow_label': req.__("slow_label"),
            'normal_label': req.__("normal_label"),
            'fast_label': req.__("fast_label"),
            'no_tts_label': req.__("no_tts_label"),
            'highlightning_title': req.__("highlightning_title"),
            'highlightning_yes_label': req.__("highlightning_yes_label"),
            'highlightning_no_label': req.__("highlightning_no_label"),


            //Step 6
            'profile_wizard_step_6_heading': req.__("profile_wizard_step_6_heading"),
            'interaction_title': req.__("interaction_label"),
            'click_label': req.__("click_label"),
            'mark_label': req.__("mark_label"),

            //Step 7
            'profile_wizard_step_7_heading': req.__("profile_wizard_step_7_heading"),
            'presentation_title': req.__("presentation_title"),
            'tooltip_label': req.__("tooltip_label"),
            'top_of_word_label': req.__("top_of_word_label"),
            'next_to_word_label': req.__("next_to_word_label"),
            'ui_title': req.__("ui_title"),
            'slide_in_label': req.__("slide_in_label"),
            'overlay_label': req.__("overlay_label"),

            //Step 8
            'profile_wizard_step_8_heading': req.__("profile_wizard_step_8_heading"),
            'setup_complete_title': req.__("setup_complete_title"),
            'setup_complete_text': req.__("setup_complete_text"),
            'setup_complete': req.__("setup_complete"),
            'personal_profile_complete_text': req.__("personal_profile_complete_text"),
            'default_profile_complete_text': req.__("default_profile_complete_text"),
            'finish_label': req.__("finish_label"),




        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    }
};