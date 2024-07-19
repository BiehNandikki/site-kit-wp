/**
 * Reader Revenue Manager SettingsEdit component stories.
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
import { MODULES_READER_REVENUE_MANAGER } from '../../datastore/constants';
import SettingsEdit from './SettingsEdit';
import WithRegistrySetup from '../../../../../../tests/js/WithRegistrySetup';
import { publications } from '../../datastore/__fixtures__';

function Template() {
	return <SettingsEdit />;
}

export const Default = Template.bind( {} );
Default.storyName = 'Default';
Default.scenario = {
	label: 'Modules/ReaderRevenueManager/Components/Settings/SettingsEdit/Default',
};

export const PublicationSelected = Template.bind( {} );
PublicationSelected.storyName = 'PublicationSelected';
PublicationSelected.scenario = {
	label: 'Modules/ReaderRevenueManager/Components/Settings/SettingsEdit/PublicationSelected',
};
PublicationSelected.args = {
	setupRegistry: ( registry ) => {
		const publication = publications[ 0 ];
		const {
			// eslint-disable-next-line sitekit/acronym-case
			publicationId: publicationID,
			onboardingState: publicationOnboardingState,
		} = publication;

		registry
			.dispatch( MODULES_READER_REVENUE_MANAGER )
			.receiveGetSettings( {
				publicationID,
				publicationOnboardingState,
				publicationOnboardingStateLastSyncedAtMs: 0,
			} );
	},
};

export const PublicationSelectedWithOnboardingStateNotice = Template.bind( {} );
PublicationSelectedWithOnboardingStateNotice.storyName =
	'PublicationSelectedWithOnboardingStateNotice';
PublicationSelectedWithOnboardingStateNotice.scenario = {
	label: 'Modules/ReaderRevenueManager/Components/Settings/SettingsEdit/PublicationSelectedWithOnboardingStateNotice',
};
PublicationSelectedWithOnboardingStateNotice.args = {
	setupRegistry: ( registry ) => {
		const publication = publications[ 2 ];
		const {
			// eslint-disable-next-line sitekit/acronym-case
			publicationId: publicationID,
			onboardingState: publicationOnboardingState,
		} = publication;

		registry
			.dispatch( MODULES_READER_REVENUE_MANAGER )
			.receiveGetSettings( {
				publicationID,
				publicationOnboardingState,
				publicationOnboardingStateLastSyncedAtMs: 0,
			} );
	},
};

export default {
	title: 'Modules/ReaderRevenueManager/Components/Settings/SettingsEdit',
	decorators: [
		( Story, { args } ) => {
			const setupRegistry = ( registry ) => {
				registry
					.dispatch( MODULES_READER_REVENUE_MANAGER )
					.receiveGetPublications( publications );

				if ( args.setupRegistry ) {
					args.setupRegistry( registry );
				}
			};

			return (
				<WithRegistrySetup func={ setupRegistry }>
					<Story />
				</WithRegistrySetup>
			);
		},
	],
};
