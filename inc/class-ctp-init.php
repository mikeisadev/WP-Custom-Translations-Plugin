<?php

namespace CTP;

use CTP\CTP_SettingsPage;
use CTP\CTP_Assets;
use CTP\CTP_Translations_REST_API;
use CTP\CTP_Apply_Translations;
use CTP\CTP_Default_Translations;

if (!defined('ABSPATH')) exit;

final class CTP_Init {
    /**
     * Instance of the class.
     */
    private static ?CTP_Init $instance = null;
    
    /**
     * Keep track of WooCommerce Plugin activation.
     */
    private bool $isWooCommerceActive = TRUE;

    /**
     * Define common plugin general data properties.
     */
    public string $plugin_author = \CTP_PLUGIN_AUTHOR;

    public string $plugin_author_uri = \CTP_PLUGIN_AUTHOR_URI;

    public string $plugin_name = \CTP_PLUGIN_NAME;

    public string $plugin_version = \CTP_PLUGIN_VERSION;

    public string $plugin_txt_domain = \CTP_PLUGIN_TXTDOMAIN;
    
    /**
     * Get instance of the class.
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct() {
        // WooCommerce check.
        $this->woocommerce_exists();
        add_action( 'admin_notices', [$this, 'woocommerce_exists_notice'] );
        
        // Require files.
        $this->require_files();
        $this->init();
    }

    private function __clone() {}
    
    /**
     * Check if WooCommerce exists.
     */
    public function woocommerce_exists() {
        if (!is_plugin_active( 'woocommerce/woocommerce.php')) { 
            $this->isWooCommerceActive = FALSE;
        } else {
            $this->isWooCommerceActive = TRUE;
        }
    }
    
    /**
     * Show WooCommerce notice only if it is not active.
     */
    public function woocommerce_exists_notice() {
        if (!$this->isWooCommerceActive) {
            ?>
                <div class="notice notice-error is-dismissible">
                    <p><?php _e( 'Il plugin WooCommerce non è attivo. Potresti riscontrare problemi durante la traduzione delle sue stringhe.', 'cpt-plugin' ); ?></p>
                </div>
            <?php 
        }
    }
    
    /**
     * Require main files.
     */
    private function require_files() {
        require_once CTP_DIR . '/inc/class-ctp-settings-page.php';
        require_once CTP_DIR . '/inc/class-ctp-assets.php';
        require_once CTP_DIR . '/inc/class-ctp-translations-rest-api.php';
        require_once CTP_DIR . '/inc/class-ctp-apply-translations.php';
        require_once CTP_DIR . '/inc/class-ctp-default-translations.php';
    }
    
    /**
     * Init imported classes.
     */
    private function init() {
        // Base classes.
        CTP_SettingsPage::getInstance();
        CTP_Assets::getInstance();
        CTP_Translations_REST_API::getInstance();

        // Apply translations.
        $this->apply_translations();
    }

    /**
     * Apply translations.
     */
    private function apply_translations() {
        CTP_Apply_Translations::getInstance();
    }
}