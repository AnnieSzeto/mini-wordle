import React from 'react';
import { GameOver, type GameOverPayload } from './types';

interface GameOverModalProps {
	data: GameOverPayload | null;
	onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ data, onClose }) => {
	if (!data) return null;

	const title = data.type === GameOver.WIN ? 'You won!' : 'Game Over';

	return (
		<div
			className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4"
			onClick={onClose}
		>
			<div
				className="bg-neutral border-lighter mx-auto w-full max-w-sm rounded-lg border-2 p-6 text-center shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<h3
					className={`mb-2 text-2xl font-bold ${data.type === GameOver.WIN ? 'text-success' : 'text-error'}`}
				>
					{title}
				</h3>
				<p className="mb-4">{data.message}</p>
				<button
					className="hover:bg-neutral-opposite border-text cursor-pointer rounded-md border-2 px-4 py-2"
					onClick={onClose}
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default GameOverModal;
