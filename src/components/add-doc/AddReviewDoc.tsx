import CustomDropZone from "../../components/input/DropZone";
import React, { useState } from "react";
import TemplatesModal from "./TemplatesModal";
import AddReferenceModal from "./AddReferenceModal";
import { FieldArray } from "formik";
import { TextField } from "../input/field/TextField";
import { IApiTemplate } from "../../interface";
import { ApiService } from "../../services/apiService";
import PendingDocModal from "./PendingDocModal";

interface IProps {
  host: string;
  session: string;
  controlid: string;
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

const AddReviewDoc: React.FC<IProps> = (props) => {
  const { values, name, setFieldTouched, setFieldValue, touched, errors } =
    props;
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [loadingTempDetails, setLoadingTempDetails] = useState(false);
  const [showPedingDoc, setShowPendingDoc] = useState(false);

  const toggleTemplateModal = () => {
    setShowTemplateModal(!showTemplateModal);
  };
  const color =
    values[name] && values[name].length > 0 ? "green py-2" : "green";

  const onChoose = async (temp?: IApiTemplate) => {
    try {
      if (temp) {
        setLoadingTempDetails(true);
        const body = {
          session: props.session,
          host: props.host,
          cont: props.controlid,
          action: "EDIT",
          docid: temp.id,
        };
        const res = await ApiService.post("/TEMPLATES/", body);
        const { form, graphic: uniqnm } = res;

        const object = {
          form,
          display_name: form,
          uniqnm,
          is_template: true,
          template_applied: false,
        };

        setFieldValue(name, [...values[name], object]);
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
    } catch (e) {
      setLoadingTempDetails(false);
    }
  };
  const tooglePendingDoc = () => {
    setShowPendingDoc(!showPedingDoc);
  };

  return (
    <div className="review_dropzone_container">
      <CustomDropZone
        modal={
          <AddReferenceModal
            onClose={() => {}}
            onTemplateClick={toggleTemplateModal}
            onUploadClick={() => {}}
            onPendingDocsClick={tooglePendingDoc}
          />
        }
        color={color}
        header_text="Document for Review"
        name={name}
        values={values}
        setFieldTouched={setFieldTouched}
        setFieldValue={setFieldValue}
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
                          <i className="fas fa-file FAFileIcon Green" />
                        </div>
                        <div className="flex-fill ps-3">
                          <TextField
                            name={`${name}.${index}.display_name`}
                            label=""
                            labelClassName="d-none"
                            placeholder="Enter filename"
                          />
                        </div>
                        <div>
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
            or click add icon to select a decument be reviewed or template to
            send (.pdf, .doc, .png, .jpg, .tff)
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
          type={"Reference"}
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

export default AddReviewDoc;
