<?php 

namespace CTP;

if (!defined('ABSPATH')) exit;

use CTP\CTP_Default_Translations;

class CTP_Translations_Data {
    public static string $option_name = 'ctp-translations-data';

    private static string $id_type = 'uint';

    private static array $ctp_translations_data = [
        'general_info' => [
            'plugin_name'                => CTP_PLUGIN_NAME,
            'plugin_version'             => CTP_PLUGIN_VERSION,
            'plugin_author'              => CTP_PLUGIN_AUTHOR,
            'plugin_author_uri'          => CTP_PLUGIN_AUTHOR_URI,
            'plugin_version_type'        => CTP_PLUGIN_VERSION_TYPE,
            'plugin_textdomain'          => CTP_PLUGIN_TXTDOMAIN,
        ],
        'meta_data' => [
            'published_on_date'          => null,
            'timestamp'                  => null,
            'uuid'                       => null,
            'added_from_user_id'         => null,
            'added_from_user_priviliges' => null,
            'translations_origin'        => 'default',
            'id_type'                    => null
        ],
        'translations'                   => null
    ];

    private function __clone() {}
    
    /*
     * Generate translations data option settings.
     * 
     * Default settings.
     */
    public static function generate_ctp_translations_option(bool $empty_translations = false, bool $force = false): bool {
        if (self::option_exists() && !$force) {
            return false;
        }

        // Load meta data inside ctp data array.
        self::load_ctp_meta_data(translations_origin: 'default');

        // Load default translations.
        self::$ctp_translations_data['translations'] = !$empty_translations ?       
            CTP_Default_Translations::get_default_translations(id_type: self::$id_type) : [];
            
        /**
         * Insert data into wp_options table.
         * 
         * If option exists, update it.
         * 
         * Othwerwise, create it.
         */
        if (self::option_exists()) {
            update_option(
                self::$option_name,
                json_encode( self::$ctp_translations_data )
            );
        } else {
            add_option(
                self::$option_name,
                json_encode( self::$ctp_translations_data )
            );
        }

        return true;
    }

    /**
     * Check if the option exists.
     */
    public static function option_exists(): mixed {
        return get_option(self::$option_name);
    }

    /**
     * Insert translations data.
     */
    public static function insert_translation_data(array $translations, $data_origin = 'insert_function'): bool {
        // Verify data integrity    
        $translations = self::verify_translations_data_structure($translations);

        if (!$translations && !is_array($translations)) {
            return false;
        }

        // Update ctp meta data.
        self::load_ctp_meta_data(translations_origin: $data_origin);

        // Insert translations in the complete data structure.
        self::$ctp_translations_data['translations'] = $translations;

        // Insert data.
        update_option(
            self::$option_name,
            json_encode( self::$ctp_translations_data )
        );

        return true;
    }

    /**
     * Get all ctp data.
     */
    public static function get_ctp_data(bool $decode = true, bool $get_all = true): mixed {
        if (self::option_exists()) {
            $rdata = (array) json_decode(get_option(self::$option_name), true);

            $rdata = $get_all ? $rdata : $rdata['translations'];

            return $decode ? $rdata : json_encode($rdata);
        }

        return false;
    }

    /**
     * Get only translations data from ctp data structure.
     */
    public static function get_translation_data(bool $decode = true): mixed {
        return self::get_ctp_data($decode, false);
    }

    /**
     * Get translations and meta_data data from ctp data structure.
     */
    public static function get_translations_and_meta_data(bool $decode = true): mixed {
        $data = self::get_ctp_data(true, true);

        $data = [
            'meta_data'     => $data['meta_data'],
            'translations'  => $data['translations']
        ];

        return $decode ? $data : json_encode($data);
    }

