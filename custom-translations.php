<?php
/*
 * Plugin Name: Custom Translations - by Michele Mincone
 * Plugin URI: https://michelemincone.com
 * Description: Un plugin specifico per applicare traduzioni dove non vengono visualizzate con altri plugin. Questo plugin sfrutta il filtro "gettext".
 * Version: 1.0
 * Author: Michele Mincone
 * Author URI: https://michelemincone.com
 * License: GPL2
 */

use CTP\CTP_Init;

if (!defined('ABSPATH')) exit;

/**
 * Define common constants.
 */
define('CTP_PLUGIN_VERSION', '1.0.0');
define('CTP_PLUGIN_AUTHOR', 'Michele Mincone');
define('CTP_PLUGIN_AUTHOR_URI', 'https://michelemincone.com');
define('CTP_PLUGIN_VERSION_TYPE', 'BETA');
define('CTP_PLUGIN_NAME', 'Custom Translations Plugin - By Michele Mincone');

/**
 * Define this plugin dir path and the url. 
 * 
 */
define('CTP_DIR', WP_PLUGIN_DIR . '/' . plugin_basename(dirname(__FILE__)));
define('CTP_URL', plugins_url('', __FILE__));

/**
 * Build folder
 */
define('CTP_BUILD_URL', CTP_URL . '/build');

/**
 * Define the textdomain.
 */
define('CTP_PLUGIN_TXTDOMAIN', 'cpt_plugin');

/**
 * REST API namespace.
 */
define('CTP_REST_NAMESPACE', 'ctp/v1');
define('CTP_REST_VERSION', '1');

/**
 * Required Plugin Core and WP files.
 */
require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
require_once( CTP_DIR . '/inc/class-ctp-translations-data.php' );
require_once( CTP_DIR . '/inc/ctp.php' );
require_once( CTP_DIR . '/inc/class-ctp-init.php' );

/**
 * Activation hook.
 */
register_activation_hook( __FILE__, 'ctp_activation' );

/**
 * Init.
 */
CTP_Init::getInstance();