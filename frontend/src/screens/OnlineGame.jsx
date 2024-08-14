import { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useNavigate } from "react-router-dom";

const INIT_GAME = "init_game";
const MOVE = "move";
const GAME_OVER = "game_over";

export function OnlineGame() {
  const [game, setGame] = useState(new Chess());
  const [socket, setSocket] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [gameStatus, setGameStatus] = useState('Connecting to server...');

  const connectWebSocket = useCallback(() => {
    const newSocket = new WebSocket('ws://localhost:8080');

    newSocket.onopen = () => {
      console.log('WebSocket connected');
      setGameStatus('Connected. Waiting for opponent...');
      newSocket.send(JSON.stringify({ type: INIT_GAME }));
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleServerMessage(data);
    };

    newSocket.onclose = () => {
      console.log('WebSocket disconnected. Attempting to reconnect...');
      setGameStatus('Disconnected. Attempting to reconnect...');
      setTimeout(connectWebSocket, 5000);
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setGameStatus('Connection error. Retrying...');
    };

    setSocket(newSocket);
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectWebSocket]);

  const handleServerMessage = useCallback((data) => {
    console.log('Received message:', data);
    let winner;
    switch (data.type) {
      case INIT_GAME:
        setPlayerColor(data.payload.color);
        setGameStatus('Game started');
        break;
      case MOVE:
        makeMove(data.payload.from, data.payload.to);
        break;
      case GAME_OVER:
        winner = data.payload.winner;
        if(winner == 1){
          winner = 'Winner: white'
        }else if(winner == 2){
          winner = 'Winner: black'
        }else{
          winner = 'Draw'
        }
        setGameStatus(`Game Over. ${winner}`);
        alert(`Game Over. ${winner}`);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  const makeMove = useCallback((from, to) => {
    setGame((currentGame) => {
      const newGame = new Chess(currentGame.fen());
      const move = newGame.move({ from, to, promotion: 'q' });
      if (move) {
        console.log(`Move made: ${from} to ${to}`);
        return newGame;
      }
      return currentGame;
    });
  }, []);

  function onDrop(sourceSquare, targetSquare) {
    if (game.turn() !== playerColor[0]) {
      return false;
    }

    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (move) {
      setGame(new Chess(game.fen()));
      console.log('Sending move:', { from: sourceSquare, to: targetSquare });
      socket.send(JSON.stringify({
        type: MOVE,
        move: { from: sourceSquare, to: targetSquare }
      }));
      return true;
    }
    return false;
  }

  
  const navigate = useNavigate();
  return (
    
    <div className="bg-slate-950 min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 flex space-x-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            navigate("/userstatistics");
        }}
        >
          User Statistics
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            navigate("/previousgames");
        }}
        >
          Previous Games
        </button>
      </div>
      <h2 className="text-white font-bold mb-4 text-center">{gameStatus}</h2>
      <p className="text-white text-center mb-4">
        Current turn: {game.turn() === 'w' ? 'White' : 'Black'}
      </p>
      {playerColor && (
        <div className="mx-auto my-4" style={{ maxWidth: '70vh', width: '70vw' }}>
          <Chessboard
            position={game.fen()}
            onPieceDrop={onDrop}
            boardOrientation={playerColor === 'w' ? 'white' : 'black'}
          />
        </div>
      )}
    </div>
  );
}