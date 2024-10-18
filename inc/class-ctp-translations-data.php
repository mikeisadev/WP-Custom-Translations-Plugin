<?php 

namespace CTP;

if (!defined('ABSPATH')) exit;

class CTP_Translations_Data {
    public static string $option_name = 'ctp-translations';

    private function __clone() {}
    
    /*
     * Generate translations data option settings.
     */
    public static function generate_translations_option() {
        if ( !self::option_exists() ) {

            $ctp_translations = json_encode([
                [
                    'english_string'                => 'Add to cart',
                    'italian_translation_string'    => 'Aggiungi al carrello'
                ],
                [
                    'english_string'                => 'Proceed to checkout',
                    'italian_translation_string'    => 'Procedi al checkout'
                ],
                [
                    'english_string'                => 'Description',
                    'italian_translation_string'    => 'Descrizione'
                ],
            ]);
        
            add_option(
                self::$option_name,
                $ctp_translations
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
        if (self::verify_translations_data_structure($translations)) {
            return false;
        }

        // Insert data.
        add_option(
            self::$option_name,
            $translations
        );

        return true;
    }

    /**
     * Get translations data.
     */
    public static function get_translation_data(bool $decode = true): mixed {
        if (self::option_exists()) {
            $translations = get_option(self::$option_name);

            return $decode ? json_decode($translations, true) : $translations;
        }

        return false;
    }

    /**
     * Delete translations data.
     */
    public static function delete_translation_data(): bool {
        if (self::option_exists()) {
            update_option( 
                self::$option_name,
                json_encode([])
            );

            return true;
        }

        return false;
    }

    /**
     * Verify translations data structure.
     */
    public static function verify_translations_data_structure(array $translations): bool {
        if ( !is_array($translations) ) {
            return false;
        }

        foreach ($translations as $translation) {
            if ( !is_array($translation) ) {
                return false;
            }

            if ( !array_key_exists('english_string', $translation) || !array_key_exists('italian_translation_string', $translation) ) {
                return false;
            }
        }

        return true;
    }
}