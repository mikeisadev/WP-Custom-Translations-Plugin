<?php
namespace CTP;

if (!defined('ABSPATH')) exit;

class CTP_Assets {
    private static ?CTP_Assets $instance = null;

    private string $page_prefix = 'toplevel_page_';

    private function __construct() {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_assets']);
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __clone() {}

    public function enqueue_assets() {
        $screen = get_current_screen();

        if ( $screen->id === $this->page_prefix . 'custom-translations' ) {
            wp_enqueue_style( 
                'CtpSettingsPageStyle', 
                \CTP_BUILD_URL . '/style-App.css', 
                [],
                '1.0.0'
            );

            wp_enqueue_script(
                'CtpSettingsPage',
                \CTP_BUILD_URL . '/App.js',
                ['react', 'react-dom'],
                '1.0.0',
                [
                    'in_footer' => true
                ]
            );

            wp_localize_script( 
                'CtpSettingsPage', 
                'ctpMetaData', 
                [
                    'nonce'         => wp_create_nonce('ctp_nonce'),
                    'restUrl'       => esc_url_raw(rest_url()),
                    'restNonce'     => wp_create_nonce('wp_rest'),
                    'ctpNamespace'  => CTP_REST_NAMESPACE,
                ]
            );
        }
        
    }
}
?>