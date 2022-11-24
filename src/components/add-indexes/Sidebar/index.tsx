import React, { useState } from "react";
import { Loader } from "../../general/Loader";
import "./style.css";
import { Formik, FieldArray } from "formik";
import * as yup from "yup";
import { TextField } from "../../input//field/TextField";
import {
  createNotification,
  IActionType,
} from "../../../helpers/notificationHelper";

const schema = yup.object().shape({
  fields: yup.array().of(
    yup.object().shape({
      name: yup.string().required("name is required"),
      value: yup.string().required("value is required"),
    })
  ),
});

interface IProps {
  sidebarCollapsed: boolean;
  forms: string[];
  targettables: { form: string; targettable: string }[];
  loader: boolean;
  form: { fields: { fieldname: string; fieldtype: string }[] };
  index: number;
  initialValues: {
    name: string;
    value: string;
  }[][];
  selectedTable: string[];
  onSave(payload: any): void;
  toggleSidebar(): void;
  getSingleForm(payload?: any): void;
}

const DisplayObj: React.FC<{
  fields: { fieldname: string; fieldtype: string }[];
  initialValues: {
    name: string;
    value: string;
  }[];
  onSave: any;
}> = ({ fields, onSave, initialValues }) => {
  const initialFields = fields.map((f, i) => {
    return {
      name: f.fieldname,
      value: "",
    };
  });

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        fields: initialFields,
      }}
      validationSchema={schema}
      onSubmit={onSave}
    >
      {({ values, handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className="mt-2 d-flex justify-content-between align-items-center">
              <div>
                <button type="submit" className="update_button">
                  Update
                </button>
              </div>
              <div></div>
            </div>
            <hr></hr>
            <FieldArray
              name={"fields"}
              render={(arrayHelper) => {
                return (
                  <div className="w-100">
                    <div className="row">
                      <div className="col-5">
                        <p className="align-left">Field Name</p>
                      </div>
                      <div className="col-5">
                        <p className="align-left">Field Value</p>
                      </div>
                      <div className="col-2">
                        <span
                          onClick={() => {
                            arrayHelper.insert(values.fields.length, {
                              name: "",
                              values: "",
                            });
                          }}
                        >
                          <i
                            className="fas fa-plus FAStandardIcon"
                            data-fa-transform="shrink-8 right-3"
                            data-fa-mask="fas fa-notebook"
                            style={{ cursor: "pointer" }}
                            title="Add Index"
                          ></i>
                        </span>
                      </div>
                    </div>
                    {values["fields"] &&
                      values["fields"].map((option: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="row align-items-center mt-1"
                          >
                            <div className="col-5 px-1">
                              <TextField
                                name={`fields.${index}.name`}
                                label=""
                                placeholder="Name"
                              />
                            </div>
                            <div className="col-5 p-0">
                              <TextField
                                name={`fields.${index}.value`}
                                label=""
                                placeholder="Value"
                              />
                            </div>
                            <div
                              className="col-2"
                              onClick={() => {
                                arrayHelper.remove(index);
                              }}
                            >
                              <i className="fa fa-trash-alt FAStandardIcon mx-1" />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              }}
            />
          </form>
        );
      }}
    </Formik>
  );
};

const Sidebar: React.FC<IProps> = (props) => {
  const [selectedTable, setSelectedTable] = useState(
    props.selectedTable[props.index]
  );
  const [selectedForm, setSelectedForm] = useState("");
  const targettableKeys: { [key: string]: string } = {};
  props.targettables.forEach((t) => {
    targettableKeys[t.targettable] = "";
  });
  return (
    <div>
      <div
        onClick={props.toggleSidebar}
        className="sidebar_header-icon-container"
        style={{ display: props.sidebarCollapsed ? "inline-block" : "none" }}
      >
        <i className="fa-solid fa-angles-right sidebar_icon" />
      </div>

      <div
        className="sidebar_header-container"
        style={{ display: props.sidebarCollapsed ? "none" : "grid" }}
      >
        <div className="sidebar_header">
          <p>Indexing</p>
        </div>
        <div onClick={props.toggleSidebar}>
          <i className="fa-solid fa-angles-left sidebar_icon" />
        </div>
      </div>

      <div className="row mt-2 align-items-center">
        <label className="col-5 p-0">Target Table</label>
        <select
          value={selectedTable}
          className="col-7 p-0"
          placeholder="Loans"
          onChange={(e) => {
            setSelectedTable(e.target.value);
          }}
        >
          <option value={""}></option>
          {Object.keys(targettableKeys).map((t) => {
            return (
              <option key={t} value={t}>
                {t}
              </option>
            );
          })}
        </select>
      </div>

      <div className="row mt-2 align-items-center">
        <label className="col-5 p-0">Index Definition</label>
        <select
          className="col-7 p-0"
          placeholder="Auto_Loan Application"
          value={selectedForm}
          onChange={(e) => {
            setSelectedForm(e.target.value);
            props.getSingleForm(e.target.value);
          }}
        >
          <option value={""}></option>
          {props.targettables
            .filter((t) => t.targettable === selectedTable)
            .map((t) => {
              return (
                <option key={t.form} value={t.form}>
                  {t.form}
                </option>
              );
            })}
        </select>
      </div>

      <div className="indexes_conatiner d-grid justify-content-center">
        {props.loader ? (
          <div className="text-center">
            <Loader />
          </div>
        ) : (
          <DisplayObj
            fields={props.form.fields}
            initialValues={props.initialValues[props.index]}
            onSave={(values: any) => {
              createNotification(IActionType.success, "Indexes saved.");
              props.onSave({
                targettable: selectedTable,
                values: values.fields,
                index: props.index,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};
export default Sidebar;
