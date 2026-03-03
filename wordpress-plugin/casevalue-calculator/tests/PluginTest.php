<?php

declare(strict_types=1);

namespace CaseValue\Tests;

use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use PHPUnit\Framework\TestCase;

class PluginTest extends TestCase
{
    use MockeryPHPUnitIntegration;

    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();

        // Stub WordPress functions used at file-load time
        Functions\stubs([
            'add_action'   => null,
            'add_filter'   => null,
            'add_shortcode'=> null,
            'plugin_basename' => function ($file) { return basename(dirname($file)) . '/' . basename($file); },
        ]);

        // Load the plugin file (only once)
        if ( ! function_exists('casevalue_get_case_types') ) {
            require_once dirname(__DIR__) . '/casevalue-calculator.php';
        }
    }

    protected function tearDown(): void
    {
        Monkey\tearDown();
        parent::tearDown();
    }

    // =========================================================================
    // casevalue_get_case_types()
    // =========================================================================

    public function test_get_case_types_returns_16_types(): void
    {
        $types = casevalue_get_case_types();
        $this->assertCount(16, $types);
    }

    public function test_get_case_types_keys_are_valid_ids(): void
    {
        $expected = [
            'motor', 'medical', 'premises', 'product', 'wrongful_death',
            'dog_bite', 'wrongful_term', 'wage', 'class_action', 'insurance',
            'disability', 'professional', 'civil_rights', 'ip', 'workers_comp',
            'lemon_law',
        ];
        $types = casevalue_get_case_types();
        $this->assertSame($expected, array_keys($types));
    }

    // =========================================================================
    // casevalue_get_states()
    // =========================================================================

    public function test_get_states_returns_51_entries(): void
    {
        // 50 states + Washington D.C.
        $states = casevalue_get_states();
        $this->assertCount(51, $states);
    }

    public function test_get_states_includes_dc(): void
    {
        $states = casevalue_get_states();
        $this->assertContains('Washington D.C.', $states);
    }

    // =========================================================================
    // casevalue_get_defaults()
    // =========================================================================

    public function test_defaults_structure(): void
    {
        $defaults = casevalue_get_defaults();

        $this->assertArrayHasKey('intake_email', $defaults);
        $this->assertArrayHasKey('partner', $defaults);
        $this->assertArrayHasKey('state', $defaults);
        $this->assertArrayHasKey('lang', $defaults);
        $this->assertArrayHasKey('case_types', $defaults);
        $this->assertArrayHasKey('width', $defaults);
        $this->assertArrayHasKey('min_height', $defaults);
        $this->assertArrayHasKey('accent_color', $defaults);
        $this->assertArrayHasKey('logo_url', $defaults);
        $this->assertArrayHasKey('hide_branding', $defaults);
    }

    public function test_defaults_values(): void
    {
        $defaults = casevalue_get_defaults();

        $this->assertSame('', $defaults['intake_email']);
        $this->assertSame('en', $defaults['lang']);
        $this->assertSame('100%', $defaults['width']);
        $this->assertSame(600, $defaults['min_height']);
        $this->assertSame([], $defaults['case_types']);
        $this->assertSame('', $defaults['accent_color']);
        $this->assertSame('', $defaults['logo_url']);
        $this->assertSame(0, $defaults['hide_branding']);
    }

    // =========================================================================
    // casevalue_sanitize_options()
    // =========================================================================

    public function test_sanitize_valid_email(): void
    {
        Functions\expect('sanitize_email')
            ->once()
            ->with('test@example.com')
            ->andReturn('test@example.com');
        Functions\stubs([
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
        ]);

        $result = casevalue_sanitize_options([
            'intake_email' => 'test@example.com',
        ]);

        $this->assertSame('test@example.com', $result['intake_email']);
    }

    public function test_sanitize_valid_accent_color(): void
    {
        Functions\stubs([
            'sanitize_email'      => function ($v) { return $v; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
            'esc_url_raw'         => function ($v) { return $v; },
        ]);

        $result = casevalue_sanitize_options([
            'accent_color' => '#3B82F6',
        ]);
        $this->assertSame('#3B82F6', $result['accent_color']);
    }

    public function test_sanitize_invalid_accent_color_rejected(): void
    {
        Functions\stubs([
            'sanitize_email'      => function ($v) { return $v; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
            'esc_url_raw'         => function ($v) { return $v; },
        ]);

        // Not a valid hex
        $result = casevalue_sanitize_options([
            'accent_color' => 'red',
        ]);
        $this->assertSame('', $result['accent_color']);

        // Too short
        $result = casevalue_sanitize_options([
            'accent_color' => '#F00',
        ]);
        $this->assertSame('', $result['accent_color']);

        // XSS attempt
        $result = casevalue_sanitize_options([
            'accent_color' => '#3B82F6"><script>',
        ]);
        $this->assertSame('', $result['accent_color']);
    }

    public function test_sanitize_valid_case_types(): void
    {
        Functions\stubs([
            'sanitize_email'      => function ($v) { return $v; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
            'esc_url_raw'         => function ($v) { return $v; },
        ]);

        $result = casevalue_sanitize_options([
            'case_types' => ['motor', 'medical', 'fake_type'],
        ]);

        $this->assertSame(['motor', 'medical'], $result['case_types']);
        $this->assertNotContains('fake_type', $result['case_types']);
    }

    public function test_sanitize_invalid_lang_falls_to_default(): void
    {
        Functions\stubs([
            'sanitize_email'      => function ($v) { return $v; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
            'esc_url_raw'         => function ($v) { return $v; },
        ]);

        $result = casevalue_sanitize_options([
            'lang' => 'fr',
        ]);
        $this->assertSame('en', $result['lang']);
    }

    public function test_sanitize_valid_langs(): void
    {
        Functions\stubs([
            'sanitize_email'      => function ($v) { return $v; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
            'esc_url_raw'         => function ($v) { return $v; },
        ]);

        foreach (['en', 'es', 'zh'] as $lang) {
            $result = casevalue_sanitize_options(['lang' => $lang]);
            $this->assertSame($lang, $result['lang'], "Lang '$lang' should be accepted");
        }
    }

    public function test_sanitize_min_height_is_absolute_int(): void
    {
        Functions\stubs([
            'sanitize_email'      => function ($v) { return $v; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
            'esc_url_raw'         => function ($v) { return $v; },
            'absint'              => function ($v) { return abs((int) $v); },
        ]);

        $result = casevalue_sanitize_options([
            'min_height' => '-500',
        ]);
        $this->assertSame(500, $result['min_height']);
    }

    public function test_sanitize_logo_url(): void
    {
        Functions\stubs([
            'sanitize_email'      => function ($v) { return $v; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
            'esc_url_raw'         => function ($v) { return filter_var($v, FILTER_VALIDATE_URL) ? $v : ''; },
        ]);

        $result = casevalue_sanitize_options([
            'logo_url' => 'https://example.com/logo.png',
        ]);
        $this->assertSame('https://example.com/logo.png', $result['logo_url']);
    }

    public function test_sanitize_hide_branding(): void
    {
        Functions\stubs([
            'sanitize_email'      => function ($v) { return $v; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
            'esc_url_raw'         => function ($v) { return $v; },
            'absint'              => function ($v) { return abs((int) $v); },
        ]);

        $result = casevalue_sanitize_options(['hide_branding' => '1']);
        $this->assertSame(1, $result['hide_branding']);

        $result = casevalue_sanitize_options(['hide_branding' => '0']);
        $this->assertSame(0, $result['hide_branding']);
    }

    // =========================================================================
    // casevalue_shortcode()
    // =========================================================================

    public function test_shortcode_output_contains_script_tag(): void
    {
        Functions\stubs([
            'shortcode_atts' => function ($defaults, $atts) {
                return array_merge($defaults, array_filter($atts, function($v) { return $v !== ''; }));
            },
            'get_option'       => function () { return casevalue_get_defaults(); },
            'esc_attr'         => function ($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); },
            'esc_url'          => function ($v) { return $v; },
            'wp_unique_id'     => function () { return '123'; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
        ]);

        $output = casevalue_shortcode([]);

        $this->assertStringContainsString('<script src="https://casevalue.law/embed.js"', $output);
        $this->assertStringContainsString('id="casevalue-123"', $output);
        $this->assertStringContainsString('class="casevalue-calculator-wrapper"', $output);
    }

    public function test_shortcode_with_case_type(): void
    {
        Functions\stubs([
            'shortcode_atts' => function ($defaults, $atts) {
                return array_merge($defaults, array_filter($atts, function($v) { return $v !== ''; }));
            },
            'get_option'       => function () { return casevalue_get_defaults(); },
            'esc_attr'         => function ($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); },
            'esc_url'          => function ($v) { return $v; },
            'wp_unique_id'     => function () { return '456'; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
        ]);

        $output = casevalue_shortcode(['case_type' => 'motor']);

        $this->assertStringContainsString('data-case-type="motor"', $output);
    }

    public function test_shortcode_with_state(): void
    {
        Functions\stubs([
            'shortcode_atts' => function ($defaults, $atts) {
                return array_merge($defaults, array_filter($atts, function($v) { return $v !== ''; }));
            },
            'get_option'       => function () { return casevalue_get_defaults(); },
            'esc_attr'         => function ($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); },
            'esc_url'          => function ($v) { return $v; },
            'wp_unique_id'     => function () { return '789'; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
        ]);

        $output = casevalue_shortcode(['state' => 'California']);

        $this->assertStringContainsString('data-state="California"', $output);
    }

    public function test_shortcode_with_branding_options(): void
    {
        Functions\stubs([
            'shortcode_atts' => function ($defaults, $atts) {
                return array_merge($defaults, array_filter($atts, function($v) { return $v !== ''; }));
            },
            'get_option'       => function () { return casevalue_get_defaults(); },
            'esc_attr'         => function ($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); },
            'esc_url'          => function ($v) { return $v; },
            'wp_unique_id'     => function () { return '101'; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
        ]);

        $output = casevalue_shortcode([
            'accent_color'  => '#EF4444',
            'logo_url'      => 'https://firm.com/logo.png',
            'hide_branding' => '1',
        ]);

        $this->assertStringContainsString('data-accent-color="#EF4444"', $output);
        $this->assertStringContainsString('data-logo-url="https://firm.com/logo.png"', $output);
        $this->assertStringContainsString('data-hide-branding="true"', $output);
    }

    public function test_shortcode_default_width_not_emitted(): void
    {
        Functions\stubs([
            'shortcode_atts' => function ($defaults, $atts) {
                return array_merge($defaults, array_filter($atts, function($v) { return $v !== ''; }));
            },
            'get_option'       => function () { return casevalue_get_defaults(); },
            'esc_attr'         => function ($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); },
            'esc_url'          => function ($v) { return $v; },
            'wp_unique_id'     => function () { return '102'; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
        ]);

        $output = casevalue_shortcode([]);

        // Default width (100%) and height (600) should NOT appear as data attributes
        $this->assertStringNotContainsString('data-width', $output);
        $this->assertStringNotContainsString('data-min-height', $output);
    }

    public function test_shortcode_custom_width_emitted(): void
    {
        Functions\stubs([
            'shortcode_atts' => function ($defaults, $atts) {
                return array_merge($defaults, array_filter($atts, function($v) { return $v !== ''; }));
            },
            'get_option'       => function () {
                $d = casevalue_get_defaults();
                $d['width'] = '800px';
                $d['min_height'] = 900;
                return $d;
            },
            'esc_attr'         => function ($v) { return htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8'); },
            'esc_url'          => function ($v) { return $v; },
            'wp_unique_id'     => function () { return '103'; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags((string) $v)); },
            'absint'           => function ($v) { return abs((int) $v); },
        ]);

        $output = casevalue_shortcode([]);

        $this->assertStringContainsString('data-width="800px"', $output);
        $this->assertStringContainsString('data-min-height="900"', $output);
    }

    public function test_shortcode_with_lang(): void
    {
        Functions\stubs([
            'shortcode_atts' => function ($defaults, $atts) {
                return array_merge($defaults, array_filter($atts, function($v) { return $v !== ''; }));
            },
            'get_option'       => function () { return casevalue_get_defaults(); },
            'esc_attr'         => function ($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); },
            'esc_url'          => function ($v) { return $v; },
            'wp_unique_id'     => function () { return '104'; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
        ]);

        $output = casevalue_shortcode(['lang' => 'es']);

        $this->assertStringContainsString('data-lang="es"', $output);
    }

    public function test_shortcode_with_multiple_case_types(): void
    {
        Functions\stubs([
            'shortcode_atts' => function ($defaults, $atts) {
                return array_merge($defaults, array_filter($atts, function($v) { return $v !== ''; }));
            },
            'get_option'       => function () { return casevalue_get_defaults(); },
            'esc_attr'         => function ($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); },
            'esc_url'          => function ($v) { return $v; },
            'wp_unique_id'     => function () { return '105'; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
        ]);

        $output = casevalue_shortcode(['case_types' => 'motor,medical']);

        $this->assertStringContainsString('data-case-types="motor,medical"', $output);
    }

    public function test_shortcode_escapes_html_in_attributes(): void
    {
        Functions\stubs([
            'shortcode_atts' => function ($defaults, $atts) {
                return array_merge($defaults, array_filter($atts, function($v) { return $v !== ''; }));
            },
            'get_option'       => function () { return casevalue_get_defaults(); },
            'esc_attr'         => function ($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); },
            'esc_url'          => function ($v) { return $v; },
            'wp_unique_id'     => function () { return '106'; },
            'sanitize_text_field' => function ($v) { return trim(strip_tags($v)); },
        ]);

        $output = casevalue_shortcode(['partner' => '"><script>alert(1)</script>']);

        // esc_attr should encode the quotes
        $this->assertStringNotContainsString('<script>', $output);
        $this->assertStringContainsString('&quot;', $output);
    }

    // =========================================================================
    // Constants
    // =========================================================================

    public function test_constants_defined(): void
    {
        $this->assertTrue(defined('CASEVALUE_VERSION'));
        $this->assertSame('1.0.0', CASEVALUE_VERSION);
        $this->assertTrue(defined('CASEVALUE_EMBED_URL'));
        $this->assertSame('https://casevalue.law/embed.js', CASEVALUE_EMBED_URL);
    }
}
