/**
 * `modules/analytics-4` data store: audiences tests.
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
import {
	createTestRegistry,
	untilResolved,
} from '../../../../../tests/js/utils';
import {
	AUDIENCE_FILTER_CLAUSE_TYPE_ENUM,
	AUDIENCE_FILTER_SCOPE_ENUM,
	MODULES_ANALYTICS_4,
} from './constants';
import {
	audiences as audiencesFixture,
	availableAudiences as availableAudiencesFixture,
} from './__fixtures__';

describe( 'modules/analytics-4 audiences', () => {
	let registry;

	const getAudiencesEndpoint = new RegExp(
		'^/google-site-kit/v1/modules/analytics-4/data/audiences'
	);
	const createAudienceEndpoint = new RegExp(
		'^/google-site-kit/v1/modules/analytics-4/data/create-audience'
	);
	const syncAvailableAudiencesEndpoint = new RegExp(
		'^/google-site-kit/v1/modules/analytics-4/data/sync-audiences'
	);

	const audience = {
		displayName: 'Recently active users',
		description: 'Users that have been active in a recent period',
		membershipDurationDays: 30,
		filterClauses: [
			{
				clauseType: AUDIENCE_FILTER_CLAUSE_TYPE_ENUM.INCLUDE,
				simpleFilter: {
					scope: AUDIENCE_FILTER_SCOPE_ENUM.AUDIENCE_FILTER_SCOPE_ACROSS_ALL_SESSIONS,
					filterExpression: {
						andGroup: {
							filterExpressions: [
								{
									orGroup: {
										filterExpressions: [
											{
												dimensionOrMetricFilter: {
													atAnyPointInTime: null,
													fieldName: 'newVsReturning',
													inAnyNDayPeriod: null,
													stringFilter: {
														caseSensitive: null,
														matchType: 'EXACT',
														value: 'new',
													},
												},
											},
										],
									},
								},
							],
						},
					},
				},
			},
		],
	};

	let store;

	beforeEach( () => {
		registry = createTestRegistry();
		store = registry.stores[ MODULES_ANALYTICS_4 ].store;
	} );

	describe( 'actions', () => {
		describe( 'createAudience', () => {
			it( 'should require a valid audience object', () => {
				expect( () =>
					registry
						.dispatch( MODULES_ANALYTICS_4 )
						.createAudience( [] )
				).toThrow( 'Audience must be an object.' );
			} );

			it( 'should contain only valid keys', () => {
				expect( () =>
					registry.dispatch( MODULES_ANALYTICS_4 ).createAudience( {
						displayName: 'Recently active users',
						description:
							'Users that have been active in a recent period',
						membershipDurationDays: 30,
						randomKey: '',
						filterClauses: [],
					} )
				).toThrow(
					'Audience object must contain only valid keys. Invalid key: "randomKey"'
				);
			} );

			it( 'should contain all required keys', () => {
				expect( () =>
					registry.dispatch( MODULES_ANALYTICS_4 ).createAudience( {
						displayName: 'Recently active users',
						membershipDurationDays: 30,
						filterClauses: [],
					} )
				).toThrow(
					'Audience object must contain required keys. Missing key: "description"'
				);
			} );

			it( 'should contain filterClauses property as an array', () => {
				expect( () =>
					registry.dispatch( MODULES_ANALYTICS_4 ).createAudience( {
						displayName: 'Recently active users',
						membershipDurationDays: 30,
						description:
							'Users that have been active in a recent period',
						filterClauses: {},
					} )
				).toThrow(
					'filterClauses must be an array with AudienceFilterClause objects.'
				);
			} );

			it( 'creates an audience', async () => {
				fetchMock.postOnce( createAudienceEndpoint, {
					status: 200,
					body: audiencesFixture[ 2 ],
				} );

				expect( store.getState().audiences ).toBeUndefined();

				await registry
					.dispatch( MODULES_ANALYTICS_4 )
					.createAudience( audience );

				// Ensure the proper body parameters were sent.
				expect( fetchMock ).toHaveFetched( createAudienceEndpoint, {
					body: {
						data: {
							audience,
						},
					},
				} );

				expect( store.getState().audiences.length ).toBe( 1 );
				expect( store.getState().audiences[ 0 ] ).toEqual(
					audiencesFixture[ 2 ]
				);
			} );
		} );

		describe( 'syncAvailableAudiences', () => {
			const availableAudiences = [
				{
					name: 'properties/123456789/audiences/0987654321',
					displayName: 'All Users',
					description: 'All users',
					audienceType: 'DEFAULT_AUDIENCE',
					audienceSlug: 'all-users',
				},
			];

			it( 'should make a network request to sync available audiences', () => {
				fetchMock.postOnce( syncAvailableAudiencesEndpoint, {
					body: availableAudiences,
					status: 200,
				} );

				registry
					.dispatch( MODULES_ANALYTICS_4 )
					.syncAvailableAudiences();

				expect( fetchMock ).toHaveFetched(
					syncAvailableAudiencesEndpoint
				);
			} );

			it( 'should return and dispatch an error if the request fails', async () => {
				const errorResponse = {
					code: 'internal_server_error',
					message: 'Internal server error',
					data: { status: 500 },
				};

				fetchMock.post( syncAvailableAudiencesEndpoint, {
					body: errorResponse,
					status: 500,
				} );

				const { response, error } = await registry
					.dispatch( MODULES_ANALYTICS_4 )
					.syncAvailableAudiences();

				expect( response ).toBeUndefined();
				expect( error ).toEqual( errorResponse );

				expect(
					registry
						.select( MODULES_ANALYTICS_4 )
						.getErrorForAction( 'syncAvailableAudiences' )
				).toEqual( errorResponse );

				expect( console ).toHaveErrored();
			} );

			it( 'should return the available audiences and update the `availableAudiences` datastore module setting value on success', async () => {
				fetchMock.postOnce( syncAvailableAudiencesEndpoint, {
					body: availableAudiences,
					status: 200,
				} );

				const { response, error } = await registry
					.dispatch( MODULES_ANALYTICS_4 )
					.syncAvailableAudiences();

				expect( response ).toEqual( availableAudiences );
				expect( error ).toBeUndefined();

				expect(
					registry
						.select( MODULES_ANALYTICS_4 )
						.getAvailableAudiences()
				).toEqual( availableAudiences );
			} );
		} );
	} );

	describe( 'selectors', () => {
		const defaultAudienceResourceNames = [
			'properties/12345/audiences/1', // All visitors.
			'properties/12345/audiences/2', // Purchasers.
		];

		const siteKitAudienceResourceNames = [
			'properties/12345/audiences/3', // New visitors.
			'properties/12345/audiences/4', // Returning visitors.
		];

		const userAudienceResourceNames = [
			'properties/12345/audiences/5', // Test audience.
		];

		describe( 'getAudiences', () => {
			it( 'should use a resolver to make a network request if data is not available', async () => {
				fetchMock.get( getAudiencesEndpoint, {
					body: { audiences: audiencesFixture },
				} );

				const initialAudiences = registry
					.select( MODULES_ANALYTICS_4 )
					.getAudiences();

				expect( initialAudiences ).toBeUndefined();

				await untilResolved(
					registry,
					MODULES_ANALYTICS_4
				).getAudiences();

				const finalAudiences = registry
					.select( MODULES_ANALYTICS_4 )
					.getAudiences();

				expect( finalAudiences ).toEqual( audiencesFixture );
			} );

			it( 'should not make a network request if properties for this account are already present', async () => {
				registry
					.dispatch( MODULES_ANALYTICS_4 )
					.receiveGetAudiences( { audiences: audiencesFixture } );

				const audiences = registry
					.select( MODULES_ANALYTICS_4 )
					.getAudiences();

				await untilResolved(
					registry,
					MODULES_ANALYTICS_4
				).getAudiences();

				expect( fetchMock ).not.toHaveFetched( getAudiencesEndpoint );
				expect( audiences ).toEqual( audiencesFixture );
			} );
		} );

		describe( 'isDefaultAudience', () => {
			it( 'should return `true` if the audience is a default audience', () => {
				registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {
					availableAudiences: availableAudiencesFixture,
				} );

				defaultAudienceResourceNames.forEach(
					( audienceResourceName ) => {
						const isDefaultAudience = registry
							.select( MODULES_ANALYTICS_4 )
							.isDefaultAudience( audienceResourceName );

						expect( isDefaultAudience ).toBe( true );
					}
				);
			} );

			it( 'should return `false` if the audience is not a default audience', () => {
				registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {
					availableAudiences: availableAudiencesFixture,
				} );

				[
					...siteKitAudienceResourceNames,
					...userAudienceResourceNames,
				].forEach( ( audienceResourceName ) => {
					const isDefaultAudience = registry
						.select( MODULES_ANALYTICS_4 )
						.isDefaultAudience( audienceResourceName );

					expect( isDefaultAudience ).toBe( false );
				} );
			} );

			it( 'should return `undefined` if the available audiences are not loaded', () => {
				registry
					.dispatch( MODULES_ANALYTICS_4 )
					.receiveGetSettings( {} );

				const isDefaultAudience = registry
					.select( MODULES_ANALYTICS_4 )
					.isDefaultAudience( defaultAudienceResourceNames[ 0 ] );

				expect( isDefaultAudience ).toBeUndefined();
			} );
		} );

		describe( 'isSiteKitAudience', () => {
			it( 'should return `true` if the audience is a Site Kit audience', () => {
				registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {
					availableAudiences: availableAudiencesFixture,
				} );

				siteKitAudienceResourceNames.forEach(
					( audienceResourceName ) => {
						const isSiteKitAudience = registry
							.select( MODULES_ANALYTICS_4 )
							.isSiteKitAudience( audienceResourceName );

						expect( isSiteKitAudience ).toBe( true );
					}
				);
			} );

			it( 'should return `false` if the audience is not a Site Kit audience', () => {
				registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {
					availableAudiences: availableAudiencesFixture,
				} );

				[
					...defaultAudienceResourceNames,
					...userAudienceResourceNames,
				].forEach( ( audienceResourceName ) => {
					const isSiteKitAudience = registry
						.select( MODULES_ANALYTICS_4 )
						.isSiteKitAudience( audienceResourceName );

					expect( isSiteKitAudience ).toBe( false );
				} );
			} );

			it( 'should return `undefined` if the available audiences are not loaded', () => {
				registry
					.dispatch( MODULES_ANALYTICS_4 )
					.receiveGetSettings( {} );

				const isSiteKitAudience = registry
					.select( MODULES_ANALYTICS_4 )
					.isSiteKitAudience( siteKitAudienceResourceNames[ 0 ] );

				expect( isSiteKitAudience ).toBeUndefined();
			} );
		} );

		describe( 'isUserAudience', () => {
			it( 'should return `true` if the audience is a user audience', () => {
				registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {
					availableAudiences: availableAudiencesFixture,
				} );

				userAudienceResourceNames.forEach( ( audienceResourceName ) => {
					const isUserAudience = registry
						.select( MODULES_ANALYTICS_4 )
						.isUserAudience( audienceResourceName );

					expect( isUserAudience ).toBe( true );
				} );
			} );

			it( 'should return `false` if the audience is not a user audience', () => {
				registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {
					availableAudiences: availableAudiencesFixture,
				} );

				[
					...defaultAudienceResourceNames,
					...siteKitAudienceResourceNames,
				].forEach( ( audienceResourceName ) => {
					const isUserAudience = registry
						.select( MODULES_ANALYTICS_4 )
						.isUserAudience( audienceResourceName );

					expect( isUserAudience ).toBe( false );
				} );
			} );

			it( 'should return `undefined` if the available audiences are not loaded', () => {
				registry
					.dispatch( MODULES_ANALYTICS_4 )
					.receiveGetSettings( {} );

				const isUserAudience = registry
					.select( MODULES_ANALYTICS_4 )
					.isUserAudience( userAudienceResourceNames[ 0 ] );

				expect( isUserAudience ).toBeUndefined();
			} );
		} );
	} );
} );
