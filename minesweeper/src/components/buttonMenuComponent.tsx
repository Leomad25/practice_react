import { GameMenuLabelsEnum } from "./gameMenuComponenet"

type Props = {
  isVisible?: boolean,
  label: GameMenuLabelsEnum,
  onClick: (label: GameMenuLabelsEnum) => void,
  children?: React.ReactNode,
}

export default function ButtonMenuComponent({isVisible, label, onClick, children}: Props) {
  return (
    <>
      <div className={!isVisible ? 'hidden': 'w-10 bg-blue-200 cursor-pointer hover:bg-blue-400 hover:border rounded'} onClick={() => { onClick(label) }}>
        {children}
        <p className="text-center select-none">{label}</p>
      </div>
    </>
  )
}