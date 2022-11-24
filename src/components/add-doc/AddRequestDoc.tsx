import CustomDropZone from "../../components/input/DropZone";
import React, { useRef, useState } from "react";
import TemplatesModal from "./TemplatesModal";
import AddRequestModal from "./AddRequestModal";
import { FieldArray } from "formik";
import { TextField } from "../input/field/TextField";
import { IApiTemplate } from "../../interface";
import { hex32Toa } from "../../helpers/hex32toa";

interface IProps {
  name: string;
  values: any;
  errors: any;
  touched: any;
  setFieldValue(
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ): void;
  setFieldTouched(
    field: string,
    isTouched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ): void;
}

const AddRequestDoc: React.FC<IProps> = (props) => {
  const { name, values, setFieldValue, setFieldTouched, touched, errors } =
    props;
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const toggleTemplateModal = () => {
    setShowTemplateModal(!showTemplateModal);
  };
  const arrayHelpersRef = useRef<any>(null);
  const color =
    values[name] && values[name].length > 0 ? "yellow py-2" : "yellow";

  const handleScroll = () => {
    const el = document.getElementById("scroll_item");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };
  const onAdd = () => {
    setFieldValue(name, [...values[name], { name: "", message: "" }]);
    setFieldTouched(name, true);
    handleScroll();
  };
  const onChoose = (temp?: IApiTemplate) => {
    if (temp) {
      const newMessage = hex32Toa(temp.message);
      setFieldValue(name, [
        ...values[name],
        { name: temp.name, message: newMessage },
      ]);
      setFieldTouched(name, true);
      if (!values["current_package_name"]) {
        const date = new Date();
        const str =
          date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();

        setFieldValue("current_package_name", temp.name + " " + str, false);
      }
    }

    toggleTemplateModal();
    handleScroll();
  };
  return (
    <div className="upload_doc_dropzone_container">
      <CustomDropZone
        modal={
          <AddRequestModal
            onClose={() => {}}
            onTemplateClick={toggleTemplateModal}
            onAdd={onAdd}
          />
        }
        color={color}
        header_text="Document for Upload"
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        name={name}
        values={values}
      >
        {values[name] && values[name].length > 0 ? (
          <FieldArray
            name={name}
            render={(arrayHelper) => {
              arrayHelpersRef.current = arrayHelper;
              return (
                <div className="w-100">
                  {values[name] &&
                    values[name].map((option: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="d-flex align-items-center mt-1 px-3"
                        >
                          <div>
                            <i className="fas fa-file FAFileIcon color_yellow" />
                          </div>
                          <div className="flex-fill me-3 ms-2">
                            <TextField
                              warpperClassName="form-floating"
                              name={`${name}.${index}.name`}
                              label="Name"
                              placeholder="Type a name for requested document"
                            />
                          </div>
                          <div className="flex-fill">
                            <TextField
                              warpperClassName="form-floating"
                              name={`${name}.${index}.message`}
                              label="Message"
                              placeholder="Type message to signer"
                            />
                          </div>
                          <div
                            onClick={() => {
                              arrayHelper.remove(index);
                            }}
                          >
                            <i className="fa fa-trash-alt FAStandardIcon mx-1" />
                          </div>
                        </div>
                      );
                    })}
                  {/* <button
                          className="btn btn-primary mt-2"
                          type="button"
                          onClick={() =>
                            arrayHelper.insert(values[name].length, {
                              name: "",
                              message: "",
                            })
                          }
                        >
                          +
                        </button> */}
                </div>
              );
            }}
          />
        ) : (
          <p className="dropzone_content ps-5">
            click <span className="upload_button">here</span> or click add icon
            to request a signer securely upload a document or image (.pdf, .doc,
            .png, .jpg, .tff)
            <br />
            {touched[name] && errors[name] && (
              <span style={{ color: "red", fontSize: "10px" }}>
                {errors[name]}
              </span>
            )}
          </p>
        )}
        <div id="scroll_item" className="mb-2"></div>
      </CustomDropZone>
      {showTemplateModal && (
        <TemplatesModal
          type={"Requested"}
          onClose={toggleTemplateModal}
          onChoose={onChoose}
        />
      )}
    </div>
  );
};
export default AddRequestDoc;
