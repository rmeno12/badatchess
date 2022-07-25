import { Chess, ChessInstance, Move } from "chess.js";

type Side = 'w' | 'b';

const PIECE_SCORES = {
  'p': 1,
  'n': 3,
  'b': 3,
  'r': 5,
  'q': 8,
  'k': 10000,
}

export const randommove = (fen: string): string => {
  let chess = Chess(fen);
  const moves = chess.moves();

  if (moves.length > 0) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  return '';
};

export const loser = (fen: string): Move | null => {
  let chess = Chess(fen);
  let search_depth = 3;
  let tree_depth = 2 * (search_depth - 1);

  console.log(`fen is ${fen}`);
  console.log(`moves are ${chess.moves()}`);
  console.log(`searching with depth ${tree_depth}`);
  console.log(board_score(chess));
  let { score: s, move: m } = minimax(fen, tree_depth, false, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  console.log(`Selecting ${m?.san} with score ${s}`);
  return m;
}

// things to implement
// - move ordering
// - quiescence search
// - better eval functions
// - transposition tables

const minimax = (fen: string, depth: number, is_max: boolean, alpha: number, beta: number): { score: number, move: Move | null } => {
  let chess = Chess(fen);
  if (depth == 0 || chess.game_over()) {
    return { score: board_score(chess), move: null };
  }

  let moves = chess.moves({ verbose: true }).sort(move_compare);
  if (is_max) {
    let bmove = moves[0];
    for (let move of moves) {
      let c = Chess(fen);
      c.move(move);
      let { score: score } = minimax(c.fen(), depth - 1, false, alpha, beta);
      if (score >= beta)
        return { score: beta, move: move };
      if (score > alpha) {
        alpha = score;
        bmove = move;
      }
    }
    return { score: alpha, move: bmove };
  } else {
    let bmove = moves[0];
    for (let move of moves) {
      let c = Chess(fen);
      c.move(move);
      let { score: score } = minimax(c.fen(), depth - 1, true, alpha, beta);
      if (score <= alpha)
        return { score: alpha, move: move };
      if (score < beta) {
        beta = score
        bmove = move;
      }
    }
    return { score: beta, move: bmove };
  }
}

const board_score = (chess: ChessInstance): number => {
  let board = chess.board();
  let w_score = 0;
  let b_score = 0;
  for (let rank of board) {
    for (let piece of rank) {
      if (piece == null)
        continue;

      let value = PIECE_SCORES[piece.type];
      if (piece.color == "w") {
        w_score += value;
      } else {
        b_score += value
      }
    }
  }
  return w_score - b_score;
}

const move_compare = (a: Move, b: Move): number => {
  // captures before non-captures
  if (a.captured && !b.captured) {
    return -1;
  } else if (!a.captured && b.captured) {
    return 1;
  } else if (!a.captured && !b.captured) {
    // for now don't discriminate between non-captures
    return 0;
  }

  // low cap high before equal cap before high cap low
  let a_diff = PIECE_SCORES[a.piece] - (a.captured !== undefined ? PIECE_SCORES[a.captured] : 0);
  let b_diff = PIECE_SCORES[b.piece] - (b.captured !== undefined ? PIECE_SCORES[b.captured] : 0);
  return a_diff < b_diff ? -1 : a_diff > b_diff ? 1 : 0;
}

