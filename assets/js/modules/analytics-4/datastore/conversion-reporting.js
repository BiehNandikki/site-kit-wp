/**
 * `modules/analytics-4` data store: conversion reporting.
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
import API from 'googlesitekit-api';
import { combineStores, createRegistrySelector } from 'googlesitekit-data';
import { MODULES_ANALYTICS_4 } from './constants';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';

export const selectors = {
	/**
	 * Checks whether the provided conversion reporting events are available.
	 *
	 * @since 1.135.0
	 *
	 * @param {Object}               state  Data store's state.
	 * @param {string|Array<string>} events Conversion reporting events to check.
	 * @return {(boolean|undefined)} True if all provided custom dimensions are available, otherwise false. Undefined if available custom dimensions are not loaded yet.
	 */
	hasConversionReportingEvents: createRegistrySelector(
		( select ) => ( state, events ) => {
			// Ensure events is always an array, even if a string is passed.
			const eventsToCheck = Array.isArray( events ) ? events : [ events ];

			const detectedEvents =
				select( MODULES_ANALYTICS_4 ).getDetectedEvents();

			if ( ! detectedEvents?.length ) {
				return false;
			}

			return eventsToCheck.some( ( event ) =>
				detectedEvents.includes( event )
			);
		}
	),
};

const dismissNewConversionReportingEventsStore = createFetchStore( {
	baseName: 'dismissNewConversionReportingEvents',
	controlCallback: () => {
		return API.set(
			'modules',
			'analytics-4',
			'clear-conversion-reporting-new-events'
		);
	},
} );

const dismissLostConversionReportingEventsStore = createFetchStore( {
	baseName: 'dismissLostConversionReportingEvents',
	controlCallback: () => {
		return API.set(
			'modules',
			'analytics-4',
			'clear-conversion-reporting-lost-events'
		);
	},
} );

const actions = {
	/**
	 * Dismiss new conversion reporting events.
	 *
	 * @since 1.138.0
	 *
	 * @return {boolean} Transient deletion response.
	 */
	dismissNewConversionReportingEvents() {
		return dismissNewConversionReportingEventsStore.actions.fetchDismissNewConversionReportingEvents();
	},
	/**
	 * Dismiss lost conversion reporting events.
	 *
	 * @since 1.138.0
	 *
	 * @return {boolean} Transient deletion response.
	 */
	dismissLostConversionReportingEvents() {
		return dismissLostConversionReportingEventsStore.actions.fetchDismissLostConversionReportingEvents();
	},
};

export default combineStores(
	dismissNewConversionReportingEventsStore,
	dismissLostConversionReportingEventsStore,
	{
		actions,
		selectors,
	}
);
