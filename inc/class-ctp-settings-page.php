<?php 

namespace CTP;

if (!defined('ABSPATH')) exit;

class CTP_SettingsPage {
    private static $instance = null;
    
    // Get instance of the class.
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', [$this, 'generate_settings_page']);
        add_action('admin_init', [$this, 'custom_settings_register_settings']);
    }

    private function __clone() {}
    
    /*
     * Add the settings page to wordpress admin area.
     */
    public function generate_settings_page() {
        add_menu_page(
            'Traduzioni personalizzate',
            'Traduzioni personalizzate',                
            'manage_options',                 
            'custom-translations',                
            [$this, 'custom_translations_page_html'],      
            'dashicons-translation',        
            100                     
        );
    }
    
    /*
     * Generate the HTML page for the settings menu link.
     */
    public function custom_translations_page_html() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        ?>
        <div id="ctp-settings-page"></div>
        <?php
    }
    
    /**
     * Save the settings
     */
    public function custom_settings_register_settings() {
        register_setting('custom_settings_group', 'custom_text_setting');
    }
}