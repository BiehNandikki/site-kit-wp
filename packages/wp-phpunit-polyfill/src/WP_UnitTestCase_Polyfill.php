<?php
/**
 * Class Google\Site_Kit\Tests\Polyfill\WP_UnitTestCase_Polyfill.
 *
 * @package   Google\Site_Kit\Tests\Polyfill
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Tests\Polyfill;

use WP_UnitTestCase;
use Yoast\PHPUnitPolyfills\Helpers\AssertAttributeHelper;
use Yoast\PHPUnitPolyfills\Polyfills\AssertClosedResource;
use Yoast\PHPUnitPolyfills\Polyfills\AssertEqualsSpecializations;
use Yoast\PHPUnitPolyfills\Polyfills\AssertFileDirectory;
use Yoast\PHPUnitPolyfills\Polyfills\AssertFileEqualsSpecializations;
use Yoast\PHPUnitPolyfills\Polyfills\AssertionRenames;
use Yoast\PHPUnitPolyfills\Polyfills\AssertIsType;
use Yoast\PHPUnitPolyfills\Polyfills\AssertNumericType;
use Yoast\PHPUnitPolyfills\Polyfills\AssertObjectEquals;
use Yoast\PHPUnitPolyfills\Polyfills\AssertStringContains;
use Yoast\PHPUnitPolyfills\Polyfills\EqualToSpecializations;
use Yoast\PHPUnitPolyfills\Polyfills\ExpectException;
use Yoast\PHPUnitPolyfills\Polyfills\ExpectExceptionMessageMatches;
use Yoast\PHPUnitPolyfills\Polyfills\ExpectExceptionObject;
use Yoast\PHPUnitPolyfills\Polyfills\ExpectPHPException;

/* phpcs:disable Generic.Classes.DuplicateClassName.Found */

/**
 * Compatibility layer for WP_UnitTestCase < WP 5.2.
 *
 * @link https://github.com/WordPress/wordpress-develop/blob/f5e9419fd60ece7818820e7b1aecea1658964492/tests/phpunit/includes/testcase.php
 */
class WP_UnitTestCase_Polyfill extends WP_UnitTestCase {

	use AssertAttributeHelper;
	use AssertClosedResource;
	use AssertEqualsSpecializations;
	use AssertFileDirectory;
	use AssertFileEqualsSpecializations;
	use AssertionRenames;
	use AssertIsType;
	use AssertNumericType;
	use AssertObjectEquals;
	use AssertStringContains;
	use EqualToSpecializations;
	use ExpectException;
	use ExpectExceptionMessageMatches;
	use ExpectExceptionObject;
	use ExpectPHPException;

	/**
	 * Wrapper method for the `set_up_before_class()` method for forward-compatibility with WP 5.9.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();
		static::set_up_before_class();
	}

	/**
	 * Wrapper method for the `tear_down_after_class()` method for forward-compatibility with WP 5.9.
	 */
	public static function tearDownAfterClass() {
		static::tear_down_after_class();
		parent::tearDownAfterClass();
	}

	/**
	 * Wrapper method for the `set_up()` method for forward-compatibility with WP 5.9.
	 */
	public function setUp() {
		parent::setUp();
		$this->set_up();
	}

	/**
	 * Wrapper method for the `tear_down()` method for forward-compatibility with WP 5.9.
	 */
	public function tearDown() {
		$this->tear_down();
		parent::tearDown();
	}

	/**
	 * Wrapper method for the `assert_pre_conditions()` method for forward-compatibility with WP 5.9.
	 */
	protected function assertPreConditions() {
		parent::assertPreConditions();
		$this->assert_pre_conditions();
	}

	/**
	 * Wrapper method for the `assert_post_conditions()` method for forward-compatibility with WP 5.9.
	 */
	protected function assertPostConditions() {
		parent::assertPostConditions();
		$this->assert_post_conditions();
	}

	/**
	 * Placeholder method for forward-compatibility with WP 5.9.
	 */
	public static function set_up_before_class() {
	}

	/**
	 * Placeholder method for forward-compatibility with WP 5.9.
	 */
	public static function tear_down_after_class() {
	}

	/**
	 * Placeholder method for forward-compatibility with WP 5.9.
	 */
	protected function set_up() {
	}

	/**
	 * Placeholder method for forward-compatibility with WP 5.9.
	 */
	protected function tear_down() {
	}

	/**
	 * Placeholder method for forward-compatibility with WP 5.9.
	 */
	protected function assert_pre_conditions() {
	}

	/**
	 * Placeholder method for forward-compatibility with WP 5.9.
	 */
	protected function assert_post_conditions() {
	}
}
