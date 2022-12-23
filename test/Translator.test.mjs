import assert from 'assert/strict';
import { Translator } from '../index.cjs';

describe('new Translator()', function () {
	it('should translate single input with forceBatch true, remember options', async () => {
		const translator = new Translator({to: 'es'});
		const res = await translator.translate('cat', {from: 'en'});

		assert.equal(res.text, 'gata');
	});

	it('should translate single input with forceBatch false', async () => {
		const translator = new Translator({forceBatch: false});
		const res = await translator.translate('cat', {from: 'en', to: 'es'});

		assert.equal(res.text, 'gato');
	});

	it('should translate array input with forceBatch false', async () => {
		const translator = new Translator();
		const res = await translator.translate(['one', 'two'], {to: 'es', forceBatch: false});

		assert.equal(res[0].text, 'una');
		assert.equal(res[1].text, 'dos');
	});

	it('should fallback to batch on single reject', async () => {
		const translator = new Translator({from: 'en', to: 'es'});
		function testRequest(url, init) {
			if (url.includes('single')) {
				return new Promise(() => {
					throw new Error();
				});
			}
			return fetch(url, init);
		}
		const res = await translator.translate('cat', {forceBatch: false, requestFunction: testRequest});

		assert.equal(res.text, 'gata');
	});
});