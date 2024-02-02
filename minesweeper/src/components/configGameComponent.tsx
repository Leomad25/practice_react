export interface ConfigGame {
  gameSize: number;
  mines: number;
}

type ConfigGameComponentProps = {
  onStarGame: () => void;
}

export default function ConfigGameComponent({ onStarGame }: ConfigGameComponentProps) {

  return (
    <>
      <div className="flex flex-col w-full justify-center">
        <div className="flex">
        </div>
        <div className="flex justify-center">
          <div className="flex p-2 bg-blue-400 border rounded cursor-pointer" onClick={onStarGame}>
            <p>Start Game</p>
          </div>
        </div>
      </div>
    </>
  );
}