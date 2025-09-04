import React, { useMemo, useState } from "react";

// ---- Image placeholders ----------------------------------------------------
const TRUMP_IMG =
  "/trump-head.png";


const BIDEN_IMG =
  "/joe-head.png";

// ---- Helpers ---------------------------------------------------------------
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winnerOf(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function availableMoves(board) {
  return board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
}

function mediumBotMove(board) {
  const moves = availableMoves(board);
  if (moves.length === 0) return null;
  
  // Always take winning moves (must do this or it's obviously throwing)
  for (const m of moves) { 
    const c = board.slice(); 
    c[m] = 'O'; 
    if (winnerOf(c) === 'O') return m; 
  }
  
  // Only block winning moves 5% of the time (very rarely)
  if (Math.random() < 0.05) {
    for (const m of moves) { 
      const c = board.slice(); 
      c[m] = 'X'; 
      if (winnerOf(c) === 'X') return m; 
    }
  }
  
  // Prefer suboptimal moves that seem reasonable:
  
  // 1. Avoid the center (center is strongest position)
  const nonCenterMoves = moves.filter(m => m !== 4);
  if (nonCenterMoves.length > 0 && Math.random() < 0.8) {
    // 2. Prefer edges over corners (edges are weaker than corners)
    const edges = [1, 3, 5, 7].filter(i => nonCenterMoves.includes(i));
    if (edges.length > 0 && Math.random() < 0.7) {
      return edges[Math.floor(Math.random() * edges.length)];
    }
    return nonCenterMoves[Math.floor(Math.random() * nonCenterMoves.length)];
  }
  
  // Fallback to any available move
  return moves[Math.floor(Math.random() * moves.length)];
}

// ---- Screens ---------------------------------------------------------------
function Prelander({ onStart }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-6 bg-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center">Trump vs. Biden — Tic Tac Toe Challenge</h1>

        <div className="flex justify-center">
          <img src="/tb.jpg" alt="Trump vs Biden" className="rounded-2xl shadow-xl max-h-56 w-auto" />
        </div>

        <div className="flex justify-center">
          <button onClick={onStart} className="px-10 py-5 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-extrabold text-xl tracking-wide shadow-[0_8px_20px_rgba(220,38,38,0.45)]">
            Click To Play
          </button>
        </div>

                <div className="p-5 rounded-2xl bg-slate-700 shadow-xl">
          <h2 className="text-xl font-bold mb-3 text-center">Today’s Prize: Trump Mystery Box</h2>
          <div className="flex justify-center">
            <img src="/prize.webp" alt="Trump Mystery Box" className="rounded-xl max-h-56 w-auto" />
          </div>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-2">How it works</h2>
            <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
              <li>You (Trump) play as <strong>X</strong>.</li>
              <li>The bot (Biden) plays as <strong>O</strong>.</li>
              <li>First to align three in a row wins (row, column, or diagonal).</li>
              <li>Game difficulty: <em>medium-easy</em>.</li>
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-2">Rules</h2>
            <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
              <li><strong>Win to get a FREE Trump Mystery Box</strong> (worth up to $300).</li>
              <li>One move per turn.</li>
              <li>If you lose, you can replay or exit.</li>
            </ul>
          </div>
        </div>


      </div>
    </div>
  );
}

