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
  setUpdatingElement(val: boolean): void;
  backgroundColor?: string;
  toggleSettings(val?: string): void;
  updateElemet(values: any, id?: string): void;
  scale: number;
}
const Signature: React.FC<IProps> = ({
  width,
  height,
  x,
  y,
  id,
  name,
  setUpdatingElement,
  backgroundColor,
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
      onResizeStart={(e) => {
        e.stopPropagation();
        setUpdatingOn();
      }}
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
      bounds=".element_content"
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
          textAlign: "center",
        }}
      >
        {name}
      </div>
    </Rnd>
  );
};
export default Signature;
