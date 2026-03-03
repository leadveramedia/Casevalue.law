<?php
/**
 * PHPUnit bootstrap — stubs WordPress functions so the plugin can be loaded
 * without a full WordPress installation.
 */

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

// Define WordPress constants the plugin checks
if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', '/tmp/fake-wp/' );
}
