import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';

import { focusOnInput, submitGuess, validateWord, wordle } from '@stores/wordle';
import WordleBox from './WordleBox';
import type { WordleLineProps } from './types';

const WordleLine: React.FC<WordleLineProps> = ({ modalRef, row, onGameOver }) => {
	const [isClient, setIsClient] = useState(false);
	const { guessssWord, currentRow, disableInputs, [row]: storedWord } = useStore(wordle);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const letters = storedWord ? validateWord(storedWord) : [0, 0, 0, 0, 0];
	const word = row === Number(currentRow) ? guessssWord : storedWord || '';

	const lineRef = useRef<HTMLDivElement>(null);

	const updateWord = (e: React.ChangeEvent<HTMLInputElement>) => {
		wordle.setKey('guessssWord', e.target.value.toUpperCase());
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		e.stopPropagation();

		if (!/[a-zA-Z]/i.test(e.key)) e.preventDefault();
		else if (e.key === 'Enter') {
			e.preventDefault();

			const { status, message, error } = submitGuess();

			if (error) {
				lineRef.current?.classList.add('shake');
			} else if (status) {
				modalRef.current = { type: status, message: message || '' };
			} else {
				focusOnInput();
			}
		}
	};

	return (
		<div
			onAnimationEnd={() => lineRef.current?.classList.remove('shake')}
			className={`flex gap-1`}
			id={`wordle-line-${row}`}
			ref={lineRef}
			onTransitionEnd={() => {
				if (modalRef.current) {
					onGameOver(modalRef.current);
					modalRef.current = null;
				}
			}}
		>
			<input
				className="absolute border opacity-0"
				maxLength={5}
				onChange={updateWord}
				onKeyDown={handleKeyDown}
				value={word}
				readOnly={isClient ? !(Number(currentRow) === row) : true}
				disabled={isClient ? disableInputs === 'true' : true}
			/>
			{letters.map((letter, index) =>
				isClient ? (
					<WordleBox key={index} index={index} row={row} grade={letter} />
				) : (
					<div
						key={index}
						className="border-lighter bg-lighter2 h-12 w-12 animate-pulse border-2 sm:h-14 sm:w-14"
					/>
				)
			)}
		</div>
	);
};

export default WordleLine;
