import { useState } from "react";
import GameMenuComponenet from "./components/gameMenuComponenet";
import ConfigGameComponent from "./components/configGameComponent";
import PlayBoardComponent from "./components/playBoardComponent";
import { SquareInterface, createNewBoard } from "./components/playBoardComponent";

export enum GameStatusEnum {
  beforeStart = 'beforeStart',
  configuring = 'configuring',
  running = 'Playing',
  gameEnded = 'Game Ended',
}

export enum GameDifficultyEnum {
  easy = 3,
  medium = 5,
  hard = 7,
}

export default function App() {
  const [gameStatus, setGameStatus] = useState<GameStatusEnum>(GameStatusEnum.beforeStart);
  const [gameTime, setGameTime] = useState<number>(0);
  const [gameDifficulty, setGameDifficulty] = useState<GameDifficultyEnum>(GameDifficultyEnum.easy);
  const [gameBoardSize, setGameBoardSize] = useState<number>(10);
  const [board, setBoard] = useState<SquareInterface[][]>();

  var timerId: number;

  function startTimer() {
    timerId = setTimeout(() => {
      setGameTime((time) => time + 1);
      if (gameStatus === GameStatusEnum.running) startTimer();
    }, 1000);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
  }

  function startGame() {
    setBoard(createNewBoard(gameBoardSize, gameBoardSize * gameDifficulty));
    setGameStatus(GameStatusEnum.running);
    startTimer();
    //console.clear();
  }

  function endGame() {
    stopTimer();
    setGameStatus(GameStatusEnum.gameEnded);
  }

  function resetGame() {
    setGameStatus(GameStatusEnum.beforeStart);
    setBoard(undefined);
  }

  return (
    <>
      <div className="background-gradient flex fixed -z-50 w-full h-full"></div>
      <div className="w-full z-0 text-white">
          <div className="text-center pt-2 select-none">
            <h1 className="text-4xl leading-none">Minigames</h1>
            <h2 className="text-2xl leading-none">Minesweeper</h2>
          </div>
          <div className="mt-4 flex w-full justify-center">
            <GameMenuComponenet gameStatus={gameStatus} changueGameStatus={setGameStatus} />
          </div>
          <div className="sticky top-0">
            <div className="text-center mt-4 select-none ">
              <h1 className="text-1xl leading-none">Game Status: {gameStatus}</h1>
              <h2 className="text-1xl leading-none">Timer: {gameTime}</h2>
            </div>
            <div className="flex w-full h-0.5 bg-white mt-0.5 mb-2"></div>
          </div>
        </div>
        <div className="w-full mb-2">
          {gameStatus === GameStatusEnum.configuring ? <ConfigGameComponent onStarGame={startGame} /> : null}
          {(gameStatus === GameStatusEnum.running || gameStatus === GameStatusEnum.gameEnded) && board ? <PlayBoardComponent board={ board } setBoard={ setBoard } gameStatus={gameStatus} setGameStatus={ setGameStatus } endGame={ endGame } /> : null}
        </div>
    </>
  )
}