<?php

use CTP\CTP_Translations_Data;

/**
 * Manage plugin activation.
 */
function ctp_activation() {

    CTP_Translations_Data::generate_translations_option();

}