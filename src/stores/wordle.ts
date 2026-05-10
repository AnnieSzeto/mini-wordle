import { persistentMap } from '@nanostores/persistent';

import raw from './words_alpha.txt?raw';
import { GameOverError, InvalidWordLengthError, WordNotFoundError } from '../components/errors';
import { GameOver, wordleGrade, type SubmitGuessResult, type wordleRows } from '../components/types';

const allwords = raw.split(/\r?\n/);
const getRandomWord = (): string =>
	allwords[Math.floor(Math.random() * allwords.length - 1)].toUpperCase();

const initialState = {
	wordOfTheDay: getRandomWord(),
	guessssWord: '',
	currentRow: '0',
	0: '',
	1: '',
	2: '',
	3: '',
	4: '',
	5: '',
	message: '',
	messageTimeStamp: '',
	resetTimeStamp: '',
	disableInputs: 'false'
};

const initialKeyboard = {
	A: '',
	B: '',
	C: '',
	D: '',
	E: '',
	F: '',
	G: '',
	H: '',
	I: '',
	J: '',
	K: '',
	L: '',
	M: '',
	N: '',
	O: '',
	P: '',
	Q: '',
	R: '',
	S: '',
	T: '',
	U: '',
	V: '',
	W: '',
	X: '',
	Y: '',
	Z: ''
};

export const wordle = persistentMap('wordle:', initialState);
export const wordlekeys = persistentMap('wordleKeyboard:', initialKeyboard);

export const resetWordOfTheDay = () => {
	wordle.set({
		...initialState,
		wordOfTheDay: getRandomWord(),
		resetTimeStamp: Date.now().toString()
	});
	wordlekeys.set(initialKeyboard);
};

export const focusOnInput = () => {
	(
		document.querySelector(`#wordle-line-${wordle.get().currentRow} input`) as HTMLInputElement
	)?.focus();
};

export const validateWord = (word?: string): wordleGrade[] => {
	const { wordOfTheDay, guessssWord } = wordle.get();
	const keystate = wordlekeys.get();

	const checkWord = word || guessssWord;

	if (checkWord.length !== 5) throw new InvalidWordLengthError(checkWord.length);
	if (!allwords.includes(checkWord.toLowerCase())) throw new WordNotFoundError(checkWord);

	const letterCounts = new Map<string, number>();
	wordOfTheDay.split('').forEach((letter, i) => {
		if (checkWord[i] !== letter) {
			letterCounts.set(letter, (letterCounts.get(letter) || 0) + 1);
		}
	});

	return checkWord.split('').map((letter, index) => {
		const key = letter as keyof typeof initialKeyboard;

		if (letter === wordOfTheDay[index]) {
			wordlekeys.setKey(key, wordleGrade.CORRECT.toString());
			return wordleGrade.CORRECT;
		}
		if (letterCounts.get(letter)! > 0) {
			if (keystate[key] !== wordleGrade.CORRECT.toString()) {
				wordlekeys.setKey(key, wordleGrade.CLOSE.toString());
			}
			letterCounts.set(letter, letterCounts.get(letter)! - 1);
			return wordleGrade.CLOSE;
		}
		if (!keystate[key]) {
			wordlekeys.setKey(key, wordleGrade.INCORRECT.toString());
		}
		return wordleGrade.INCORRECT;
	});
};

export const submitGuess = (): SubmitGuessResult => {
	const { currentRow, guessssWord, wordOfTheDay } = wordle.get();
	const row = Number(currentRow) as wordleRows;

	try {
		const results = validateWord();

		wordle.setKey(row, guessssWord);
		wordle.setKey('guessssWord', '');
		wordle.setKey('currentRow', (row + 1).toString());
		wordle.setKey('message', '');

		if (results.every((r) => r === wordleGrade.CORRECT)) {
			throw new GameOverError(GameOver.WIN);
		}
		if (row >= 5) {
			throw new GameOverError(GameOver.LOSE, wordOfTheDay);
		}

		return { status: null, message: '', error: null };
	} catch (e) {
		if (e instanceof GameOverError) {
			wordle.setKey('disableInputs', 'true');
			return { status: e.status, message: e.message, error: null };
		}

		if (e instanceof WordNotFoundError) {
			wordle.setKey('message', 'This word is not in the list!');
		} else if (e instanceof InvalidWordLengthError) {
			wordle.setKey('message', 'Word must be 5 letters!');
		}
		wordle.setKey('messageTimeStamp', Date.now().toString());

		return { status: null, message: '', error: 'validation' };
	}
};
