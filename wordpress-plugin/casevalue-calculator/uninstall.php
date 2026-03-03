<?php
/**
 * Uninstall CaseValue Calculator
 *
 * Removes all plugin data from the database when the plugin is uninstalled
 * (not just deactivated) via the WordPress admin.
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
    exit;
}

delete_option( 'casevalue_options' );
