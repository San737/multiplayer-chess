import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const ChessGameReplay = ({ pgn }) => {
  const [game, setGame] = useState(new Chess());
  const [currentMove, setCurrentMove] = useState(0);
  const [moves, setMoves] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pgn) {
      setError("No PGN data available for this game.");
      return;
    }

    try {
      const newGame = new Chess();
      newGame.load_pgn(pgn);
      setGame(new Chess()); // Start with an empty board
      setMoves(newGame.history({ verbose: true }));
      setError(null);
    } catch (error) {
      console.error("Error loading PGN:", error);
      setError("Unable to load the game. The PGN data may be invalid or incomplete.");
    }
  }, [pgn]);

  const handleNextMove = () => {
    if (currentMove < moves.length) {
      const newGame = new Chess(game.fen());
      newGame.move(moves[currentMove]);
      setGame(newGame);
      setCurrentMove(currentMove + 1);
    }
  };

  const handlePrevMove = () => {
    if (currentMove > 0) {
      const newGame = new Chess();
      for (let i = 0; i < currentMove - 1; i++) {
        newGame.move(moves[i]);
      }
      setGame(newGame);
      setCurrentMove(currentMove - 1);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
        <div className="bg-slate-300 rounded-lg shadow-lg p-6">
          <p className="text-xl text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-800 p-4 rounded-lg">
      <div className="w-full max-w-[80vh] aspect-square">
        <Chessboard position={game.fen()} />
      </div>
      <div className="mt-4 flex justify-between w-full max-w-[80vh]">
        <button
          onClick={handlePrevMove}
          disabled={currentMove === 0}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="text-white text-lg font-semibold">
          Move: {currentMove} / {moves.length}
        </div>
        <button
          onClick={handleNextMove}
          disabled={currentMove === moves.length}
          className="bg-green-500 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChessGameReplay;