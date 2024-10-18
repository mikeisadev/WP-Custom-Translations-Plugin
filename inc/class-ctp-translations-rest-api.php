<?php

namespace CTP;

use CTP\CTP_Translations_Data;

if (!defined('ABSPATH')) exit;

class CTP_Translations_REST_API {

    /**
     * Main instance of the class
     */
    private static ?CTP_Translations_REST_API $instance = null;

    /**
     * Upload properties.
     * 
     * Keys to be inside the file array to validate the upload data structure.
     */
    private array $upload_file_data_keys = ['error', 'size', 'tmp_name', 'type'];

    /**
     * Define the max file size.
     */
    private int $max_file_size = (10 * 1024) * 1024;
    
    // Get instance of the class.
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /**
     * Init REST ROUTES.
     */
    private function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    /**
     * Register REST ROUTES.
     */
    public function register_routes() {
        /**
         * Get and send translations.
         */
        register_rest_route(CTP_REST_NAMESPACE, '/translations', [
            'methods'               => \WP_REST_Server::READABLE,
            'callback'              => [$this, 'get_translations'],
            // 'permission_callback'   => [$this, 'user_has_privileges'],
        ]);

        register_rest_route(CTP_REST_NAMESPACE, '/translations', [
            'methods'               => \WP_REST_Server::CREATABLE,
            'callback'              => [$this, 'save_translation'],
            'permission_callback'   => [$this, 'user_has_privileges'],
        ]);

        register_rest_route(CTP_REST_NAMESPACE, '/translations', [
            'methods'               => \WP_REST_Server::DELETABLE,
            'callback'              => [$this, 'delete_translations'],
            'permission_callback'   => [$this, 'user_has_privileges'],
        ]);

        /**
         * Import and export data.
         */
        register_rest_route(CTP_REST_NAMESPACE, '/manage/import', [
            'methods'               => \WP_REST_Server::CREATABLE,
            'callback'              => [$this, 'import_translations'],
            'permission_callback'   => [$this, 'user_has_privileges'],
        ]);

        register_rest_route(CTP_REST_NAMESPACE, '/manage/export', [
            'methods'               => \WP_REST_Server::CREATABLE,
            'callback'              => [$this, 'export_translations'],
            'permission_callback'   => [$this, 'user_has_privileges'],
        ]);
    }

    /**
     * Get translations.
     */
    public function get_translations(\WP_REST_Request $request) {
        $nonce = $request->get_header('x_wp_nonce');
        
        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new \WP_REST_Response(['message' => 'Invalid nonce'], 403);
        }

        // Generate translations if not present 
        CTP_Translations_Data::generate_ctp_translations_option(empty_translations: false);

        // Get and decode translations and meta data.
        $data = CTP_Translations_Data::get_translations_and_meta_data(decode: true);

        // Check if data structure is correct.
        if ( !CTP_Translations_Data::verify_translations_data_structure($data['translations']) ) {
            return new \WP_REST_Response(['message' => 'Invalid data structure'], 500);
        }

