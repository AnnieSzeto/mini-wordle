import type { RefObject } from "react";

export enum wordleGrade {
	CORRECT = 2,
	INCORRECT = 0,
	CLOSE = 1
}

export type wordleRows = 0 | 1 | 2 | 3 | 4 | 5;

export type wordleLetters =
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z';

export enum GameOver {
	WIN = 'win',
	LOSE = 'lose'
}

export const wordleColours = {
	[wordleGrade.CORRECT]: 'bg-success',
	[wordleGrade.CLOSE]: 'bg-warning',
	[wordleGrade.INCORRECT]: 'bg-faded'
} as const;

export type SubmitGuessResult = {
	status: GameOver | null;
	message: string;
	error: 'validation' | null;
};

export type GameOverPayload = { type: GameOver; message: string };

export interface WordleBoxProps {
	row: wordleRows;
	index: number;
	grade: wordleGrade;
}

export interface WordleKeyboardProps {
	modalRef: RefObject<GameOverPayload | null>;
	keyboardRef: RefObject<HTMLDivElement | null>;
	closeKeyboard: (val: boolean) => void;
}

export interface WordleLineProps {
	modalRef: RefObject<GameOverPayload | null>;
	row: wordleRows;
	onGameOver: (payload: GameOverPayload) => void;
}
