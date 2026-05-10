import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';

import { wordle, resetWordOfTheDay, focusOnInput } from '@stores/wordle';
import WordleLine from './WordleLine';
import WordleKeyboard from './WordleKeyboard';
import GameOverModal from './GameOverModal';
import type { GameOverPayload, wordleRows } from './types';
import './wordle.css';

const WordleNotification: React.FC = () => {
	const { message, messageTimeStamp } = useStore(wordle);

	return (
		<span key={messageTimeStamp} className="fade text-error">
			{message}
		</span>
	);
};

const ReloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg
		viewBox="0 0 1000 1000"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeMiterlimit="10"
		strokeWidth="40"
		{...props}
	>
		<path d="M754.84,346.43c-52-85.88-146.35-143.29-254.09-143.29-164,0-296.86,132.91-296.86,296.86,0,117.77,68.58,219.52,168,267.51" />
		<path d="M796.11,529.91c-15,149.9-141.51,267-295.36,267" />
		<line x1="754.98" x2="754.98" y1="221.34" y2="346.43" />
		<line x1="754.64" x2="630.68" y1="346.43" y2="346.43" />
	</svg>
);

const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg fill="currentColor" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="M41.9 23.9c-.3-6.1-4-11.8-9.5-14.4-6-2.7-13.3-1.6-18.3 2.6-4.8 4-7 10.5-5.6 16.6 1.3 6 6 10.9 11.9 12.5 7.1 2 13.6-1.4 17.6-7.2-3.6 4.8-9.1 8-15.2 6.9-6.1-1.1-11.1-5.7-12.5-11.7-1.5-6.4 1.5-13.1 7.2-16.4 5.9-3.4 14.2-2.1 18.1 3.7 1 1.4 1.7 3.1 2 4.8.3 1.4.2 2.9.4 4.3.2 1.3 1.3 3 2.8 2.1 1.3-.8 1.2-2.5 1.1-3.8 0-.4.1.7 0 0z" />
	</svg>
);

const KeyboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
	<svg fill="currentColor" viewBox="0 -6 36 36" xmlns="http://www.w3.org/2000/svg" {...props}>
		<path d="m33 24h-30c-1.657 0-3-1.343-3-3v-18c0-1.657 1.343-3 3-3h30c1.657 0 3 1.343 3 3v18c0 1.657-1.343 3-3 3zm-25-16.75v-2.501c-.001-.413-.336-.748-.749-.75h-2.501c-.413.001-.748.336-.75.749v2.501c.001.413.336.748.749.75h2.501c.413-.001.748-.336.75-.749zm6 0v-2.501c-.001-.413-.336-.748-.749-.75h-2.501c-.413.001-.748.336-.75.749v2.501c.001.413.336.748.749.75h2.5c.413-.001.748-.336.75-.749zm6 0v-2.501c-.001-.413-.336-.748-.749-.75h-2.501c-.413.001-.748.336-.75.749v2.501c.001.413.336.748.749.75h2.5c.414-.001.749-.336.75-.749zm6 0v-2.501c-.001-.413-.336-.748-.749-.75h-2.501c-.413.001-.748.336-.75.749v2.501c.001.413.336.748.749.75h2.5c.413-.001.748-.336.75-.749zm6 0v-2.501c-.001-.413-.336-.748-.749-.75h-2.503c-.413.002-.747.336-.749.749v2.501c.001.414.337.749.75.75h2.503c.412-.003.745-.337.746-.749zm-24 6v-2.501c-.001-.413-.336-.748-.749-.75h-2.501c-.413.001-.748.336-.75.749v2.5c.001.413.336.748.749.75h2.501c.413-.001.748-.336.75-.749zm6 0v-2.501c-.001-.413-.336-.748-.749-.75h-2.501c-.413.001-.748.336-.75.749v2.5c.001.413.336.748.749.75h2.5c.413-.001.748-.336.75-.749zm6 0v-2.501c-.001-.413-.336-.748-.749-.75h-2.501c-.413.001-.748.336-.75.749v2.5c.001.413.336.748.749.75h2.5c.414-.001.749-.335.75-.749zm6 0v-2.501c-.001-.413-.336-.748-.749-.75h-2.501c-.413.001-.748.336-.75.749v2.5c.001.413.336.748.749.75h2.5c.414-.001.749-.335.75-.749zm6 0v-2.501c-.001-.413-.335-.747-.748-.75h-2.503c-.414.001-.749.336-.75.749v2.5c.001.414.337.749.75.75h2.503c.412-.002.746-.336.748-.749zm-24 6v-2.501c-.001-.413-.336-.748-.749-.75h-2.501c-.413.001-.748.336-.75.749v2.5c.001.414.336.749.749.75h2.501c.413-.001.748-.336.75-.749zm18 0v-2.501c-.001-.413-.336-.748-.749-.75h-14.501c-.413.001-.748.336-.75.749v2.5c.001.413.336.748.749.75h14.501c.413-.001.748-.336.75-.749zm6 0v-2.501c-.001-.413-.336-.748-.749-.75h-2.503c-.414.001-.749.336-.75.749v2.5c.001.414.337.749.75.75h2.503c.412-.002.746-.336.748-.749z" />
	</svg>
);

