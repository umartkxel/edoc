import React from "react";
import { Rnd } from "react-rnd";
import { pxStringToNumber } from "../../../helpers/pxStringToNumber";
interface IProps {
  width: number;
  height: number;
  x: number;
  y: number;
  index: number;
  id: string;
  name: string;
  backgroundColor?: string;
  setUpdatingElement(val: boolean): void;
  toggleSettings(val?: string): void;
  updateElemet(values: any, id?: string): void;
  scale: number;
}
const Memo: React.FC<IProps> = ({
  width,
  height,
  x,
  y,
  id,
  name,
  backgroundColor = "#D7AF7B",
  setUpdatingElement,
  toggleSettings,
  updateElemet,
  scale,
}) => {
  const setUpdatingOn = () => {
    setUpdatingElement(true);
  };

  const setUpdatingOff = () => {
    setUpdatingElement(false);
  };

  return (
    <Rnd
      // default={{ x, y, width, height }}
      scale={scale}
      position={{ x, y }}
      size={{ width, height }}
      onMouseDown={setUpdatingOn}
      onResizeStart={setUpdatingOn}
      onDragStop={(e, d) => {
        if (!(d.x === x && d.y === y)) {
          updateElemet({ x: d.x, y: d.y }, id);
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setUpdatingOff();
        updateElemet(
          {
            width: pxStringToNumber(ref.style.width),
            height: pxStringToNumber(ref.style.height),
          },
          id
        );
      }}
      bounds="parent"
    >
      <div
        onDoubleClick={() => toggleSettings(id)}
        onMouseUp={setUpdatingOff}
        className="memo"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor,
        }}
      >
        {name}
      </div>
    </Rnd>
  );
};
export default Memo;
