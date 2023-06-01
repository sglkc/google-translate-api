import assert from 'assert/strict';
import { Translator } from '../index.cjs';

describe('new Translator()', function () {
	this.retries(10);
	it('should translate single input with forceBatch true, remember options', async () => {
		const translator = new Translator({to: 'es'});
		const res = await translator.translate('cat', {from: 'en'});

		assert.equal(res.text, 'gata');
	});
});