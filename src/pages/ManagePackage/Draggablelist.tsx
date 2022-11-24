import React, { useEffect, useState } from "react";
import "./managepackage.css";
import { Formik } from "formik";
import * as yup from "yup";
import { TextFieldFormik } from "../../components/input/TextFieldFormik";
import { CheckBoxFormik } from "../../components/input/CheckBoxFromik";
import List from "./List";
import { connect } from "react-redux";
import { IStoreState } from "../../reducers";
import {
  IApiPackage,
  IParticipants,
  IRequestDoc,
  IReviewDoc,
  ISigningDoc,
} from "../../interface";
import { adaptParticipant, adaptSigset } from "../../helpers/adapters";
import { hex32Toa, stringToHex32 } from "../../helpers/hex32toa";
import { addPackage } from "../../actions/packages";
import { useNavigate } from "react-router-dom";
import { resetState } from "../../actions/settings";
import Modal from "../../components/general/Modal";

export type DraggableListProps = {
  current_package_name: string;
  participants: IParticipants[];
  selectedPackage: IApiPackage | null;
  user: any;
  host: string;
  session: string | null;
  maxx: number[];
  maxy: number[];
  sigining_docs: ISigningDoc[];
  requested_docs: IRequestDoc[];
  review_docs: IReviewDoc[];
  element: any[][];
  values: {
    name: string;
    value: string;
  }[][];
  selectedSharing: string[][];
  targettable: string[];
  total: number[];
  requestUser: number[][];
  reviewUser: number[][];
  message: string;
  loader: boolean;
  addPackage(payload: any): void;
  resetState(): void;
};

