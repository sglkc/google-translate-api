import { expectType } from 'tsd';
import { translate, Translator, googleTranslateApi } from '..';

expectType<Promise<googleTranslateApi.TranslationResponse>>(translate('abc'));
expectType<Promise<googleTranslateApi.TranslationResponse[]>>(translate(['a', 'b', 'c']));
expectType<Promise<{a: googleTranslateApi.TranslationResponse}>>(translate({a: 'test'}));

const translator = new Translator();
expectType<Promise<googleTranslateApi.TranslationResponse>>(translator.translate('abc'));
expectType<Promise<googleTranslateApi.TranslationResponse[]>>(translator.translate(['a', 'b', 'c']));
expectType<Promise<{a: googleTranslateApi.TranslationResponse}>>(translator.translate({a: 'test'}));
