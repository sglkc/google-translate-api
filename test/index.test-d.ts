import { expectType } from 'tsd';
import { translate, Translator, googleTranslateApi } from '..';

expectType<Promise<googleTranslateApi.TranslationResponse>>(translate('abc'));
expectType<Promise<googleTranslateApi.TranslationResponse[]>>(translate(['a', {text: 'b', to: 'nl'}, 'c']));
expectType<Promise<{a: googleTranslateApi.TranslationResponse, b: googleTranslateApi.TranslationResponse}>>(translate({a: 'test', b: {text: 'b', to: 'nl'}}));

const translator = new Translator();
expectType<Promise<googleTranslateApi.TranslationResponse>>(translator.translate('abc'));
expectType<Promise<googleTranslateApi.TranslationResponse[]>>(translator.translate(['a', {text: 'b', to: 'nl'}, 'c']));
expectType<Promise<{a: googleTranslateApi.TranslationResponse, b: googleTranslateApi.TranslationResponse}>>(translator.translate({a: 'test', b: {text: 'b', to: 'nl'}}));
