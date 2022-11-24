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
  backgroundColor?: string;
  setUpdatingElement(val: boolean): void;
  toggleSettings(val?: string): void;
  updateElemet(values: any, id?: string): void;
  scale: number;
}
const InitialBox: React.FC<IProps> = ({
  width,
  height,
  x,
  y,
  id,
  backgroundColor = "#D7AF7B",
  setUpdatingElement,
  toggleSettings,
  updateElemet,
  scale,
}) => {
  console.log();
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
        style={{
          width: "100%",
          height: "100%",
          backgroundColor,
          color: "black",
          fontWeight: "bold",
          border: "2px solid black",
          fontStyle: "italic",
          textAlign: "center",

          letterSpacing: "2px",
        }}
      >
        ii
      </div>
    </Rnd>
  );
};
export default InitialBox;
