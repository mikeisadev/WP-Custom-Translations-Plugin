<?php 

namespace CTP;

use CTP\CTP_Translations_Data;

if (!defined('ABSPATH')) exit;

/**
 * This is the class where all the translations saved are applied using the gettext filter of wordpress.
 */
class CTP_Apply_Translations {
    private static $instance = null;

    private function __construct() {
        $this->apply_translations();    
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __clone() {}

    public function apply_translations() {
        // Get only the translations!
        $translations = CTP_Translations_Data::get_translation_data();

        if (empty($translations)) {
            return;
        }

        // Verify the data structure.
        if (!CTP_Translations_Data::verify_translations_data_structure($translations)) {
            wp_die(__('Invalid translation data structure. Impossible to read translations data structure to apply translations!', 'ctp-translations'));
        }

        // Apply the translations.
        foreach ($translations as $translation) {

            add_filter(
                'gettext', 
                function($translated, $text, $domain) use ($translation) {
                    $english_string = strtolower($translation['english_string']);
                    $translated_string = $translation['italian_translation_string'];

                    if (strtolower($text) === $english_string) {
                        return esc_html(strip_tags($translated_string));
                    }

                    return $translated;
                }, 
                10, 
                3
            );

        }
    }
}