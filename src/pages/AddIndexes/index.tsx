import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateHeaderTitle } from "../../actions/settings";
import Sidebar from "../../components/add-indexes/Sidebar";
import "./style.css";
import { IStoreState } from "../../reducers";
import { getForms, getSingleForm, saveIndexes } from "../../actions/form";
import { MAX_ZOOM, MIN_ZOOM } from "../../constants/index";
import PDFRightBar from "../../components/general/PDFRightBar";
import PDF from "../../components/add-participants/PDF";
import { IRequestDoc, IReviewDoc, ISigningDoc } from "../../interface";
import { useNavigate } from "react-router-dom";

interface IProps {
  targettables: { form: string; targettable: string }[];
  forms: string[];
  singleForm: { fields: { fieldname: string; fieldtype: string }[] };
  current_package_name: string;
  current_doc: number;
  index: number;
  count: number;
  current_review_doc: number;
  requested_docs: IRequestDoc[];
  review_docs: IReviewDoc[];
  sigining_docs: ISigningDoc[];
  loader: boolean;
  values: {
    name: string;
    value: string;
  }[][];
  targettable: string[];
  saveIndexes(payload: any): void;
  updateHeaderTitle(args: any): void;
  getForms(payload?: any): void;
  getSingleForm(payload?: any): void;
}
const AddIndexes: React.FC<IProps> = (props) => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSideBarCollapsed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const toggleSidebar = () => {
    setSideBarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    props.updateHeaderTitle({ header_title: "Adding Indexing..." });
    props.getForms();
    return () => {
      props.updateHeaderTitle({ header_title: "" });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleZoomOut = () => {
    const newZoom = zoom - 0.25;
    if (newZoom >= MIN_ZOOM) {
      setZoom(newZoom);
    }
  };

  const handleZoomIn = () => {
    const newZoom = zoom + 0.25;
    if (newZoom <= MAX_ZOOM) {
      setZoom(newZoom);
    }
  };

  const handleNext = () => {
    navigate("/app/addElements");
  };

  const { sigining_docs } = props;
  let file = "";
  if (sigining_docs[props.current_doc]) {
    file = sigining_docs[props.current_doc].uniqnm;
  }

  return (
    <div className={"indexes_container"}>
      <div className="indexes_sidebar">
        <Sidebar
          targettables={props.targettables}
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          forms={props.forms}
          getSingleForm={props.getSingleForm}
          form={props.singleForm}
          loader={props.loader}
          onSave={props.saveIndexes}
          index={props.current_doc}
          initialValues={props.values}
          selectedTable={props.targettable}
        />
      </div>
      <div className="indexes_content">
        <div
          style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
          className="indexes_content_main"
        >
          <PDF file={file} />
        </div>
      </div>
      <div className="indexes_header">
        <div className="indexes_header_container">
          <div>
            <div>
              <span className="fa-layers fa-fw fa-2x">
                <i className="fa fa-folder folder-icon"></i>
                <span className="fa-layers-text w-100 text-white folder-icon-text">
                  {props.count}
                </span>
              </span>
            </div>
            <div className="indexes_header_documents">
              <span>Document</span>
              <br />
              <span>
                {props.index + 1} of {props.count}
              </span>
            </div>
          </div>
          <div>
            <h5>Package : {props.current_package_name}</h5>
            <span>zoom {zoom}</span>
          </div>
          <div className="indexes_header_zoom_container">
            <div className="d-flex justify-content-end align-items-center">
              <div className="pt-2" onClick={handleZoomOut}>
                <i className="fa-solid fa-magnifying-glass-minus zoom-icon"></i>
              </div>
              <div>
                <span className="zoom-icon-seprator">|</span>
              </div>
              <div className="pt-2" onClick={handleZoomIn}>
                <i className="fa-solid fa-magnifying-glass-plus zoom-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="indexes_rightbar pt-3">
        <button className="btn btn-primary" onClick={handleNext}>
          Next
        </button>
        <div>
          <PDFRightBar file={file} />
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state: IStoreState) => {
  const { settings, form, file } = state;
  const { index, current_doc, current_review_doc } = settings;
  const {
    forms,
    targettables,
    form: singleForm,
    loader,
    values,
    targettable,
  } = form;
  const {
    count,
    sigining_docs,
    requested_docs,
    review_docs,
    current_package_name,
  } = file;
  return {
    current_doc,
    current_review_doc,
    forms,
    targettables,
    singleForm,
    loader,

    values,
    targettable,
    index,
    count,
    sigining_docs,
    requested_docs,
    review_docs,
    current_package_name,
  };
};

export default connect(mapStateToProps, {
  updateHeaderTitle,
  getForms,
  getSingleForm,
  saveIndexes,
})(AddIndexes);
