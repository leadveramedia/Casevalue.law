<?php
/**
 * Plugin Name:       CaseValue Calculator
 * Plugin URI:        https://casevalue.law/embed/docs
 * Description:       Add a free legal case value calculator to your website. Visitors answer a short questionnaire and get an estimated settlement value. Leads are emailed directly to your intake email.
 * Version:           1.0.0
 * Author:            CaseValue.law
 * Author URI:        https://casevalue.law
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       casevalue-calculator
 * Requires at least: 5.8
 * Tested up to:      6.7
 * Requires PHP:      7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'CASEVALUE_VERSION', '1.0.0' );
define( 'CASEVALUE_EMBED_URL', 'https://casevalue.law/embed.js' );

// ============================================================================
// CASE TYPE OPTIONS
// ============================================================================
function casevalue_get_case_types() {
    return array(
        'motor'         => 'Motor Vehicle Accidents',
        'medical'       => 'Medical Malpractice',
        'premises'      => 'Premises Liability',
        'product'       => 'Product Liability',
        'wrongful_death'=> 'Wrongful Death',
        'dog_bite'      => 'Dog Bites & Animal Attacks',
        'wrongful_term' => 'Wrongful Termination',
        'wage'          => 'Wage & Hour Disputes',
        'class_action'  => 'Class Action Lawsuits',
        'insurance'     => 'Insurance Bad Faith',
        'disability'    => 'Social Security Disability',
        'professional'  => 'Professional Malpractice',
        'civil_rights'  => 'Civil Rights Violations',
        'ip'            => 'Intellectual Property',
        'workers_comp'  => "Worker's Compensation",
        'lemon_law'     => 'Lemon Law',
    );
}

function casevalue_get_states() {
    return array(
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming', 'Washington D.C.',
    );
}

// ============================================================================
// SETTINGS PAGE
// ============================================================================
add_action( 'admin_menu', 'casevalue_add_settings_page' );
add_action( 'admin_init', 'casevalue_register_settings' );

function casevalue_add_settings_page() {
    add_options_page(
        'CaseValue Calculator',
        'CaseValue Calculator',
        'manage_options',
        'casevalue-calculator',
        'casevalue_settings_page_html'
    );
}

function casevalue_register_settings() {
    register_setting( 'casevalue_settings', 'casevalue_options', array(
        'type'              => 'array',
        'sanitize_callback' => 'casevalue_sanitize_options',
        'default'           => casevalue_get_defaults(),
    ) );

    add_settings_section(
        'casevalue_main',
        'Calculator Settings',
        function () {
            echo '<p>Configure the CaseValue.law calculator embed. Use the <code>[casevalue]</code> shortcode to display the calculator on any page or post.</p>';
        },
        'casevalue-calculator'
    );

    // Intake Email
    add_settings_field( 'casevalue_intake_email', 'Lead Intake Email', 'casevalue_field_intake_email', 'casevalue-calculator', 'casevalue_main' );

    // Partner ID
    add_settings_field( 'casevalue_partner', 'Partner ID', 'casevalue_field_partner', 'casevalue-calculator', 'casevalue_main' );

    // Default State
    add_settings_field( 'casevalue_state', 'Default State', 'casevalue_field_state', 'casevalue-calculator', 'casevalue_main' );

    // Default Language
    add_settings_field( 'casevalue_lang', 'Language', 'casevalue_field_lang', 'casevalue-calculator', 'casevalue_main' );

    // Case Types
    add_settings_field( 'casevalue_case_types', 'Practice Areas', 'casevalue_field_case_types', 'casevalue-calculator', 'casevalue_main' );

    // Width
    add_settings_field( 'casevalue_width', 'Width', 'casevalue_field_width', 'casevalue-calculator', 'casevalue_main' );

    // Min Height
    add_settings_field( 'casevalue_min_height', 'Minimum Height (px)', 'casevalue_field_min_height', 'casevalue-calculator', 'casevalue_main' );

    // Branding section
    add_settings_section(
        'casevalue_branding',
        'Branding',
        function () {
            echo '<p>Customize the calculator\'s appearance to match your brand.</p>';
        },
        'casevalue-calculator'
    );

    add_settings_field( 'casevalue_accent_color', 'Accent Color', 'casevalue_field_accent_color', 'casevalue-calculator', 'casevalue_branding' );
    add_settings_field( 'casevalue_logo_url', 'Logo URL', 'casevalue_field_logo_url', 'casevalue-calculator', 'casevalue_branding' );
    add_settings_field( 'casevalue_hide_branding', 'Hide Branding', 'casevalue_field_hide_branding', 'casevalue-calculator', 'casevalue_branding' );
}

function casevalue_get_defaults() {
    return array(
        'intake_email'  => '',
        'partner'       => '',
        'state'         => '',
        'lang'          => 'en',
        'case_types'    => array(),
        'width'         => '100%',
        'min_height'    => 600,
        'accent_color'  => '',
        'logo_url'      => '',
        'hide_branding' => 0,
    );
}

function casevalue_sanitize_options( $input ) {
    $defaults  = casevalue_get_defaults();
    $sanitized = array();

    $sanitized['intake_email'] = isset( $input['intake_email'] ) ? sanitize_email( $input['intake_email'] ) : $defaults['intake_email'];
    $sanitized['partner']      = isset( $input['partner'] ) ? sanitize_text_field( $input['partner'] ) : $defaults['partner'];
    $sanitized['state']        = isset( $input['state'] ) ? sanitize_text_field( $input['state'] ) : $defaults['state'];
    $sanitized['lang']         = isset( $input['lang'] ) && in_array( $input['lang'], array( 'en', 'es', 'zh' ), true ) ? $input['lang'] : $defaults['lang'];
    $sanitized['width']        = isset( $input['width'] ) ? sanitize_text_field( $input['width'] ) : $defaults['width'];
    $sanitized['min_height']   = isset( $input['min_height'] ) ? absint( $input['min_height'] ) : $defaults['min_height'];

    // Sanitize case types array
    $valid_types = array_keys( casevalue_get_case_types() );
    $sanitized['case_types'] = array();
    if ( isset( $input['case_types'] ) && is_array( $input['case_types'] ) ) {
        foreach ( $input['case_types'] as $type ) {
            $type = sanitize_text_field( $type );
            if ( in_array( $type, $valid_types, true ) ) {
                $sanitized['case_types'][] = $type;
            }
        }
    }

    // Branding options
    $sanitized['accent_color'] = '';
    if ( isset( $input['accent_color'] ) ) {
        $color = sanitize_text_field( $input['accent_color'] );
        if ( preg_match( '/^#[0-9a-fA-F]{6}$/', $color ) ) {
            $sanitized['accent_color'] = $color;
        }
    }
    $sanitized['logo_url']      = isset( $input['logo_url'] ) ? esc_url_raw( $input['logo_url'] ) : $defaults['logo_url'];
    $sanitized['hide_branding'] = isset( $input['hide_branding'] ) ? absint( $input['hide_branding'] ) : 0;

    return $sanitized;
}

// ============================================================================
// SETTINGS FIELD CALLBACKS
// ============================================================================
function casevalue_get_option( $key ) {
    $options  = get_option( 'casevalue_options', casevalue_get_defaults() );
    $defaults = casevalue_get_defaults();
    return isset( $options[ $key ] ) ? $options[ $key ] : $defaults[ $key ];
}

function casevalue_field_intake_email() {
    $value = casevalue_get_option( 'intake_email' );
    printf(
        '<input type="email" name="casevalue_options[intake_email]" value="%s" class="regular-text" placeholder="intake@yourfirm.com" />',
        esc_attr( $value )
    );
    echo '<p class="description">Leads from the calculator will be emailed to this address in real-time.</p>';
}

function casevalue_field_partner() {
    $value = casevalue_get_option( 'partner' );
    printf(
        '<input type="text" name="casevalue_options[partner]" value="%s" class="regular-text" placeholder="your-firm-name" />',
        esc_attr( $value )
    );
    echo '<p class="description">A unique identifier for your firm. Used for lead attribution.</p>';
}

function casevalue_field_state() {
    $value  = casevalue_get_option( 'state' );
    $states = casevalue_get_states();
    echo '<select name="casevalue_options[state]">';
    printf( '<option value="">— Let visitors choose —</option>' );
    foreach ( $states as $state ) {
        printf(
            '<option value="%s"%s>%s</option>',
            esc_attr( $state ),
            selected( $value, $state, false ),
            esc_html( $state )
        );
    }
    echo '</select>';
    echo '<p class="description">Pre-select a state to skip the state selection screen.</p>';
}

function casevalue_field_lang() {
    $value = casevalue_get_option( 'lang' );
    $langs = array( 'en' => 'English', 'es' => 'Spanish', 'zh' => 'Chinese' );
    echo '<select name="casevalue_options[lang]">';
    foreach ( $langs as $code => $label ) {
        printf(
            '<option value="%s"%s>%s</option>',
            esc_attr( $code ),
            selected( $value, $code, false ),
            esc_html( $label )
        );
    }
    echo '</select>';
}

function casevalue_field_case_types() {
    $selected = casevalue_get_option( 'case_types' );
    $types    = casevalue_get_case_types();
    echo '<fieldset>';
    echo '<p class="description" style="margin-bottom:8px">Select which practice areas to show. Leave all unchecked to show all 16.</p>';
    foreach ( $types as $id => $name ) {
        $checked = in_array( $id, $selected, true ) ? ' checked' : '';
        printf(
            '<label style="display:block;margin-bottom:4px"><input type="checkbox" name="casevalue_options[case_types][]" value="%s"%s /> %s</label>',
            esc_attr( $id ),
            $checked,
            esc_html( $name )
        );
    }
    echo '</fieldset>';
}

function casevalue_field_width() {
    $value = casevalue_get_option( 'width' );
    printf(
        '<input type="text" name="casevalue_options[width]" value="%s" class="small-text" placeholder="100%%" />',
        esc_attr( $value )
    );
    echo '<p class="description">Any CSS width value (e.g., 100%, 800px).</p>';
}

function casevalue_field_min_height() {
    $value = casevalue_get_option( 'min_height' );
    printf(
        '<input type="number" name="casevalue_options[min_height]" value="%s" class="small-text" min="300" step="50" />',
        esc_attr( $value )
    );
    echo '<p class="description">Minimum height in pixels. The calculator auto-resizes above this value.</p>';
}

function casevalue_field_accent_color() {
    $value = casevalue_get_option( 'accent_color' );
    printf(
        '<input type="text" name="casevalue_options[accent_color]" value="%s" class="small-text" placeholder="#3B82F6" />',
        esc_attr( $value )
    );
    echo '<p class="description">Hex color code for buttons and highlights (e.g., #3B82F6). Leave blank for default gold.</p>';
}

function casevalue_field_logo_url() {
    $value = casevalue_get_option( 'logo_url' );
    printf(
        '<input type="url" name="casevalue_options[logo_url]" value="%s" class="regular-text" placeholder="https://yourfirm.com/logo.png" />',
        esc_attr( $value )
    );
    echo '<p class="description">URL to your logo image. Replaces the CaseValue logo on the loading screen.</p>';
}

function casevalue_field_hide_branding() {
    $value = casevalue_get_option( 'hide_branding' );
    printf(
        '<label><input type="checkbox" name="casevalue_options[hide_branding]" value="1"%s /> Hide the "Powered by CaseValue.law" footer</label>',
        checked( $value, 1, false )
    );
}

// ============================================================================
// SETTINGS PAGE HTML
// ============================================================================
function casevalue_settings_page_html() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    $intake_email = casevalue_get_option( 'intake_email' );
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

        <?php if ( empty( $intake_email ) ) : ?>
        <div class="notice notice-warning">
            <p><strong>Action required:</strong> Set your Lead Intake Email below so calculator leads are emailed to your firm.</p>
        </div>
        <?php endif; ?>

        <?php settings_errors(); ?>

        <form action="options.php" method="post">
            <?php
            settings_fields( 'casevalue_settings' );
            do_settings_sections( 'casevalue-calculator' );
            submit_button( 'Save Settings' );
            ?>
        </form>

        <hr />
        <h2>Shortcode Usage</h2>
        <p>Add the calculator to any page or post using:</p>
        <code>[casevalue]</code>
        <p style="margin-top:12px">Override settings per shortcode:</p>
        <code>[casevalue case_types="motor,medical" state="California" lang="es"]</code>
        <p style="margin-top:12px">With custom branding:</p>
        <code>[casevalue accent_color="#3B82F6" hide_branding="1"]</code>
        <p style="margin-top:16px">
            <a href="https://casevalue.law/embed/docs" target="_blank" rel="noopener noreferrer">Full documentation &rarr;</a>
        </p>
    </div>
    <?php
}

// ============================================================================
// PLUGIN ACTION LINKS
// ============================================================================
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'casevalue_settings_link' );

function casevalue_settings_link( $links ) {
    $settings_link = sprintf(
        '<a href="%s">Settings</a>',
        esc_url( admin_url( 'options-general.php?page=casevalue-calculator' ) )
    );
    array_unshift( $links, $settings_link );
    return $links;
}

// ============================================================================
// SHORTCODE
// ============================================================================
add_shortcode( 'casevalue', 'casevalue_shortcode' );

function casevalue_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'intake_email'  => '',
        'case_type'     => '',
        'case_types'    => '',
        'state'         => '',
        'lang'          => '',
        'partner'       => '',
        'width'         => '',
        'min_height'    => '',
        'accent_color'  => '',
        'logo_url'      => '',
        'hide_branding' => '',
    ), $atts, 'casevalue' );

    // Merge with saved settings (shortcode attrs override)
    $intake_email = ! empty( $atts['intake_email'] ) ? $atts['intake_email'] : casevalue_get_option( 'intake_email' );
    $partner      = ! empty( $atts['partner'] ) ? $atts['partner'] : casevalue_get_option( 'partner' );
    $state        = ! empty( $atts['state'] ) ? $atts['state'] : casevalue_get_option( 'state' );
    $lang         = ! empty( $atts['lang'] ) ? $atts['lang'] : casevalue_get_option( 'lang' );
    $width        = ! empty( $atts['width'] ) ? $atts['width'] : casevalue_get_option( 'width' );
    $min_height   = ! empty( $atts['min_height'] ) ? absint( $atts['min_height'] ) : casevalue_get_option( 'min_height' );

    // Case types: shortcode single > shortcode multi > saved settings
    $case_type  = sanitize_text_field( $atts['case_type'] );
    $case_types = ! empty( $atts['case_types'] ) ? $atts['case_types'] : implode( ',', casevalue_get_option( 'case_types' ) );

    // Build data attributes
    $data_attrs = '';
    if ( ! empty( $case_type ) ) {
        $data_attrs .= sprintf( ' data-case-type="%s"', esc_attr( $case_type ) );
    }
    if ( ! empty( $case_types ) ) {
        $data_attrs .= sprintf( ' data-case-types="%s"', esc_attr( $case_types ) );
    }
    if ( ! empty( $state ) ) {
        $data_attrs .= sprintf( ' data-state="%s"', esc_attr( $state ) );
    }
    if ( ! empty( $lang ) ) {
        $data_attrs .= sprintf( ' data-lang="%s"', esc_attr( $lang ) );
    }
    if ( ! empty( $partner ) ) {
        $data_attrs .= sprintf( ' data-partner="%s"', esc_attr( $partner ) );
    }
    if ( ! empty( $intake_email ) ) {
        $data_attrs .= sprintf( ' data-intake-email="%s"', esc_attr( $intake_email ) );
    }
    if ( ! empty( $width ) && '100%' !== $width ) {
        $data_attrs .= sprintf( ' data-width="%s"', esc_attr( $width ) );
    }
    if ( ! empty( $min_height ) && 600 !== $min_height ) {
        $data_attrs .= sprintf( ' data-min-height="%s"', esc_attr( $min_height ) );
    }

    // Branding attributes
    $accent_color  = ! empty( $atts['accent_color'] ) ? $atts['accent_color'] : casevalue_get_option( 'accent_color' );
    $logo_url      = ! empty( $atts['logo_url'] ) ? $atts['logo_url'] : casevalue_get_option( 'logo_url' );
    $hide_branding = ! empty( $atts['hide_branding'] ) ? $atts['hide_branding'] : casevalue_get_option( 'hide_branding' );

    if ( ! empty( $accent_color ) ) {
        $data_attrs .= sprintf( ' data-accent-color="%s"', esc_attr( $accent_color ) );
    }
    if ( ! empty( $logo_url ) ) {
        $data_attrs .= sprintf( ' data-logo-url="%s"', esc_attr( $logo_url ) );
    }
    if ( ! empty( $hide_branding ) ) {
        $data_attrs .= ' data-hide-branding="true"';
    }

    // Generate a unique ID for this instance
    $id = 'casevalue-' . wp_unique_id();

    // Output the embed script
    $output  = sprintf( '<div id="%s" class="casevalue-calculator-wrapper">', esc_attr( $id ) );
    $output .= sprintf(
        '<script src="%s"%s></script>',
        esc_url( CASEVALUE_EMBED_URL ),
        $data_attrs
    );
    $output .= '</div>';

    return $output;
}
