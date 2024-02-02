import { useState } from "react";

import { SettingsSvg, PlaySvg, RefreshSvg } from "./svgComponent";
import ButtonMenuComponent from "./buttonMenuComponent";
import { GameStatusEnum } from "../App";

export enum GameMenuLabelsEnum {
  start = 'start',
  reset = 'reset',
}

interface IsVisibleButtons {
  start: boolean;
  reset: boolean;
}

type GameMenuComponenetProps = {
  gameStatus: GameStatusEnum;
  changueGameStatus: (gameStatus: GameStatusEnum) => void;
}

export default function GameMenuComponenet({gameStatus, changueGameStatus}: GameMenuComponenetProps) {
  const [isVisibleButtons, setVisibleButtons] = useState<IsVisibleButtons>({start: true, reset: false});

  function onClickMenu(label: GameMenuLabelsEnum) {
    let newStatus: GameStatusEnum = GameStatusEnum.beforeStart;
    switch (label) {
      case GameMenuLabelsEnum.start:
        newStatus = GameStatusEnum.configuring;
        break;
      case GameMenuLabelsEnum.reset:
        newStatus = GameStatusEnum.beforeStart;
        break;
    }
    changueGameStatus(newStatus);
    updateButtonsVisibility(newStatus);
  }

  function updateButtonsVisibility(newStatus: GameStatusEnum) {
    switch (newStatus) {
      case GameStatusEnum.beforeStart:
        setVisibleButtons({start: true, reset: false});
        break;
      case GameStatusEnum.configuring:
        setVisibleButtons({start: false, reset: true});
        break;
      case GameStatusEnum.running:
        setVisibleButtons({start: false, reset: true});
        break;
    }
  }

  return (
    <>  
      <div className="flex h-50 bg-blue-300 w-full sm:w-5/6 sm:rounded p-1">
        <div className="flex select-none items-center"><SettingsSvg width={40} /></div>
        <div className="w-1 h-full bg-black ml-1 mr-1 select-none"></div>
        <div className="flex justify-end w-full">
          <ButtonMenuComponent isVisible={isVisibleButtons.start} label={GameMenuLabelsEnum.start} onClick={onClickMenu}>
            <PlaySvg width={40} />
          </ButtonMenuComponent>
          <ButtonMenuComponent isVisible={isVisibleButtons.reset} label={GameMenuLabelsEnum.reset} onClick={onClickMenu}>
            <RefreshSvg width={40} />
          </ButtonMenuComponent>
        </div>
      </div>
    </>
  )
}