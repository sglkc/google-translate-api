const assert = require('assert/strict');
const translate = require('../index.cjs');

describe('translate()', function () {
	it('should translate single input with forceBatch true', async () => {
		const res = await translate('cat', {from: 'en', to: 'es'});

		assert.equal(res.text, 'gata');
	});

	it('should translate single input with fallbackBatch false', async () => {
		try {
			const res = await translate('cat', {from: 'en', to: 'es', forceBatch: false, fallbackBatch: false});

			assert.equal(res.text, 'gato');
		} catch (e) {
			assert.equal(e.message, 'Too Many Requests');
		}
	});

	it('should translate array input with forceBatch false', async () => {
		const res = await translate(['one', 'two'], {from: 'en', to: 'es', forceBatch: false});

		assert.equal(res[0].text, 'una');
		assert.equal(res[1].text, 'dos');
	});

	it('should fallback to batch on single reject', async () => {
		function testRequest(url, init) {
			if (url.includes('single')) {
				return new Promise(() => {
					throw new Error();
				});
			}
			return fetch(url, init);
		}
		const res = await translate('cat', {from: 'en', to: 'es', forceBatch: false, requestFunction: testRequest});

		assert.equal(res.text, 'gata');
	});
});