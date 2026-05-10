import { useStore } from '@nanostores/react';

import { focusOnInput, submitGuess, wordle, wordlekeys } from '@stores/wordle';
import { wordleColours, type WordleKeyboardProps } from './types';

const CaretDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		strokeWidth="2"
		stroke="currentColor"
		{...props}
	>
		<path strokeLinecap="round" strokeLinejoin="round" d="M 19.5 8.25 L 12 15.75 l -7.5 -7.5" />
	</svg>
);

const WordleKeyboard: React.FC<WordleKeyboardProps> = ({
	modalRef,
	keyboardRef,
	closeKeyboard
}) => {
	const keyState = useStore(wordlekeys);
	const { disableInputs } = useStore(wordle);
	const keys: string[][] = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
		['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
	];

	const handleType = (key: string) => {
		const guess = wordle.get().guessssWord;
		const row = wordle.get().currentRow;
		const currentLine = document.getElementById(`wordle-line-${row}`);

		if (!currentLine) return;

		switch (key) {
			case 'ENTER':
				const { status, message, error } = submitGuess();
				if (error) {
					currentLine.classList.add('shake');
				} else if (status) {
					modalRef.current = { type: status, message: message || '' };
				} else {
					focusOnInput();
				}

				break;
			case 'DELETE':
				wordle.setKey('guessssWord', guess.slice(0, -1));
				break;
			default:
				wordle.setKey('guessssWord', guess + key);
				focusOnInput();
				break;
		}
	};

	return (
		<div
			ref={keyboardRef}
			id="wordle-keyboard"
			className="bg-neutral fixed bottom-0 z-10 flex w-full flex-col items-center justify-center gap-1 rounded-t-xl p-2 pb-8 sm:w-min sm:min-w-100 sm:gap-2 md:p-4 md:pb-12"
		>
			<button
				className="mx-2 flex cursor-pointer items-center gap-2 self-end"
				onClick={() => closeKeyboard(false)}
			>
				Close
				<CaretDownIcon className="h-6 w-6" />
			</button>
			{keys.map((row, i) => (
				<div key={i} className="flex gap-1">
					{row.map((key) => (
						<button
							key={key}
							onClick={() => handleType(key)}
							disabled={disableInputs === 'true'}
							className={`${wordleColours[keyState[key as keyof typeof keyState] as unknown as keyof typeof wordleColours] || 'bg-lighter'} min-w-6 cursor-pointer rounded-md p-2 text-base font-bold text-white duration-300 sm:min-w-7 md:min-w-8 md:text-lg disabled:cursor-not-allowed`}
						>
							{key}
						</button>
					))}
				</div>
			))}
		</div>
	);
};

export default WordleKeyboard;
