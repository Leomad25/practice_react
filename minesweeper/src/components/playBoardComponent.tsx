import { GameStatusEnum } from "../App";
import { BombSvg, FlagSvg, ExplosionSvg } from "./svgComponent";

interface PosInterface {
  posX: number;
  posY: number;
}

export interface SquareInterface {
  isHidden: boolean;
  hasBomb: boolean;
  isDetonated: boolean;
  flagPlaced: boolean;
  bomsAround: number;
}

type PlayBoardComponentProps = {
  board: SquareInterface[][];
  setBoard: (board: SquareInterface[][]) => void;
  gameStatus: GameStatusEnum;
  setGameStatus: (gameStatus: GameStatusEnum) => void;
  endGame: () => void;
}

type PlayBoardSquareComponentProps = {
  pos: PosInterface;
  square: SquareInterface;
  gameStatus: GameStatusEnum;
  onClick?: (pos: PosInterface, type: ClickedType ) => void;
}

enum ClickedType {
  normal = 'normal',
  flag = 'flag',
}

function getSquare(preload?: SquareInterface, modify?: Partial<SquareInterface>): SquareInterface {
  return {
    isHidden: modify?.isHidden != undefined ? modify.isHidden : (preload ? preload.isHidden : true),
    hasBomb: modify?.hasBomb != undefined ? modify.hasBomb : (preload ? preload.hasBomb : false),
    isDetonated: modify?.isDetonated != undefined ? modify.isDetonated : (preload ? preload.isDetonated : false),
    flagPlaced: modify?.flagPlaced != undefined ? modify.flagPlaced : (preload ? preload.flagPlaced : false),
    bomsAround: modify?.bomsAround != undefined ? modify.bomsAround : (preload ? preload.bomsAround : 0),
  }
}

function calculateBombsAround(board: SquareInterface[][], posX: number, posY: number ): number {
  let bombsAround = 0;
  if (board[posX][posY].hasBomb) return -1;
  for (let x = posX - 1; x <= posX + 1; x++) {
    for (let y = posY - 1; y <= posY + 1; y++) {
      if (x < 0 || y < 0 || x >= board.length || y >= board.length) continue;
      if (x === posX && y === posY) continue;
      if (board[x][y].hasBomb) bombsAround++;
    }
  }
  return bombsAround;
}

function calculateAllBombsAround(board: SquareInterface[][]): SquareInterface[][] {
  board.forEach((row, x) => {
    row.forEach((square, y) => {
      let newSquare = getSquare(square, {bomsAround: calculateBombsAround(board, x, y)});
      let newLine = board[x].slice(0, y).concat([newSquare]).concat(board[x].slice(y + 1));
      board[x] = newLine;
    });
  });
  return board;

}

export function createNewBoard(boardSize: number, minesCount: number): SquareInterface[][] {
  var board: SquareInterface[][] = Array<SquareInterface[]>(boardSize).fill(Array<SquareInterface>(boardSize).fill(getSquare()));
  let minesPlaced = 0;
  let tryPlaceMine = minesCount * 2;

  while (minesPlaced < minesCount) {
    let posX = Math.floor(Math.random() * boardSize);
    let posY = Math.floor(Math.random() * boardSize);
    if (!board[posX][posY].hasBomb) {
      let newSquare = getSquare(board[posX][posY], {hasBomb: true});
      let newLine = board[posX].slice(0, posY).concat([newSquare]).concat(board[posX].slice(posY + 1));
      board[posX] = newLine;
      minesPlaced++;
    }

    tryPlaceMine--;
    if (tryPlaceMine <= 0) {
      console.log("Can't place more mines, placed " + minesPlaced + " / " + minesCount);
      break;
    }
  }

  board = calculateAllBombsAround(board);  

  printOnConsoleBoard(board);
  return board;
}

function printOnConsoleBoard(board: SquareInterface[][]) {
  board.forEach((row, x) => {
    let line = "Line " + (x < 10 ? "0": "") + x + ": ";
    row.forEach(element => {
      line += element.hasBomb ? "[B]" : (element.bomsAround ? "[" + element.bomsAround + "]" : "[ ]");
      line += " ";
    });
    console.log(line);
  });
}

function PlayBoardSquareComponent({square, pos, gameStatus, onClick}: PlayBoardSquareComponentProps) {
  function handleClick(event: React.MouseEvent) {
    if (gameStatus === GameStatusEnum.running && square.isHidden) {
      if ( event.ctrlKey ) {
        onClick?.(pos, ClickedType.flag);
        return;
      }
      if (square.flagPlaced) return;
      onClick?.(pos, ClickedType.normal);
    }
  }
  
  return (
    <div
      className={"relative flex w-10 h-10 m-0.5 rounded border overflow-hidden"
        + (square.isHidden ? " bg-cyan-100/75" : " bg-trnasparent")
        + (gameStatus === GameStatusEnum.running && square.isHidden ? " cursor-pointer" : "")
      }
      onClick={ handleClick }>
        {square.flagPlaced && square.isHidden ? <FlagSvg /> : null}
        {!square.flagPlaced && !square.isHidden && !square.isDetonated && square.hasBomb ? <BombSvg /> : null}
        {!square.flagPlaced && !square.isHidden && square.isDetonated ? <ExplosionSvg fill="white"/> : null}
        {!square.flagPlaced && !square.isHidden && !square.isDetonated && square.bomsAround ?
          <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white pointer-events-none">{square.bomsAround}</h1>
          : null
        }
    </div>
  )
}

export default function PlayBoardComponent(props: PlayBoardComponentProps) {
  function updateBoard(pos: PosInterface, square: SquareInterface) {
    let newLine = props.board[pos.posX].slice(0, pos.posY).concat([square]).concat(props.board[pos.posX].slice(pos.posY + 1));
    let newBoard = props.board.slice(0, pos.posX).concat([newLine]).concat(props.board.slice(pos.posX + 1));
    props.setBoard(newBoard);
  }

  function handleClick(pos: PosInterface, type: ClickedType) {
    console.log("Clicked on [" + (pos.posX + 1) + ", " + (pos.posY + 1) + "], mode: " + type);
    let square = props.board[pos.posX][pos.posY];
    if (type === ClickedType.normal) {
      if (square.hasBomb) {
        console.log("\tDetonated!");
        let newSquare = getSquare(square, {isDetonated: true, isHidden: false});
        updateBoard(pos, newSquare);
        props.endGame();
      } else {
        let newSquare = getSquare(square, {isHidden: false});
        updateBoard(pos, newSquare);
      }
    } else if (type === ClickedType.flag) {
      let newSquare = getSquare(square, {flagPlaced: !square.flagPlaced});
      updateBoard(pos, newSquare);
    }
  }

  return (
    <>
      <div className="flex w-fill justify-center overflow-x-hidden">
          <div>
          {props.board.map((row, x) => 
              <div key={'board-row-' + x} className="flex flex-row">
                {row.map((square, y) => 
                  <div key={'board-row-' + x + '-col-' + y} className="flex">
                    <PlayBoardSquareComponent
                      pos={{posX: x, posY: y}}
                      square={square}
                      gameStatus={props.gameStatus}
                      onClick={ handleClick } />
                  </div>
                )}
              </div>
          )}
          </div>
      </div>
    </>
  );
}