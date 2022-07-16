import { useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess, ChessInstance, ShortMove } from "chess.js";
import { randommove, loser } from "./player";

function App() {
  const [chess] = useState<ChessInstance>(
    new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [fen, setFen] = useState(chess.fen());

  const handleMove = (move: ShortMove) => {
    if (chess.move(move)) {
      setFen(chess.fen());
      setTimeout(() => {
        // const move = randommove(chess);
        const move = loser(chess.fen());
        chess.move(move);
        setFen(chess.fen());
      }, 300);
    }
  };

  return (
    <div style={{ margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "lightgray" }}>Bad at Chess</h1>
      <Chessboard
        width={400}
        position={fen}
        onDrop={(move) =>
          handleMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            promotion: "q",
          })
        }
      />
    </div>
  );
}

export default App;
