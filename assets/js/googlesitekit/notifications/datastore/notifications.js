/**
 * `core/notifications` data store: notifications info.
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
 * External dependencies
 */
import invariant from 'invariant';

/**
 * Internal dependencies
 */
import { createReducer } from '../../../../js/googlesitekit/data/create-reducer';
import { NOTIFICATION_AREAS, NOTIFICATION_VIEW_CONTEXTS } from './constants';

const REGISTER_NOTIFICATION = 'REGISTER_NOTIFICATION';

export const initialState = {
	notifications: {},
};

export const actions = {
	/**
	 * Registers a notification with a given `id` slug and settings.
	 *
	 * @since n.e.x.t
	 *
	 * @param {string}         id                           Notification's slug.
	 * @param {Object}         settings                     Notification's settings.
	 * @param {WPComponent}    [settings.Component]         React component used to display the contents of this notification.
	 * @param {number}         [settings.priority]          Notification's priority for ordering (lower number is higher priority, like WordPress hooks). Ideally in increments of 10. Defaul 10.
	 * @param {string}         [settings.areaSlug]          The slug of the area where the notification should be rendered, e.g. notification-area-banners-above-nav.
	 * @param {Array.<string>} [settings.viewContexts]      Array of Site Kit contexts, e.g. VIEW_CONTEXT_MAIN_DASHBOARD.
	 * @param {Function}       [settings.checkRequirements] Optional. Callback function to determine if the notification should be queued.
	 * @param {boolean}        [settings.isDismissible]     Flag to check if the notification should be queued and is not dismissed.
	 * @return {Object} Redux-style action.
	 */
	registerNotification(
		id,
		{
			Component,
			priority = 10,
			areaSlug,
			viewContexts,
			checkRequirements,
			isDismissible,
		}
	) {
		invariant( Component, 'component is required to register a widget.' );

		const notificationAreas = Object.values( NOTIFICATION_AREAS );
		invariant(
			! notificationAreas.includes( areaSlug ),
			`Notification area should be one of: ${ notificationAreas.join(
				', '
			) }, but "${ areaSlug }" was provided.`
		);

		invariant(
			( Array.isArray( viewContexts ) &&
				viewContexts.some(
					NOTIFICATION_VIEW_CONTEXTS.includes,
					NOTIFICATION_VIEW_CONTEXTS
				) ) ||
				! Array.isArray( viewContexts ),
			`Notification view context should be one of: ${ NOTIFICATION_VIEW_CONTEXTS.join(
				', '
			) }, but "${ viewContexts }" was provided.`
		);

		return {
			payload: {
				id,
				settings: {
					Component,
					priority,
					areaSlug,
					viewContexts,
					checkRequirements,
					isDismissible,
				},
			},
			type: REGISTER_NOTIFICATION,
		};
	},
};

export const controls = {};

export const reducer = createReducer( ( state, { type, payload } ) => {
	switch ( type ) {
		case REGISTER_NOTIFICATION: {
			const { id, settings } = payload;

			if ( state.notifications[ id ] !== undefined ) {
				global.console.warn(
					`Could not register notification with ID "${ id }". Notification "${ id }" is already registered.`
				);
			} else {
				state.notifications[ id ] = { ...settings, id };
			}

			break;
		}

		default:
			break;
	}
} );

export const resolvers = {};

export const selectors = {};

export default {
	initialState,
	actions,
	controls,
	reducer,
	resolvers,
	selectors,
};
