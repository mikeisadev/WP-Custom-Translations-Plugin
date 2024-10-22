<?php

use CTP\CTP_Translations_Data;

/**
 * Manage plugin activation.
 */
function ctp_activation() {

    if (!CTP_Translations_Data::option_exists()) {
        CTP_Translations_Data::generate_ctp_translations_option();
    }

}