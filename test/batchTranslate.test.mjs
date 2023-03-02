import assert from 'assert';
import { getBatchInitData, batchTranslate } from '../index.cjs';

describe('getBatchInitData()', function () {
	this.timeout(5000);

	it('should return the init data as a string', async () => {
		const initData = await getBatchInitData();

		assert.equal(typeof initData, 'string');
	});

	it('should reject on bad request', async () => {
		await assert.rejects(getBatchInitData({tld: '...'}));
	});
});

describe('batchTranslate()', function () {
	this.timeout(5000);

	before(async () => {
		this.initData = await getBatchInitData();
	});

	it('should translate with defaults', async () => {
		const res = await batchTranslate('vertaler', {}, this.initData);

		assert.equal(res.text, 'translator');
		assert.equal(res.from.language.iso, 'nl');
		assert.equal(res.from.text.autoCorrected, false);
		assert.equal(res.from.text.value, '');
		assert.equal(res.from.text.didYouMean, false);
		assert(res.raw);
	});

	xit('should translate correct word expecting didYouMean and autoCorrected false', async () => {
		const res = await batchTranslate('El gato.', {from: 'es', to: 'en'}, this.initData);

		assert.equal(res.text, 'The cat.');
		assert.equal(res.from.language.didYouMean, false);
		assert.equal(res.from.language.iso, 'es');
		assert.equal(res.from.text.autoCorrected, false);
		assert.equal(res.from.text.value, '');
		assert.equal(res.from.text.didYouMean, false);
		assert(res.raw);
	});

	// This test will fail, the batch translate sometimes autocorrects even when not requested- 
	// unless the X-Goog-BatchExecute-BGR header is passed
	// see https://github.com/AidanWelch/google-translate-api/issues/18
	xit('should translate mispelled expecting not autocorrected', async () => {
		const res = await batchTranslate('I spea Dutch!', {from: 'en', to: 'nl'}, this.initData);
		
		assert(res.from.text.didYouMean);
		assert.equal(res.from.text.autoCorrected, false);
		assert.equal(res.from.text.value, 'I [speak] Dutch!');
		assert(res.from.text.didYouMean);
		assert.equal(res.text, 'Ik spreek Nederlands!');
	});

	it('should translate via custom tld', async () => {
		const res = await batchTranslate('vertaler', {tld: 'hk'}, this.initData);

		assert.equal(res.text, 'translator');
	});

	it('should pass request options', async () => {
		const abortController = new AbortController();
		const requestOptions = {
			signal: abortController.signal
		};
		abortController.abort();
		await assert.rejects(batchTranslate('vertaler', {requestOptions}, this.initData), 'AbortError');
	});

	it('should translate array input', async () => {
		const res = await batchTranslate(['dog', 'cat'], {from: 'en', to: 'es'}, this.initData);

		assert.equal(res.length, 2);
		assert.equal(res[0].text, 'perra');
		assert.equal(res[1].text, 'gata');
	});

	it('should translate object input', async () => {
		const res = await batchTranslate({dog: 'dog', cat: 'cat'}, {from: 'en', to: 'es'}, this.initData);

		assert.equal(res.dog.text, 'perra');
		assert.equal(res.cat.text, 'gata');
	});

	it('should option query translate different languages', async () => {
		const res = await batchTranslate([{text: 'dog', to: 'ar'}, 'cat'], {from: 'en', to: 'es'}, this.initData);
	
		assert.equal(res[0].text, 'كلب');
		assert.equal(res[1].text, 'gata');
	});

	it('should translate large batch', async () => {
		const sources = [];
		const targets = [];
		for (let i = 0; i < 1000; i++) {
			const mod = i % 3;
			if (mod === 0) {
				sources.push('uno');
				targets.push('one');
			} else if (mod === 1) {
				sources.push('dos');
				targets.push('two');
			} else {
				sources.push('tres');
				targets.push('three');
			}
		}
	
		const res = await batchTranslate(sources, {from: 'es', to: 'en'}, this.initData);
	
		const translations = res.map(translation => translation.text);
	
		assert.deepEqual(translations, targets);
	});

	it('should default to English on some incorrect iso forced', async () => {
		const resTo = await batchTranslate('This is a test', {to: 'testing', from: 'en', forceTo: true}, this.initData);

		assert.equal(resTo.text, 'This is a test');

		const resFrom = await batchTranslate('Tohle je zkouška', {to: 'en', from: 'anotherone', forceFrom: true}, this.initData);

		assert.equal(resFrom.text, 'Tohle je zkouška');
	});

	it('should error on other incorrect isos forced', async () => {
		await assert.rejects(batchTranslate('This is a test', {to: 'abc', from: 'en', forceTo: true}, this.initData));
		await assert.rejects(batchTranslate('This is a test', {to: 'en', from: 'ii', forceFrom: true}, this.initData));
	});

	it('should reject on incorrect iso not forced', async () => {
		await assert.rejects(batchTranslate('This is a test', {to: 'abc', from: 'en'}, this.initData));
		await assert.rejects(batchTranslate('This is a test', {to: 'en', from: 'ii'}, this.initData));
	});

	it('should give pronunciation', async () => {
		const res = await batchTranslate('translator', {from: 'auto', to: 'zh-CN'}, this.initData);
	
		// here can be 2 variants: 'Yì zhě', 'Fānyì'
		assert.match(res.pronunciation, /^(Yì zhě)|(Fānyì)|(Fānyì)$/);
	});

	it('should translate some english text setting the source language as portuguese', async () => {
		const res = await batchTranslate('happy', {from: 'pt', to: 'nl'}, this.initData);
	
		assert(res.from.language.didYouMean);
		assert.equal(res.from.language.iso, 'en');
	});

	it('should translate several sentences with spaces (#73)', async () => {
		const res = await batchTranslate(
			'translator, translator. translator! translator? translator,translator.translator!translator?',
			{from: 'auto', to: 'nl'},
			this.initData
		);
	
		assert.equal(res.text, 'vertaler, vertaler. vertaler! vertaler? Vertaler, vertaler.translator! Vertaler?');
	});
});