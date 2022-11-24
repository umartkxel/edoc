import React from "react";
import { Rnd } from "react-rnd";
import { pxStringToNumber } from "../../../helpers/pxStringToNumber";
interface IProps {
  width: number;
  height: number;
  x: number;
  y: number;
  index: number;
  name: string;
  id: string;
  backgroundColor?: string;
  setUpdatingElement(val: boolean): void;
  toggleSettings(val?: string): void;
  updateElemet(values: any, name?: string): void;
  scale: number;
}
const CheckBox: React.FC<IProps> = ({
  width,
  height,
  x,
  y,
  name,
  id,
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
      //  default={{ x, y, width, height }}
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
          name
        );
      }}
      bounds="parent"
    >
      <div
        onDoubleClick={() => {
          toggleSettings(id);
        }}
        onMouseUp={setUpdatingOff}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor,
          color: "black",
          fontWeight: "bold",
          textAlign: "center",
          verticalAlign: "center",
        }}
      >
        <span>C</span>
      </div>
    </Rnd>
  );
};
export default CheckBox;
