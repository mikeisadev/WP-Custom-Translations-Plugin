<?php 

namespace CTP;

use CTP\CTP_Translations_Data;
use CTP\CTP_Parser;

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
            
        if (!$translations) return;

        // Verify the data structure.
        if (!CTP_Translations_Data::verify_translations_data_structure($translations)) {
            wp_die(__('Invalid translation data structure. Impossible to read translations data structure to apply translations!', 'ctp-translations'));
        }

        if (is_admin()) return; // Don't apply translations in the admin area.

        // Apply the translations.
        foreach ($translations as $translation) {
            $string = $translation['english_string'];
            $translation = $translation['italian_translation_string'];

            $p_string = CTP_Parser::parse_plural_translation($string);
            $p_translation = CTP_Parser::parse_plural_translation($translation);

            if ($p_string && !$p_translation) continue; // Not valid

            if (!$p_string && $p_translation) continue; // Not valid

            if ($p_string && $p_translation) {

                // Plurals translation (ngettext)
                add_filter(
                    'ngettext',
                    function($text, $single, $plural, $number, $domain) use ($p_string, $p_translation) {
                        if (strtolower($single) === strtolower($p_string['singular']) && $number === 1 ) {
                            return esc_html(strip_tags($p_translation['singular']));
                        } else if (strtolower($plural) === strtolower($p_string['plural']) && $number > 1) {
                            return esc_html(strip_tags($p_translation['plural']));
                        }

                        return $text;
                    },
                    10,
                    5
                );

            } else { 

                // Singular translations (gettext)
                add_filter(
                    'gettext', 
                    function($translated, $text, $domain) use ($string, $translation) {
                        if (strtolower($text) === strtolower($string)) {
                            return esc_html(strip_tags($translation));
                        }

                        return $translated;
                    }, 
                    10, 
                    3
                );

            }

        }
    }
}