function ThankYou() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl p-8 rounded-3xl bg-slate-800/80 shadow-2xl text-center space-y-4">
        <h1 className="text-3xl font-extrabold">🎉 Congratulations — you beat Biden!</h1>
        <img src="prize.webp" width={250} className="mx-auto" />
        <p className="opacity-90">
          As promised, this <strong>Trump Mystery Box</strong> (worth up to <strong>$300</strong>) is <strong>no cost</strong> to you.
          All we ask is you cover the small shipping &amp; handling fee.
        </p>
        <a
          href="https://www.eng9trk.com/28KL6/3CMDB5/?source_id=YT&sub1=tmb_game"
          target="_blank"
          rel="noreferrer"
          className="inline-block px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-lg"
        >
          Complete shipping details
        </a>
      </div>
    </div>
  );
}

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [loseOpen, setLoseOpen] = useState(false);
  const [lock, setLock] = useState(false);

  const state = useMemo(() => {
    const w = winnerOf(board);
    const full = availableMoves(board).length === 0;
    return { w, full };
  }, [board]);

  React.useEffect(() => {
    if (state.w === 'X') {
      window.dispatchEvent(new CustomEvent('tictactoe:win'));
    } else if (state.w === 'O' || state.full) {
      setLoseOpen(true);
    }
  }, [state.w, state.full]);

  React.useEffect(() => {
    if (state.w || state.full) return;
    if (!isXTurn && !lock) {
      setLock(true);
      setTimeout(() => {
        const move = mediumBotMove(board);
        if (move !== null && move !== undefined) {
          setBoard((b) => b.map((v, i) => (i === move ? 'O' : v)));
          setIsXTurn(true);
        }
        setLock(false);
      }, 300);
    }
  }, [isXTurn, board, state.w, state.full, lock]);

  const playAgain = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setLoseOpen(false);
  };

  const exitPage = () => {
    window.open('', '_self');
    window.close();
    window.location.href = window.location.href;
  };

  return (
    <div className="w-full max-w-xl">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src={TRUMP_IMG} alt="Trump" className="h-12 w-12 rounded-full border-2 border-white" />
          <span className="text-lg font-semibold">You · Trump (X)</span>
        </div>
        <div className="text-sm opacity-80">Turn: {isXTurn ? 'You' : 'Bot'}</div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">Bot · Biden (O)</span>
          <img src={BIDEN_IMG} alt="Biden" className="h-12 w-12 rounded-full border-2 border-white" />
        </div>
      </header>

      <main className="grid grid-cols-3 gap-3">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => {
              if (board[i] || state.w || state.full || !isXTurn) return;
              const next = board.slice();
              next[i] = 'X';
              setBoard(next);
              setIsXTurn(false);
            }}
            className="aspect-square rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-[0.99] transition flex items-center justify-center shadow-xl"
            aria-label={`Cell ${i + 1}`}
          >
            {cell === 'X' && <img src={TRUMP_IMG} alt="Trump mark" className="h-16 w-16 rounded-full" />}
            {cell === 'O' && <img src={BIDEN_IMG} alt="Biden mark" className="h-16 w-16 rounded-full" />}
          </button>
        ))}
      </main>

      <footer className="mt-6 flex items-center justify-between">
        <div className="text-sm opacity-80">
          {state.w && (state.w === 'X' ? 'You win!' : 'Bot wins!')}
          {!state.w && state.full && 'Draw!'}
          {!state.w && !state.full && (isXTurn ? 'Your move…' : 'Bot is thinking…')}
        </div>
        <div className="flex gap-2">
          <button onClick={playAgain} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">Reset</button>
          <button onClick={exitPage} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20">Exit</button>
        </div>
      </footer>

      {loseOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-2">
              {state.w === 'O' ? 'You lost — better luck next time!' : "It's a draw — try again!"}
            </h2>
            <div className="flex gap-3 mt-4">
              <button onClick={playAgain} className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800">Play again</button>
              <button onClick={exitPage} className="flex-1 px-4 py-3 rounded-xl bg-slate-200 hover:bg-slate-300">Exit this page</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState('prelander');

  React.useEffect(() => {
    const onWin = () => setStep('thanks');
    window.addEventListener('tictactoe:win', onWin);
    return () => window.removeEventListener('tictactoe:win', onWin);
  }, []);

  if (step === 'prelander') {
    return (
      <Prelander onStart={() => setStep('game')} />
    );
  }
  if (step === 'thanks') {
    return <ThankYou />;
  }
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <Game />
    </div>
  );
}

// ---- Lightweight runtime tests (console) ----------------------------------
function runTests() {
  // winnerOf: rows, columns, diagonals
  console.assert(winnerOf(['X','X','X',null,null,null,null,null,null]) === 'X', 'Row 0 win failed');
  console.assert(winnerOf([null,null,null,'O','O','O',null,null,null]) === 'O', 'Row 1 win failed');
  console.assert(winnerOf(['X',null,null,'X',null,null,'X',null,null]) === 'X', 'Col 0 win failed');
  console.assert(winnerOf([null,'O',null,null,'O',null,null,'O',null]) === 'O', 'Col 1 win failed');
  console.assert(winnerOf(['X',null,null,null,'X',null,null,null,'X']) === 'X', 'Diag win failed');
  console.assert(winnerOf([null,'X',null,null,'O',null,null,null,null]) === null, 'No win should be null');

  // availableMoves
  const avail = availableMoves(['X',null,'O',null,null,'X','O',null,null]);
  console.assert(JSON.stringify(avail) === JSON.stringify([1,3,4,7,8]), 'availableMoves mismatch');
  console.assert(availableMoves(['X','O','X','O','X','O','O','X','O']).length === 0, 'availableMoves full board failed');

  // mediumBotMove: block and win
  const b1 = ['X','X',null,null,'O',null,null,null,null];
  const m1 = mediumBotMove(b1);
  console.assert(m1 === 2, 'Bot did not block X at index 2');
  const b2 = ['O','O',null,'X','X',null,null,null,null];
  const m2 = mediumBotMove(b2);
  console.assert(m2 === 2, 'Bot did not take winning move at index 2');
}

if (typeof window !== 'undefined') {
  try { runTests(); } catch (e) { console.error('Tests failed:', e); }
}
