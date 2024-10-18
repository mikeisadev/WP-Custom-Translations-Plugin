<?php
namespace CTP;

use CTP\CTP_Translations_Data;

if (!defined('ABSPATH')) exit;

class CTP_Export_Import_Data {
    /**
     * Export translations as JSON string.
     * 
     * If we don't get any JSON string, then return false.
     */
    public static function export(): string {
        $translations = CTP_Translations_Data::get_translation_data();

        if (wp_is_json_media_type( $translations )) {
            return $translations;
        }

        if ( is_array($translations) ) {
            return json_encode( $translations );
        }

        return false;
    }

    /**
     * Import translations.
     * 
     * Insert a JSON file with translations. inside the database.
     * 
     * Return false if the data structure is INVALID.
     * 
     * Return true if data is inserted correctly. Return false if data is not inserted correctly.
     */
    public static function import(array|string $translations): bool {
        if ( is_string($translations) ) $translations = json_decode( $translations, true );

        if ( !CTP_Translations_Data::verify_translations_data_structure($translations) ) {
            return false;
        }

        return CTP_Translations_Data::insert_translation_data($translations);
    }
}