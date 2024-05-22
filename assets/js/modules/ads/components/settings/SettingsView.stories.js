/**
 * Ads SettingsView component stories.
 *
 * Site Kit by Google, Copyright 2024 Google LLC
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
import SettingsView from './SettingsView';
import { Cell, Grid, Row } from '../../../../material-components';
import { MODULES_ADS } from '../../datastore/constants';
import { CORE_SITE } from '../../../../googlesitekit/datastore/site/constants';
import { provideModules } from '../../../../../../tests/js/utils';
import WithRegistrySetup from '../../../../../../tests/js/WithRegistrySetup';

function Template( {} ) {
	return (
		<div className="googlesitekit-layout">
			<div className="googlesitekit-settings-module googlesitekit-settings-module--active googlesitekit-settings-module--analytics">
				<div className="googlesitekit-settings-module__content googlesitekit-settings-module__content--open">
					<Grid>
						<Row>
							<Cell size={ 12 }>
								<SettingsView />
							</Cell>
						</Row>
					</Grid>
				</div>
			</div>
		</div>
	);
}

export const Default = Template.bind( null );
Default.storyName = 'Default';
Default.scenario = {
	label: 'Modules/Ads/Settings/SettingsView',
	delay: 250,
};

export default {
	title: 'Modules/Ads/Settings/SettingsView',
	decorators: [
		( Story ) => {
			const setupRegistry = ( registry ) => {
				provideModules( registry, [
					{
						slug: 'ads',
						active: true,
						connected: true,
					},
				] );

				registry.dispatch( MODULES_ADS ).receiveGetSettings( {
					conversionID: 'AW-123456789',
				} );
			};

			return (
				<WithRegistrySetup func={ setupRegistry }>
					<Story />
				</WithRegistrySetup>
			);
		},
	],
};

export const PaxConnected = Template.bind( null );
PaxConnected.storyName = 'With PAX onboarding';
PaxConnected.scenario = {
	label: 'Modules/Ads/Settings/SettingsView/PAX',
	delay: 250,
};
PaxConnected.parameters = {
	features: [ 'adsPax' ],
};
PaxConnected.decorators = [
	( Story, { parameters } ) => {
		const setupRegistry = ( registry ) => {
			// Unset the value set in the prrevious scenario.
			registry.dispatch( MODULES_ADS ).setConversionID( null );

			registry.dispatch( MODULES_ADS ).receiveGetSettings( {
				paxConversionID: 'AW-54321',
				extCustomerID: 'C-872756827HGFSD',
			} );
		};

		return (
			<WithRegistrySetup
				func={ setupRegistry }
				features={ parameters.features || [] }
			>
				<Story />
			</WithRegistrySetup>
		);
	},
];

export const IceEnabled = Template.bind( null );
IceEnabled.storyName = 'With ICE enabled';
IceEnabled.scenario = {
	label: 'Modules/Ads/Settings/SettingsView/ICE/Enabled',
	delay: 250,
};
IceEnabled.parameters = {
	features: [ 'conversionInfra' ],
};
IceEnabled.decorators = [
	( Story, { parameters } ) => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( MODULES_ADS ).setConversionID( 'AW-12345' );
			registry.dispatch( CORE_SITE ).setConversionTrackingEnabled( true );
		};

		return (
			<WithRegistrySetup
				func={ setupRegistry }
				features={ parameters.features || [] }
			>
				<Story />
			</WithRegistrySetup>
		);
	},
];

export const IceDisabled = Template.bind( null );
IceDisabled.storyName = 'With ICE disabled';
IceDisabled.scenario = {
	label: 'Modules/Ads/Settings/SettingsView/ICE/Disabled',
	delay: 250,
};
IceDisabled.parameters = {
	features: [ 'conversionInfra' ],
};
IceDisabled.decorators = [
	( Story, { parameters } ) => {
		const setupRegistry = ( registry ) => {
			registry.dispatch( MODULES_ADS ).setConversionID( 'AW-12345' );
			registry
				.dispatch( CORE_SITE )
				.setConversionTrackingEnabled( false );
		};

		return (
			<WithRegistrySetup
				func={ setupRegistry }
				features={ parameters.features || [] }
			>
				<Story />
			</WithRegistrySetup>
		);
	},
];
