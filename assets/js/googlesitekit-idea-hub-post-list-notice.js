/**
 * Idea Hub Post List notice.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_USER } from './googlesitekit/datastore/user/constants';
const { dispatch } = Data;

const WEEK_IN_SECONDS = 3600 * 24 * 7;

const dismissNotice = ( slug, expiresInSeconds ) => dispatch( CORE_USER ).dismissItem( slug, expiresInSeconds );

domReady( () => {
	const newNotice = document.getElementById( 'googlesitekit-notice-new' );
	const savedNotice = document.getElementById( 'googlesitekit-notice-saved' );
	let type, notice;
	if ( newNotice ) {
		type = 'new';
		notice = newNotice;
	} else if ( savedNotice ) {
		type = 'saved';
		notice = savedNotice;
	} else {
		return;
	}

	// Button pops up only after the timeout passes
	setTimeout( () => {
		const button = notice.querySelector( '.notice-dismiss' );
		if ( ! button ) {
			return;
		}
		const slug = type === 'new' ? 'new-ideas' : 'saved-ideas';
		const expirationType = type === 'new' ? WEEK_IN_SECONDS : 0;
		button.addEventListener( 'click', () => dismissNotice( slug, expirationType ) );
	}, 1 );
} );
