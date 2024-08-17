import { expectType } from 'tsd';
import { translate, Translator, speak, TranslationResponse } from 'google-translate-api-x';

expectType<Promise<TranslationResponse>>(translate('abc').then(a => { console.log(a); return a }));
expectType<Promise<TranslationResponse[]>>(translate(['a', {text: 'b', to: 'nl'}, 'c']));
expectType<Promise<{a: TranslationResponse, b: TranslationResponse}>>(translate({a: 'test', b: {text: 'b', to: 'nl'}}));

const translator = new Translator();
expectType<Promise<TranslationResponse>>(translator.translate('abc'));
expectType<Promise<TranslationResponse[]>>(translator.translate(['a', {text: 'b', to: 'nl'}, 'c']));
expectType<Promise<{a: TranslationResponse, b: TranslationResponse}>>(translator.translate({a: 'test', b: {text: 'b', to: 'nl'}}));

expectType<Promise<string>>(speak('abc'));
expectType<Promise<string[]>>(speak(['a', {text: 'b', to: 'nl'}, 'c']))
expectType<Promise<{a: string, b: string}>>(speak({a: 'test', b: {text: 'b', to: 'nl'}}));
