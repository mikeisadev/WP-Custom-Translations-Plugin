<?php 

namespace CTP;

if (!defined('ABSPATH')) exit;

use CTP\CTP_Default_Translations;

class CTP_Translations_Data {
    public static string $option_name = 'ctp-translations-data';

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
            'unique_id'                  => null,
            'added_from_user_id'         => null,
            'added_from_user_priviliges' => null,
            'translations_origin'        => 'default'
        ],
        'translations'                   => null
    ];

    private function __clone() {}
    
    /*
     * Generate translations data option settings.
     */
    public static function generate_ctp_translations_option(bool $empty_translations = false): void {
        if ( !self::option_exists() ) {

            // Load meta data inside ctp data array.
            self::load_ctp_meta_data(translations_origin: 'default');

            // Load default translations.
            self::$ctp_translations_data['translations'] = !$empty_translations ? CTP_Default_Translations::$default_translations : [];
            
            // Insert data into wp_options table.
            add_option(
                self::$option_name,
                json_encode( self::$ctp_translations_data )
            );
            
        }
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
    public static function insert_translation_data(array $translations): bool {
        // Verify data integrity    
        if (!self::verify_translations_data_structure($translations)) {
            return false;
        }

        // Update ctp meta data.
        self::load_ctp_meta_data(translations_origin: 'custom__insert_function');

        // Insert translations in the complete data structure.
        self::$ctp_translations_data['translations'] = $translations;

        // Insert data.
        add_option(
            self::$option_name,
            self::$ctp_translations_data
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
            self::load_ctp_meta_data(translations_origin: 'custom__deleted');

            // Empty translations
            self::$ctp_translations_data['translations'] = [];

            update_option( 
                self::$option_name,
                json_encode(self::$ctp_translations_data)
            );

            return true;
        } else {
            /**
             * If we are trying to delete an option that does not exist,
             * recreate the option with default values with empty translations.
             * 
             * This to reduce bugs at minimum.
             */
            self::load_ctp_meta_data(translations_origin: 'custom__deleted');
            self::generate_ctp_translations_option(empty_translations: true);

            return true;
        }

        return false;
    }

    /**
     * Load meta data inside ctp data structure.
     */
    public static function load_ctp_meta_data(string $translations_origin = 'default'): bool {
        self::$ctp_translations_data['meta_data']['published_on_date'] = date('Y-m-d H:i:s');
        self::$ctp_translations_data['meta_data']['timestamp'] = time();
        self::$ctp_translations_data['meta_data']['unique_id'] = uniqid();
        self::$ctp_translations_data['meta_data']['added_from_user_id'] = get_current_user_id();
        self::$ctp_translations_data['meta_data']['added_from_user_priviliges'] = get_userdata(get_current_user_id())->roles;
        self::$ctp_translations_data['meta_data']['translations_origin'] = $translations_origin;

        return true;
    }
    
    /**
     * Verify translations data structure.
     * 
     * So verify only the translations not the entire CTP data structure.
     */
    public static function verify_translations_data_structure(array $translations): bool {
        if ( !is_array($translations) ) {
            return false;
        }

        // Get array keys.
        $translations_keys = array_keys( CTP_Default_Translations::$default_translations[0] );

        // Verify the translations!
        foreach ($translations as $translation) {
            if ( !is_array($translation) ) {
                return false;
            }

            foreach ($translations_keys as $k) {
                if ( !array_key_exists($k, $translation) ) {
                    return false;
                }
            }
        }

        return true;
    }


    /**
     * Verify the integrity of the entire CTP data structure.
     */
    public static function verify_ctp_translation_array_structure(array $ctp_data_structure): bool {
        if ( !is_array($translations) ) {
            return false;
        }

        // Get default array keys to perform direct keys validation.
        $data_keys = array_keys( self::$ctp_translations_data );
        $general_info_keys = array_keys( self::$ctp_translations_data['general_info'] );
        $translations_data_keys = array_keys( self::$ctp_translations_data['translations_data'] );

        // Verify first level keys
        foreach ($data_keys as $k) {
            if ( !array_key_exists($k, $translations) ) {
                return false;
            }
        }

        // Verify general info keys
        foreach ($general_info_keys as $k) {
            if ( !array_key_exists($k, $translations['general_info']) ) {
                return false;
            }
        }

        // Verify translations data keys    
        foreach ($translations_data_keys as $k) {
            if ( !array_key_exists($k, $translations['translations_data']) ) {
                return false;
            }
        }

        // Verify the translations!
        if (!self::verify_translations_data_structure($translations['translations'])) {
            return false;
        }

        return true;
    }
}