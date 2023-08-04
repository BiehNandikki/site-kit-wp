/**
 * AdBlockingRecoveryCTA component tests.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { mockLocation } from '../../../../../../tests/js/mock-browser-utils';
import {
	act,
	fireEvent,
	provideModules,
	provideSiteInfo,
	render,
} from '../../../../../../tests/js/test-utils';
import { VIEW_CONTEXT_SETTINGS } from '../../../../googlesitekit/constants';
import { CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import * as tracking from '../../../../util/tracking';
import {
	ENUM_AD_BLOCKING_RECOVERY_SETUP_STATUS,
	MODULES_ADSENSE,
} from '../../datastore/constants';
import {
	ACCOUNT_STATUS_PENDING,
	ACCOUNT_STATUS_READY,
	SITE_STATUS_ADDED,
	SITE_STATUS_READY,
} from '../../util';
import AdBlockingRecoveryCTA from './AdBlockingRecoveryCTA';

const mockTrackEvent = jest.spyOn( tracking, 'trackEvent' );
mockTrackEvent.mockImplementation( () => Promise.resolve() );

describe( 'AdBlockingRecoveryCTA', () => {
	mockLocation();

	beforeEach( () => {
		mockTrackEvent.mockClear();
	} );

	it.each( [
		[
			'Adsense account status is not ready',
			ACCOUNT_STATUS_PENDING,
			SITE_STATUS_READY,
			'',
		],
		[
			'Adsense site status is not ready',
			ACCOUNT_STATUS_READY,
			SITE_STATUS_ADDED,
			'',
		],
		[
			'Ad blocking recovery status is not an empty string',
			ACCOUNT_STATUS_READY,
			SITE_STATUS_ADDED,
			ENUM_AD_BLOCKING_RECOVERY_SETUP_STATUS.SETUP_CONFIRMED,
		],
		[
			'an existing ad blocking recovery tag is detected',
			ACCOUNT_STATUS_READY,
			SITE_STATUS_ADDED,
			ENUM_AD_BLOCKING_RECOVERY_SETUP_STATUS.SETUP_CONFIRMED,
			'pub-3467161886473746',
		],
	] )(
		'should not render the CTA when %s',
		(
			testName,
			accountStatus,
			siteStatus,
			adBlockingRecoverySetupStatus,
			existingAdBlockingRecoveryTag = null
		) => {
			const { container } = render( <AdBlockingRecoveryCTA />, {
				setupRegistry: ( registry ) => {
					provideModules( registry, [
						{
							slug: 'adsense',
							active: true,
							connected: true,
						},
					] );
					registry.dispatch( MODULES_ADSENSE ).receiveGetSettings( {
						accountStatus,
						siteStatus,
						adBlockingRecoverySetupStatus,
					} );
					registry
						.dispatch( MODULES_ADSENSE )
						.receiveGetExistingAdBlockingRecoveryTag(
							existingAdBlockingRecoveryTag
						);
				},
			} );

			expect(
				container.querySelector(
					'.googlesitekit-settings-notice-ad-blocking-recovery-cta'
				)
			).toBeNull();

			expect( container.textContent ).not.toContain(
				'Ad blocking recovery'
			);

			// If the CTA is not rendered, no tracking event should fire.
			expect( mockTrackEvent ).not.toHaveBeenCalled();
		}
	);

	it( 'should render the CTA when Ad Blocking Recovery is not set up', () => {
		const { container } = render( <AdBlockingRecoveryCTA />, {
			setupRegistry: ( registry ) => {
				provideModules( registry, [
					{
						slug: 'adsense',
						active: true,
						connected: true,
					},
				] );
				registry.dispatch( MODULES_ADSENSE ).receiveGetSettings( {
					accountStatus: ACCOUNT_STATUS_READY,
					siteStatus: SITE_STATUS_READY,
					adBlockingRecoverySetupStatus: '',
				} );
				registry
					.dispatch( MODULES_ADSENSE )
					.receiveGetExistingAdBlockingRecoveryTag( null );
			},
			viewContext: VIEW_CONTEXT_SETTINGS,
		} );

		expect(
			container.querySelector(
				'.googlesitekit-settings-notice-ad-blocking-recovery-cta'
			)
		).not.toBeNull();

		expect( container.textContent ).toContain( 'Ad blocking recovery' );
		expect( container.textContent ).toContain(
			'Start recovering revenue lost from ad blockers by deploying an ad blocking recovery message through Site Kit.'
		);

		// The tracking event should fire when the widget is rendered.
		expect( mockTrackEvent ).toHaveBeenCalledWith(
			'settings_adsense-abr-cta-widget',
			'view_notification'
		);
	} );

	it( 'Should navigate to ABR setup page when primary CTA is clicked', async () => {
		const { container, registry } = render( <AdBlockingRecoveryCTA />, {
			setupRegistry: ( testRegistry ) => {
				provideSiteInfo( testRegistry );
				provideModules( testRegistry, [
					{
						slug: 'adsense',
						active: true,
						connected: true,
					},
				] );
				testRegistry.dispatch( MODULES_ADSENSE ).receiveGetSettings( {
					accountStatus: ACCOUNT_STATUS_READY,
					siteStatus: SITE_STATUS_READY,
					adBlockingRecoverySetupStatus: '',
				} );
				testRegistry
					.dispatch( MODULES_ADSENSE )
					.receiveGetExistingAdBlockingRecoveryTag( null );
			},
			viewContext: VIEW_CONTEXT_SETTINGS,
		} );

		const abrURL = registry
			.select( CORE_SITE )
			.getAdminURL( 'googlesitekit-ad-blocking-recovery' );

		// eslint-disable-next-line require-await
		await act( async () => {
			fireEvent.click( container.querySelector( 'button.mdc-button' ) );
		} );

		// The tracking event should fire when the widget is rendered.
		expect( mockTrackEvent ).toHaveBeenCalledWith(
			'settings_adsense-abr-cta-widget',
			'confirm_notification'
		);

		expect( global.location.assign ).toHaveBeenCalled();
		expect( global.location.assign ).toHaveBeenCalledWith( abrURL );
	} );

	it( 'Should fire track event when learn more is clicked', async () => {
		const { getByRole } = render( <AdBlockingRecoveryCTA />, {
			setupRegistry: ( registry ) => {
				provideSiteInfo( registry );
				provideModules( registry, [
					{
						slug: 'adsense',
						active: true,
						connected: true,
					},
				] );
				registry.dispatch( MODULES_ADSENSE ).receiveGetSettings( {
					accountStatus: ACCOUNT_STATUS_READY,
					siteStatus: SITE_STATUS_READY,
					adBlockingRecoverySetupStatus: '',
				} );
				registry
					.dispatch( MODULES_ADSENSE )
					.receiveGetExistingAdBlockingRecoveryTag( null );
			},
			viewContext: VIEW_CONTEXT_SETTINGS,
		} );
		// eslint-disable-next-line require-await
		await act( async () => {
			fireEvent.click( getByRole( 'link', { name: /Learn more/i } ) );
		} );

		// The tracking event should fire when the CTA is clicked.
		expect( mockTrackEvent ).toHaveBeenCalledWith(
			'settings_adsense-abr-cta-widget',
			'click_learn_more_link'
		);
	} );
} );
