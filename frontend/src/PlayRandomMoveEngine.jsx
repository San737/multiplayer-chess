import { useState } from "react";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";

export default function PlayRandomMoveEngine() {
  const [game, setGame] = useState(new Chess());
  if (game.in_checkmate()) {
    alert(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`);
  } else if (game.in_draw()) {
    alert("It's a draw!");
  } else if (game.in_stalemate()) {
    alert("Stalemate!");
  } else if (game.in_threefold_repetition()) {
    alert("Draw by threefold repetition.");
  } else if (game.insufficient_material()) {
    alert("Draw due to insufficient material.");
  }



  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    setTimeout(makeRandomMove, 200);
    return true;
  }

  return <Chessboard position={game.fen()} onPieceDrop={onDrop} />;
}