        return new \WP_REST_Response($data, 200);
    }

    /**
     * Save translations.
     */
    public function save_translation(\WP_REST_Request $request) {
        $body = $request->get_json_params();
        $headers = $request->get_headers();
        $nonce = $request->get_header('x_wp_nonce');

        // Verify nonce.
        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new \WP_REST_Response(['message' => 'Invalid nonce'], 403);
        }

        // Verify if we have the data and if data structure is correct.
        if ( !array_key_exists('translations_data', $body) || !is_array($body['translations_data']) ) {
            return new \WP_REST_Response(['message' => 'Invalid data structure'], 500);
        }

        $translations = $body['translations_data'];

        if ( !CTP_Translations_Data::verify_translations_data_structure($translations) ) {
            return new \WP_REST_Response(['message' => 'Invalid data structure'], 500);
        }

        // Save translations
        update_option('ctp-translations', json_encode($translations));

        return new \WP_REST_Response([
            'translations_data'     => $translations,
            'message'                => 'Traduzioni salvate con successo',
            'status'                => 200,
            'status_message'        => 'OK'
        ], 201);
    }

    /**
     * Delete all translations.
     */
    public function delete_translations(\WP_REST_Request $request) {
        $body = $request->get_json_params();
        $headers = $request->get_headers();
        $nonce = $request->get_header('x_wp_nonce');

        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new \WP_REST_Response(['message' => 'Invalid nonce'], 403);
        }

        if (CTP_Translations_Data::delete_translation_data()) {
            $translations = CTP_Translations_Data::get_translation_data();

            return wp_send_json([
                'message'       => 'Traduzioni eliminate con successo',
                'translations'  => $translations
            ], 200);
        }

        return new \WP_REST_Response(['message' => 'Si è verificato un errore durante la cancellazione delle traduzioni'], 500);
    }

    /**
     * Import translations.
     * 
     * It's an upload function on the server side!
     */
    public function import_translations(\WP_REST_Request $request) {
        $body = $request->get_json_params();
        $headers = $request->get_headers();
        $nonce = $request->get_header('x_wp_nonce');

        $files = $request->get_file_params();

        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new \WP_REST_Response(['message' => 'Invalid nonce'], 403);
        }

        if ( !array_key_exists('translations', $files) ) {
            return $this->invalid_importing_file('invalid-file');
        }

        /**
         * After verifying that the sent JSON from javascript client has
         * 'translations' key, we can now proceed to check the file data structure.
         * 
         * So as first thing, we save the file data in a variable. Getting the 'translations' key.
         * 
         * Then we do all the checks to verify if the file is valid.
         */
        $translations_file = $files['translations'];

        foreach ($this->upload_file_data_keys as $key) {
            if ( !array_key_exists($key, $translations_file) ) {
                return $this->invalid_importing_file('invalid-file');
            }
        }

        // print_r($translations_file); // Only for debugging purposes.

        if ($translations_file['error'] !== UPLOAD_ERR_OK) {
            return $this->invalid_importing_file('invalid-file');
        }

        if ($translations_file['size'] > $this->max_file_size ) {
            return $this->invalid_importing_file('max-file-size-reached');
        }

        // Validate file mime type.
        if ($translations_file['type'] !== 'application/json') {
            return $this->invalid_importing_file('invalid-json');
        }

        // Validate file extension via dot splitting.
        $file_name_arr = explode('.', $translations_file['name']);
        $file_ext = end($file_name_arr);
        
        if ($file_ext !== 'json') {
            return $this->invalid_importing_file('invalid-json');
        }

        $file_content = file_get_contents($translations_file['tmp_name']);
        if ($file_content === false || $translations_file['size'] === 0) {
            return $this->invalid_importing_file('missing-file');
        }

        $json_data_arr = json_decode($file_content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->invalid_importing_file('invalid-json');
        }

        // Verify if the data structure is correct.
        if (!CTP_Translations_Data::verify_translations_data_structure($json_data_arr)) {
            return new \WP_REST_Response(['message' => 'Struttura dati non valida'], 500);
        }

        // Save imported translations.
        update_option('ctp-translations', json_encode($json_data_arr));

        return new \WP_REST_Response([
            'message'           => 'Traduzioni importate con successo',
            'status'            => 200,
            'status_message'    => 'OK',
            'translations'      => $json_data_arr
        ], 200);
    }

    /**
     * Export translations.
     */
    public function export_translations(\WP_REST_Request $request) {
        $body = $request->get_json_params();
        $headers = $request->get_headers();
        $nonce = $request->get_header('x_wp_nonce');

        if (!wp_verify_nonce($nonce, 'wp_rest')) {
            return new \WP_REST_Response(['message' => 'Invalid nonce'], 403);
        }

        /**
         * Get translations array, decode JSON string from the database.
         * 
         * This to verify the integrity of the data structure.
         */
        $translations = CTP_Translations_Data::get_translation_data(decode: true);

        if ( !CTP_Translations_Data::verify_translations_data_structure($translations) ) {
            return new \WP_REST_Response(['message' => 'Invalid data structure'], 500);
        }

        /**
         * Re-encode the translations array to send a JSON response to the client.
         */
        return wp_send_json(json_encode($translations), 200);
    }

    /**
     * Check permissions.
     * 
     * Only administrator or users that can manage options can access the API.
     */
    public function user_has_privileges() {
        return current_user_can('administrator') && current_user_can('manage_options');
    }

    /**
     * Return a response message for the imported translation JSON file.
     */
    private function invalid_importing_file(string $type): \WP_REST_Response {
        switch ($type) {
            case 'invalid-json': 
                return new \WP_REST_Response(['message' => 'Invalid file. It\'s not JSON!'], 500);
            case 'missing-file':
                return new \WP_REST_Response(['message' => 'File is missing. We cannot import a file that does not exist!'], 500);
            case 'invalid-file':
                return new \WP_REST_Response(['message' => 'Invalid file!'], 500);
            case 'max-file-size-reached':
                return new \WP_REST_Response(['message' => 'The file is too big'], 500);
        }
    }

}