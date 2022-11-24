import React, { useState } from "react";
import {
  Formik,
  Field,
  FieldArray,
  ErrorMessage,
  FieldArrayRenderProps,
} from "formik";
import * as yup from "yup";
import { TextFieldFormik } from "../../components/input/TextFieldFormik";
import { CheckBoxFormik } from "../../components/input/CheckBoxFromik";
import { SelectFormik } from "../../components/input/SelectFormik";
import { EElementTypes } from "../../pages/AddElements";
import { IElement } from "../../interface";

interface IOption {
  label: string;
  value: string;
  type?: string;
}

const schema = yup.object().shape({
  y: yup.number().required().min(0).label("top"),
  x: yup.number().required().min(0).label("left"),
  width: yup.number().required().min(25),
  height: yup.number().required().min(25),
  name: yup.string().required(),
  signer: yup.string(),
  options: yup.array().of(
    yup.object().shape({
      label: yup.string().required("label is required"),
      value: yup.string().required("value is required"),
    })
  ),
});

const comparionsOptions: IOption[] = [
  { value: "=", label: "=" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
  { value: "<=", label: "<=" },
  { value: "=>", label: "=>" },
  { value: "<>", label: "<>" },
];

interface IUpdateFormProps {
  closeSettings: (value?: string | any) => void;
  updateElemet: (values: any, id?: string) => void;
  handleDelete: (id?: string) => void;
  initial: IElement;
  participantOptions: IOption[];
  elements: IElement[];
}
const UpdateForm: React.FC<IUpdateFormProps> = ({
  closeSettings,
  updateElemet,
  handleDelete,
  initial,
  participantOptions,
  elements,
}) => {
  const [enabledType, setEnabledType] = useState("");

  const handleTypeChange = (type: string) => {
    setEnabledType(type);
  };

  const onSubmit = (values: any) => {
    updateElemet(values);
    closeSettings();
  };

  const onDelete = () => {
    closeSettings();
    handleDelete();
  };

  const addOptions = (arrayHelper: FieldArrayRenderProps, values: any) => {
    return () => {
      arrayHelper.insert(values.options.length, {
        label: "label",
        value: "value",
      });
    };
  };
  const removeOption = (arrayHelper: FieldArrayRenderProps, index: number) => {
    return () => {
      arrayHelper.remove(index);
    };
  };
  const enabledOptions: IOption[] = [];
  elements
    .filter((el) => {
      return el.type !== EElementTypes.INITIALBOX && el.id !== initial.id;
    })
    .forEach((el) => {
      enabledOptions.push({
        label: el.name,
        value: el.id,
        type: el.type,
      });
    });

  const { options = [] } = initial;

  return (
    <div className="add_form">
      <Formik
        initialValues={{ ...initial, options }}
        validationSchema={schema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldTouched,
          setFieldValue,
          //  isSubmitting,
          /* and other goodies */
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className="row mt-2">
                <div className="col">
                  <TextFieldFormik
                    warpperClassName="form-floating form_input_text"
                    className="form-control element_input"
                    labelClassName="element_input_label"
                    name="name"
                    id="name"
                    placeholder="Name"
                    label="Name"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col">
                  <TextFieldFormik
                    warpperClassName="form-floating form_input_text"
                    className="form-control element_input"
                    labelClassName="element_input_label"
                    name="width"
                    id="width"
                    type="number"
                    placeholder="Width"
                    label="Width"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col">
                  <TextFieldFormik
                    warpperClassName="form-floating form_input_text"
                    className="form-control element_input"
                    labelClassName="element_input_label"
                    name="height"
                    id="height"
                    type="number"
                    placeholder="Height"
                    label="Height"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col">
                  <TextFieldFormik
                    warpperClassName="form-floating form_input_text"
                    className="form-control element_input"
                    labelClassName="element_input_label"
                    name="x"
                    id="x"
                    type="number"
                    placeholder="Left"
                    label="Left"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col">
                  <TextFieldFormik
                    warpperClassName="form-floating form_input_text"
                    className="form-control element_input"
                    labelClassName="element_input_label"
                    name="y"
                    id="y"
                    type="number"
                    placeholder="Top"
                    label="Top"
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col">
                  <SelectFormik
                    warpperClassName="form-floating"
                    className="form-select"
                    labelClassName="element_input_label"
                    name="signer"
                    id="signer"
                    label="Signer"
                    options={participantOptions}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    empty={false}
                  />
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-3">
                  <small className="font-sm">Required</small>
                </div>
                <div className="col-9 p-2">
                  <CheckBoxFormik
                    warpperClassName="form-check"
                    className="form-check-input"
                    name="required"
                    setFieldTouched={setFieldTouched}
                    setFieldValue={setFieldValue}
                    values={values}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-4">
                  <SelectFormik
                    warpperClassName="form-floating"
                    className="form-select"
                    labelClassName="element_input_label"
                    name="enabled_when"
                    id="enabled_when"
                    label="Field enabled when"
                    options={enabledOptions}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    values={values}
                    touched={touched}
                    errors={errors}
                    onSelect={handleTypeChange}
                  />
                </div>
                {enabledType === EElementTypes.TEXTBOX && (
                  <div className="col-2">
                    <SelectFormik
                      warpperClassName="form-floating"
                      className="form-select"
                      labelClassName="element_input_label"
                      name="comparison_operator"
                      id="comparison_operator"
                      label=""
                      options={comparionsOptions}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      values={values}
                      touched={touched}
                      errors={errors}
                      empty={false}
                    />
                  </div>
                )}
                {enabledType === EElementTypes.TEXTBOX && (
                  <div className="col-6">
                    <TextFieldFormik
                      warpperClassName="form-floating form_input_text"
                      className="form-control element_input"
                      labelClassName="element_input_label"
                      name="comparison_value"
                      id="comparison_value"
                      placeholder=""
                      label=""
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      values={values}
                      touched={touched}
                      errors={errors}
                    />
                  </div>
                )}
                {enabledType === EElementTypes.RADIOBOX && (
                  <div className="col-4 text-center">has value of</div>
                )}
                {enabledType === EElementTypes.RADIOBOX && (
                  <div className="col-4 text-center">
                    <button type={"button"}>val 0</button>
                  </div>
                )}
                {enabledType === EElementTypes.CHECKBOx && (
                  <div className="col-8 d-flex justify-content-around align-items-center">
                    <div>
                      <label htmlFor="checked">Checked</label>
                      <input className="" type={"checkbox"} id="checked" />
                    </div>
                    <div>
                      <label htmlFor="not_checked">Not Checked</label>
                      <input type={"checkbox"} id="not_checked" />
                    </div>
                  </div>
                )}
              </div>

              {initial.type === EElementTypes.LIST && (
                <FieldArray
                  name="options"
                  render={(arrayHelper) => {
                    return (
                      <div>
                        <div className="row mt-2">
                          <div className="col-6">label</div>
                          <div className="col-6">value</div>
                        </div>
                        {values.options &&
                          values.options.map(
                            (option: IOption, index: number) => {
                              return (
                                <div key={index} className="row mt-1">
                                  <div className="col-5">
                                    <Field
                                      className="form-control"
                                      name={`options.${index}.label`}
                                    />
                                    <span className="form-text text-danger">
                                      <ErrorMessage
                                        name={`options.${index}.label`}
                                      />
                                    </span>
                                  </div>
                                  <div className="col-5">
                                    <Field
                                      className="form-control"
                                      name={`options.${index}.value`}
                                    />
                                    <span className="form-text text-danger">
                                      <ErrorMessage
                                        className="form-text text-danger"
                                        name={`options.${index}.value`}
                                      />
                                    </span>
                                  </div>
                                  <div className="col-2">
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={removeOption(arrayHelper, index)}
                                    >
                                      <i className="fa-regular fa-trash"></i>
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        <button
                          className="btn btn-primary mt-2"
                          type="button"
                          onClick={addOptions(arrayHelper, values)}
                        >
                          +
                        </button>
                      </div>
                    );
                  }}
                />
              )}

              <div className="d-flex mt-3 justify-content-center">
                <button
                  className="btn btn-warning mx-2"
                  onClick={closeSettings}
                >
                  Cancel
                </button>

                <button className="btn btn-danger mx-2" onClick={onDelete}>
                  Delete
                </button>

                <button type="submit" className="btn btn-success mx-2">
                  Apply
                </button>
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default UpdateForm;
