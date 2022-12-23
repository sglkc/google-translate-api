import assert from 'assert/strict';
import { isSupported, getCode } from '../index.cjs';

describe('isSupported()', function () {
	it('should return true for supported language code', () => {
		assert(isSupported('en'));
	});
	
	it('should return false for unsupported language code', () => {
		assert.equal(isSupported('js'), false);
	});
	
	it('should return true for supported language name', () => {
		assert(isSupported('english'));
	});
	
	it('should return false for unsupported language', () => {
		assert.equal(isSupported('javascript'), false);
	});
});

describe('getCode()', function () {
	it('should return supported language code', () => {
		assert.equal(getCode('english'), 'en');
	});
	
	it('should return null for unsupported language', () => {
		assert.equal(getCode('javascript'), null);
	});
	
	it('should return supported language code with same code', () => {
		assert.equal(getCode('en'), 'en');
	});
	
	it('getCode(undefined) should return null', () => {
		assert.equal(getCode(undefined), null);
	});
	
	it('getCode(null) should return null', () => {
		assert.equal(getCode(null), null);
	});
	
	it('call getCode with an empty string should return null', () => {
		assert.equal(getCode(''), null);
	});
	
	it('call getCode with no arguments should return null', () => {
		assert.equal(getCode(), null);
	});
});