const DraggableList = React.memo((props: DraggableListProps) => {
  const {
    current_package_name,
    participants,
    selectedPackage,
    user,
    session,
    host,
    maxx,
    maxy,
    sigining_docs,
    requested_docs,
    review_docs,
    element,
    values,
    selectedSharing,
    total,
    targettable,
    requestUser,
    reviewUser,
    message,
    loader,
    addPackage,
    resetState,
  } = props;

  const navigate = useNavigate();
  const [cancelWarning, setCancelWarning] = useState(false);

  useEffect(() => {
    if (message === "pkg created") {
      navigate("/app");
    }
  }, [message]); // eslint-disable-line react-hooks/exhaustive-deps
  const initialValues = {
    package_name: selectedPackage ? selectedPackage.name : current_package_name,
    notification_name: selectedPackage
      ? selectedPackage.notificationname
      : user.fullname,
    notification_email: selectedPackage
      ? selectedPackage.notificationemail
      : user.email,
    URL_field_name: selectedPackage
      ? hex32Toa(selectedPackage.redirecturl)
      : "",
    force_signers_check_box: selectedPackage
      ? selectedPackage.forcename
      : false,
  };
  const schema = yup.object().shape({
    package_name: yup.string().required(),
    notification_name: yup.string().required(),
    notification_email: yup.string().required(),
    URL_field_name: yup.string(),
    signer_as: yup.string().when("password_check_box", {
      is: true,
      then: yup.string().required(),
    }),
  });

  const onCreate = (val: any) => {
    const signers = participants.map((p, i) => {
      return adaptParticipant(p, i);
    });
    let presentationorder = "";
    const signingDocs = sigining_docs.map((s, i) => {
      const addedParticipant: { [key: string]: any } = {};
      const signatureboxes = element[i].map((e) => {
        addedParticipant[e.signer] = signers.find((s) => s.id === e.signer - 0);
        return adaptSigset(e, maxx[i], maxy[i], total[i]);
      });
      presentationorder = presentationorder + s.display_name + ",";
      const obj: any = {
        session,
        controlid: user.controlid,
        formname: sigining_docs[i].display_name,
        sendcopy: 0,
        triggers: [],
        signatureboxes,
        sharingids: selectedSharing[i] || [],
        indexfields: values[i] || [],
        targettable: targettable[i] || [],
        files: [sigining_docs[i].uniqnm],
        presentationorder: sigining_docs[i].display_name,
        signers: Object.values(addedParticipant),
        forcename: val.force_signers_check_box,
        redirecturl: val.URL_field_name,
        host,
      };
      return obj;
    });

    const reviewDocs = review_docs.map((r, i) => {
      const docSigner: any[] = [];
      reviewUser[i].forEach((key) => {
        const foundUser = signers.find((p) => p.id === key);
        docSigner.push(foundUser);
      });
      presentationorder = presentationorder + r.display_name + ",";
      const obj = {
        session,
        controlid: user.controlid,
        signers: docSigner,
        formname: r.display_name,
        pkgname: current_package_name,
        files: [r.uniqnm],
        presentationorder: r.display_name,
        host,
        action: "CREATEREFDOC",
      };
      return obj;
    });

    const requestDocs = requested_docs.map((r, i) => {
      const docSigner: any[] = [];
      requestUser[i].forEach((key) => {
        const foundUser = signers.find((p) => p.id === key);
        docSigner.push(foundUser);
      });
      const obj = {
        session,
        controlid: user.controlid,
        signers: docSigner,
        formname: r.name,
        host,
        formmessage: stringToHex32(r.message),
        action: "CREATEREQDOC",
        indexing: [],
      };
      return obj;
    });
    presentationorder = presentationorder.slice(0, -1);
    const payload = {
      signingDocs,
      reviewDocs,
      requestDocs,
      presentationorder,
      package: {
        id: selectedPackage ? selectedPackage.id : "",
        session,
        controlid: user.controlid,
        action: "CREATE",
        host,
        username: user.username,
        pkgname: val.package_name,
        notificationemail: "",
        notificationname: "",
      },
    };
    console.log(payload);
    //addPackage(payload);
  };
  const onCancel = () => {
    navigate("/app/");
    resetState();
  };
  const toggleCancelWarning = () => {
    setCancelWarning(!cancelWarning);
  };
  const disabled = selectedPackage !== null;
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onCreate}
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
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className="main_container">
              <div style={{ display: "flex" }}>
                <div className="folder">
                  <p>Manage Package</p>
                  <div>
                    <button
                      className="btn manage_btn"
                      type="button"
                      disabled={loader}
                    >
                      Events
                    </button>
                    <button
                      className="btn manage_btn"
                      type="button"
                      disabled={loader}
                      onClick={toggleCancelWarning}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn manage_btn"
                      type="submit"
                      disabled={loader}
                    >
                      Save
                    </button>
                  </div>
                </div>
                <div className="triangle"></div>
              </div>

              <div className="belowFolder">
                <div className="internalDiv">
                  <div className="packagename_field mb-3">
                    <div className="d-flex align-items-center flex-1">
                      <div className="field_name"> Package Name: </div>
                      <div className="field_input flex-1">
                        <TextFieldFormik
                          warpperClassName="form-group"
                          name="package_name"
                          id="package_name"
                          placeholder=""
                          label=""
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          values={values}
                          touched={touched}
                          errors={errors}
                          autoComplete={"off"}
                          disabled={disabled || loader}
                        />
                      </div>
                    </div>

                    <div className="d-flex flex-1 justify-content-end">
                      <button className="btn_fieldinput" disabled={loader}>
                        <i className="fa-solid fa-paper-plane-top fa-xl icon-color"></i>
                        Send
                      </button>

                      <button
                        className="btn_fieldinput"
                        disabled={loader}
                        type="button"
                        onClick={toggleCancelWarning}
                      >
                        <i className="fa-sharp fa-solid fa-ban fa-xl icon-color"></i>
                        Cancel
                      </button>

                      <button
                        className="btn_fieldinput"
                        disabled={loader}
                        type="button"
                        onClick={toggleCancelWarning}
                      >
                        <i className="fa-sharp fa-solid fa-trash fa-xl icon-color"></i>
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="notification_field mb-3">
                    <div className="d-flex flex-1 align-items-center">
                      <div className="field_name">Notification Name:</div>
                      <div className="field_input flex-1">
                        <TextFieldFormik
                          warpperClassName="form-group"
                          name="notification_name"
                          id="notification_name"
                          placeholder=""
                          label=""
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          values={values}
                          touched={touched}
                          errors={errors}
                          autoComplete={"off"}
                          disabled={disabled || loader}
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-1 align-items-center">
                      <div className="field_name">Notification Email: </div>
                      <div className="field_input flex-1">
                        <TextFieldFormik
                          warpperClassName="form-group"
                          name="notification_email"
                          id="notification_email"
                          placeholder=""
                          label=""
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                          values={values}
                          touched={touched}
                          errors={errors}
                          autoComplete={"off"}
                          disabled={disabled || loader}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="URL_field mb-3">
                    <div className="field_name">Redirect URL:</div>
                    <div className="URL_field_input">
                      <TextFieldFormik
                        warpperClassName="form-group"
                        name="URL_field_name"
                        id="URL_field_name"
                        placeholder=""
                        label=""
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        values={values}
                        touched={touched}
                        errors={errors}
                        autoComplete={"off"}
                        disabled={disabled || loader}
                      />
                    </div>
                  </div>

                  <div className="security_field mb-3">
                    <div className="field_name"> Added Security: </div>
                    <div className="p-2">
                      <CheckBoxFormik
                        className="form-check-input"
                        name="password-check-box"
                        disabled={loader}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        values={values}
                      />
                    </div>
                    <div>Password protect PDFs upon download</div>
                    <div className="sec_field_name ms-3">Password:</div>
                    <div className="security_field_input flex-1">
                      <TextFieldFormik
                        warpperClassName="form-group"
                        name="Password_field_name"
                        id="Password_field_name"
                        placeholder=""
                        label=""
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        values={values}
                        touched={touched}
                        errors={errors}
                        autoComplete={"off"}
                        disabled={loader}
                      />
                    </div>

                    <div className="p-2">
                      <CheckBoxFormik
                        className="form-check-input"
                        name="force_signers_check_box"
                        disabled={disabled || loader}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        values={values}
                      />
                    </div>
                    <p className="m-0">
                      Force signers to use typed names as signatures
                    </p>
                  </div>

                  <div className="Participants_field">
                    <p className="participant_heading">Participants:</p>
                    <List items={participants} />
                  </div>
                </div>
              </div>
            </div>
            {cancelWarning && (
              <Modal
                onClose={toggleCancelWarning}
                classes="bg-white rounded p-4 w-25"
              >
                <div>
                  <span>Cancel</span>
                  <hr />
                  <span>
                    All uploaded documents and information will be discarded. Do
                    you wish to continue?
                  </span>
                  <hr />
                  <div className="d-flex justify-content-end p-2">
                    <button
                      className="btn btn-primary"
                      onClick={toggleCancelWarning}
                    >
                      No
                    </button>
                    <button className="btn btn-success ms-3" onClick={onCancel}>
                      Yes
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </form>
        );
      }}
    </Formik>
  );
});

const mapStateToProps = (store: IStoreState) => {
  const {
    participant,
    file,
    packageState,
    auth,
    settings,
    elements,
    form,
    sharing,
  } = store;
  const { maxx, maxy, total } = settings;
  const { participants } = participant;
  const { current_package_name, sigining_docs, requested_docs, review_docs } =
    file;
  const { selectedPackage, message, loader } = packageState;
  const { user, ip: host, token: session } = auth;
  const { element } = elements;
  const { values, targettable } = form;
  const { selectedSharing, requestUser, reviewUser } = sharing;
  return {
    current_package_name,
    participants,
    selectedPackage,
    user,
    host,
    session,
    maxx,
    maxy,
    sigining_docs,
    requested_docs,
    review_docs,
    element,
    values,
    selectedSharing,
    targettable,
    total,
    requestUser,
    reviewUser,
    message,
    loader,
  };
};

export default connect(mapStateToProps, {
  addPackage,
  resetState,
})(DraggableList);
