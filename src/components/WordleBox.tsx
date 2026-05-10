import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';

import { wordle } from '@stores/wordle';
import { wordleColours, type WordleBoxProps } from './types';

const WordleBox: React.FC<WordleBoxProps> = ({ row, index, grade }) => {
	const { guessssWord, currentRow, disableInputs } = useStore(wordle);
	const [chara, setChara] = useState<string>(wordle.get()[row][index] || '');

	useEffect(() => {
		if (Number(currentRow) === row) {
			setChara(guessssWord[index]);
		}
	}, [currentRow, guessssWord]);

	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (Number(currentRow) > row && cardRef.current) {
			cardRef.current.style.transform = 'rotateX(180deg)';
		}
	}, [cardRef, currentRow]);

	return (
		<div
			ref={cardRef}
			id={`wordle-card-${row}-${index}`}
			style={{ transitionDelay: `${index * 200}ms` }}
			className="wordle-card relative flex h-12 w-12 items-center justify-center text-3xl font-bold transform-3d sm:h-14 sm:w-14"
			onTransitionEnd={(e) => (e.target !== cardRef.current || index !== 4) && e.stopPropagation()}
		>
			<div
				className={`h-full w-full ${wordleColours[grade]} absolute inset-0 flex rotate-x-180 items-center justify-center text-white backface-hidden`}
			>{chara}</div>
			<div
				className={`h-full w-full ${disableInputs === 'true' ? 'bg-lighter2 border-lighter2' : chara ? 'border-text' : 'border-lighter'} absolute inset-0 flex items-center justify-center border-2 text-center backface-hidden`}
			>{chara}</div>
		</div>
	);
};

export default WordleBox;