    /**
     * Delete translations data.
     */
    public static function delete_translation_data(): bool {
        if (self::option_exists()) {
            // Update meta data.
            self::load_ctp_meta_data(translations_origin: 'delete_function');

            // Empty translations
            self::$ctp_translations_data['translations'] = [];

            update_option( 
                self::$option_name,
                json_encode( self::$ctp_translations_data )
            );

            return true;
        } else {
            /**
             * If we are trying to delete an option that does not exist,
             * recreate the option with default values with empty translations.
             * 
             * This to reduce bugs at minimum.
             */
            self::load_ctp_meta_data(translations_origin: 'delete_function');
            self::generate_ctp_translations_option(empty_translations: true);

            return true;
        }

        return false;
    }

    /**
     * Load meta data inside ctp data structure.
     */
    public static function load_ctp_meta_data(string $translations_origin = 'default'): bool {
        $timestamp = time();

        self::$ctp_translations_data['meta_data']['published_on_date'] = wp_date('Y-m-d H:i:s', $timestamp);
        self::$ctp_translations_data['meta_data']['timestamp'] = $timestamp;
        self::$ctp_translations_data['meta_data']['uuid'] = wp_generate_uuid4();
        self::$ctp_translations_data['meta_data']['added_from_user_id'] = get_current_user_id();
        self::$ctp_translations_data['meta_data']['added_from_user_priviliges'] = get_userdata(get_current_user_id())->roles;
        self::$ctp_translations_data['meta_data']['translations_origin'] = $translations_origin;
        self::$ctp_translations_data['meta_data']['id_type'] = self::$id_type;

        return true;
    }
    
    /**
     * Verify translations data structure and do sanitization (tag stripping is under evaluation).
     * 
     * So verify only the translations not the entire CTP data structure.
     */
    public static function verify_translations_data_structure(array $translations): bool|array {
        if ( !is_array($translations) ) {
            return false;
        }

        /**
         * If the array is empty there is no problem.
         * 
         * Return an empty array;
         */
        if ( empty($translations) ) {
            return [];
        }

        // Get array keys.
        $translations_keys = array_keys( CTP_Default_Translations::$default_translations[0] );

        // Verify the translations!
        foreach ($translations as $c => $translation) {
            if ( !is_array($translation) ) {
                return false;
            }

            // Verify keys.
            foreach ($translations_keys as $k) {
                if ( !array_key_exists($k, $translation) ) {
                    return false;
                }

                // Sanitize and strip tags.
                $translations[$c][$k] = sanitize_text_field(strip_tags($translation[$k]));
            }
        }

        return $translations;
    }


    /**
     * Verify the integrity of the entire CTP data structure.
     */
    public static function verify_ctp_translation_array_structure(array $ctp_data_structure): bool|array {
        if ( !is_array($ctp_data_structure) ) {
            return false;
        }

        // Get default array keys to perform direct keys validation.
        $data_keys = array_keys( self::$ctp_translations_data );
        $general_info_keys = array_keys( self::$ctp_translations_data['general_info'] );
        $translations_data_keys = array_keys( self::$ctp_translations_data['meta_data'] );

        // Verify first level keys
        foreach ($data_keys as $k) {
            if ( !array_key_exists($k, $ctp_data_structure) ) {
                return false;
            }
        }

        // Verify general info keys
        foreach ($general_info_keys as $k) {
            if ( !array_key_exists($k, $ctp_data_structure['general_info']) ) {
                return false;
            }
        }

        // Verify translations data keys    
        foreach ($translations_data_keys as $k) {
            if ( !array_key_exists($k, $ctp_data_structure['meta_data']) ) {
                return false;
            }
        }

        /**
         * Sanitize translations data structure.
         * 
         * Then verify if the translations data structure is correct.
         */
        $sanitized_translations = self::verify_translations_data_structure($ctp_data_structure['translations']);

        if (!$sanitized_translations && !is_array($sanitized_translations)) {
            return false;
        }

        /**
         * Put the sanitized translations back into the ctp data structure.
         */
        $ctp_data_structure['translations'] = $sanitized_translations;

        return $ctp_data_structure;
    }
}