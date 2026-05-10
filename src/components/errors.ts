import { GameOver } from './types';

export class InvalidWordLengthError extends Error {
	constructor(public readonly length: number) {
		super(`Word must be 5 letters, got ${length}`);
		this.name = 'InvalidWordLengthError';
	}
}

export class WordNotFoundError extends Error {
	constructor(public readonly word: string) {
		super(`Word "${word}" not found in dictionary`);
		this.name = 'WordNotFoundError';
	}
}

export class GameOverError extends Error {
	constructor(
		public readonly status: GameOver,
		public readonly word?: string
	) {
		const message = status === GameOver.WIN ? `You've won!` : `The word was ${word}`;
		super(message);
		this.name = 'GameOverError';
		this.status = status;
	}
}
