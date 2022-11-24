import CustomDropZone from "../../components/input/DropZone";
import React, { useState } from "react";
import AddDocModal from "./AddDocModal";
import TemplatesModal from "./TemplatesModal";
import { FieldArray } from "formik";
import { TextField } from "../input/field/TextField";
import { IApiTemplate } from "../../interface";
import { ApiService } from "../../services/apiService";
import PendingDocModal from "./PendingDocModal";

interface IProps {
  inputProps?: {};
  name: string;
  values: any;
  errors: any;
  touched: any;
  host: string;
  session: string;
  controlid: string;
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

const AddSigningDoc: React.FC<IProps> = ({
  setFieldTouched,
  setFieldValue,
  name,
  values,
  touched,
  errors,
  session,
  controlid,
  host,
}) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [loadingTempDetails, setLoadingTempDetails] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [showPedingDoc, setShowPendingDoc] = useState(false);

  const toggleTemplateModal = () => {
    setShowTemplateModal(!showTemplateModal);
    setSelectedFile("");
  };

  const handleApplyTempToggale = (file: string = "") => {
    toggleTemplateModal();
    setSelectedFile(file);
  };

  const applyTemplate = (file: string) => {
    setSelectedFile(file);
    setShowTemplateModal(true);
  };

  const tooglePendingDoc = () => {
    setShowPendingDoc(!showPedingDoc);
  };

  const onChoose = async (temp?: IApiTemplate) => {
    try {
      if (temp) {
        setLoadingTempDetails(true);
        const body = {
          session: session,
          host: host,
          cont: controlid,
          action: "EDIT",
          docid: temp.id,
        };
        const res = await ApiService.post("/TEMPLATES/", body);
        const { form, graphic: uniqnm, ...rest } = res;

        const object = {
          form,
          display_name: form,
          uniqnm,
          is_template: true,
          template_applied: false,
          ...rest,
        };

        if (selectedFile) {
          const clone = [...values[name]];
          const index = clone.findIndex((f) => f.uniqnm === selectedFile);
          if (index > -1) {
            delete object.uniqnm;
            const newObject = { ...object, ...clone[index] };
            clone[index] = newObject;
            setFieldValue(name, clone);
          }
        } else {
          setFieldValue(name, [...values[name], object]);
        }

        setFieldTouched(name, true);
        if (!values["current_package_name"]) {
          const date = new Date();
          const str =
            date.getMonth() +
            1 +
            "-" +
            date.getDate() +
            "-" +
            date.getFullYear();

          setFieldValue("current_package_name", temp.name + " " + str, false);
        }
        setLoadingTempDetails(false);
      }

      toggleTemplateModal();
      setSelectedFile("");
    } catch (e) {
      setSelectedFile("");
      setLoadingTempDetails(false);
    }
  };

  const color = values[name] && values[name].length > 0 ? "blue py-2" : "blue";

  return (
    <div>
      <CustomDropZone
        color={color}
        header_text="Document to Sign"
        toggleTemplateModal={handleApplyTempToggale}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
        name={name}
        values={values}
        modal={
          <AddDocModal
            onClose={() => {}}
            onTemplateClick={toggleTemplateModal}
            onUploadClick={() => {}}
            onUploadandApplyTemp={() => {}}
            onPendingDocsClick={tooglePendingDoc}
          />
        }
      >
        {values[name] && values[name].length > 0 ? (
          <FieldArray
            name={name}
            render={(arrayHelper) => {
              return (
                <div className="w-100">
                  {values[name].map((f: any, index: number) => {
                    return (
                      <div
                        key={f.uniqnm}
                        className="d-flex px-2 mt-1 align-items-center"
                      >
                        <div>
                          <i className="fas fa-file FAFileIcon color_blue" />
                        </div>
                        <div className="flex-fill ps-3">
                          {f.form ? (
                            <div className="row align-items-center">
                              <div className="col-6">
                                <TextField
                                  name={`${name}.${index}.display_name`}
                                  label=""
                                  labelClassName="d-none"
                                  placeholder="Enter filename"
                                />
                              </div>
                              <div className="col-6">
                                <span className="text-muted">({f.form})</span>
                              </div>
                            </div>
                          ) : (
                            <TextField
                              name={`${name}.${index}.display_name`}
                              label=""
                              labelClassName="d-none"
                              placeholder="Enter filename"
                            />
                          )}
                        </div>

                        <div>
                          {!f.is_template && (
                            <span
                              onClick={() => {
                                applyTemplate(f.uniqnm);
                              }}
                            >
                              <i className="fa fa-file-invoice FAStandardIcon mx-1" />
                            </span>
                          )}
                          <span
                            onClick={() => {
                              arrayHelper.remove(index);
                            }}
                          >
                            <i className="fa fa-trash-alt FAStandardIcon mx-1" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }}
          />
        ) : (
          <p className="dropzone_content">
            drag and drop, click <span className="upload_button">browse</span>{" "}
            or click add icon to select a decument or template for signin (.pdf,
            .doc, .png, .jpg, .tff)
            <br />
            {touched[name] && errors[name] && (
              <span style={{ color: "red", fontSize: "10px" }}>
                {errors[name]}
              </span>
            )}
          </p>
        )}
      </CustomDropZone>
      {showTemplateModal && (
        <TemplatesModal
          onClose={toggleTemplateModal}
          onChoose={onChoose}
          loadingDetails={loadingTempDetails}
        />
      )}
      {showPedingDoc && (
        <PendingDocModal
          onClose={tooglePendingDoc}
          onChoose={() => {
            console.log("on pending choose");
          }}
          loader={false}
        />
      )}
    </div>
  );
};
export default AddSigningDoc;
