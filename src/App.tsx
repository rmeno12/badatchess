import { useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess, ChessInstance, ShortMove } from "chess.js";
import { randommove, loser } from "./player";
import { GridLoader } from "react-spinners";

function App() {
  const [chess] = useState<ChessInstance>(
    new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  );

  const [fen, setFen] = useState(chess.fen());

  let [loading, setLoading] = useState(false);

  const handleMove = (move: ShortMove) => {
    if (chess.move(move)) {
      setFen(chess.fen());
      setLoading(true);
      setTimeout(() => {
        // const move = randommove(chess);
        let a = performance.now();
        const move = loser(chess.fen());
        console.log(`took ${(performance.now() - a) / 1000} seconds to think of a move`);
        setLoading(false);
        if (move)
          chess.move(move);
        else
          console.log('no moves...');
        setFen(chess.fen());
      }, 300);
    }
  };

  return (
    <div style={{ margin: "auto", display: "flex", flexDirection: "column" }}>
      <h1 style={{ textAlign: "center", color: "lightgray" }}>Bad at Chess</h1>
      <Chessboard
        width={700}
        position={fen}
        onDrop={(move) =>
          handleMove({
            from: move.sourceSquare,
            to: move.targetSquare,
            promotion: "q",
          })
        }
      />
      <GridLoader color="#00ff11" loading={loading} style={{ margin: "auto", paddingTop: 16 }} />
    </div>
  );
}

export default App;