const Wordle: React.FC = () => {
	const [isClient, setIsClient] = useState(false);
	const { resetTimeStamp } = useStore(wordle);
	const [showKeyboard, setShowKeyboard] = useState(false);
	const [gameOver, setGameOver] = useState<GameOverPayload | null>(null);
	const keyboardRef = useRef<HTMLDivElement>(null);
	const pendingModalRef = useRef<GameOverPayload | null>(null);

	useEffect(() => {
		console.log('Word of the day', wordle.get().wordOfTheDay);
		setIsClient(true);
		focusOnInput();
	}, []);

	const rows: wordleRows[] = [0, 1, 2, 3, 4, 5];

	useEffect(() => {
		if (!keyboardRef.current) return;
		if (showKeyboard) {
			keyboardRef.current.style.translate = '0 0';
		} else {
			keyboardRef.current.style.translate = '';
		}
	}, [showKeyboard]);

	return (
		<div
			className="wordle bg-neutral shadow-shadow flex w-full flex-col items-center gap-2 rounded-t-md py-20 sm:gap-4 sm:p-10"
			onClick={focusOnInput}
		>
			<h2 className="text-4xl font-bold">
				<span>Mini-Wordle :D</span>
			</h2>
			<button
				className="hover:bg-neutral-opposite active:bg-neutral-opposite flex cursor-pointer items-center gap-2 rounded-full p-2"
				onClick={resetWordOfTheDay}
			>
				<ReloadIcon className="h-8 w-8" />
				<span className="pr-2">Reset Word</span>
			</button>

			<div
				key={resetTimeStamp}
				className="wordle-grid relative flex flex-col items-center justify-center gap-1"
			>
				{rows.map((row) => (
					<WordleLine
						modalRef={pendingModalRef}
						key={row}
						row={row}
						onGameOver={setGameOver}
					/>
				))}
				{!isClient && <SpinnerIcon className="text-faded absolute h-15 w-15 animate-spin" />}
			</div>
			<div className="h-8">{isClient && <WordleNotification />}</div>
			<button
				className="hover:bg-neutral-opposite active:bg-neutral-opposite flex cursor-pointer items-center gap-3 rounded-full p-2 px-4"
				onClick={() => setShowKeyboard(!showKeyboard)}
			>
				<KeyboardIcon className="h-8 w-8" />
				Toggle Keyboard
			</button>
			{isClient && (
				<WordleKeyboard
					modalRef={pendingModalRef}
					keyboardRef={keyboardRef}
					closeKeyboard={setShowKeyboard}
				/>
			)}
			<GameOverModal data={gameOver} onClose={() => setGameOver(null)} />
		</div>
	);
};

export default Wordle;
