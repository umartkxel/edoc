import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateHeaderTitle } from "../../actions/settings";
import { updateTotalParticipant } from "../../actions/participant";
import Sidebar from "../../components/add-participants/Sidebar";
import { IStoreState } from "../../reducers";

import { MAX_ZOOM, MIN_ZOOM } from "../../constants/index";
import PDFRightBar from "../../components/general/PDFRightBar";
import PDF from "../../components/add-participants/PDF";

import "./style.css";
import {
  IParticipants,
  IRequestDoc,
  IReviewDoc,
  ISigningDoc,
} from "../../interface";
import { useNavigate } from "react-router-dom";
interface IProps {
  participants: IParticipants[];
  total: number;
  index: number;
  count: number;
  current_package_name: string;
  current_doc: number;
  current_review_doc: number;
  current_requested_doc: number;
  requested_docs: IRequestDoc[];
  review_docs: IReviewDoc[];
  sigining_docs: ISigningDoc[];
  updateTotalParticipant(val?: any): void;
  updateHeaderTitle(args: any): void;
}

const AddParticipant: React.FC<IProps> = (props) => {
  const {
    participants = [],
    total,
    count,
    sigining_docs,
    requested_docs,
    review_docs,
  } = props;
  const [sidebarCollapsed, setSideBarCollapsed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setSideBarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    props.updateHeaderTitle({ header_title: "Adding Participants..." });
    if (count === 0) {
      navigate(-1);
    }
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
  const handleCreateDFC = () => {
    if (props.sigining_docs.length !== 0) {
      navigate("/app/addIndexes");
    } else {
      navigate("/app/addSharing");
    }
  };

  let file = "";
  let showDoc = true;
  let showReview = true;
  if (sigining_docs.length > 0) {
    file = sigining_docs[props.current_doc].uniqnm;
  } else if (review_docs.length > 0) {
    file =
      review_docs[props.current_review_doc] &&
      review_docs[props.current_review_doc].uniqnm;
    showReview = false;
  } else {
    showReview = false;
    showDoc = false;
  }

  return (
    <div className="participant_container">
      <div className="participants_sidebar">
        <Sidebar
          participants={participants}
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          updateTotalParticipant={updateTotalParticipant}
          total={total}
        />
      </div>
      {showDoc && showReview && (
        <div className="participants_header">
          <div className="participants_header_container">
            <div>
              <div>
                <span className="fa-layers fa-fw fa-2x">
                  <i className="fa fa-folder folder-icon"></i>
                  <span className="fa-layers-text w-100 text-white folder-icon-text">
                    {props.count}
                  </span>
                </span>
              </div>
              <div className="participants_header_documents">
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
            <div className="participants_header_zoom_container">
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
      )}
      {showDoc && showReview && (
        <div className="participants_content">
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
            className="participants_content_main"
          >
            <PDF file={file} />
          </div>
        </div>
      )}
      <div className="participants_rightbar pt-3">
        <button
          className="btn btn-primary"
          disabled={props.participants.length === 0}
          onClick={handleCreateDFC}
        >
          Next
        </button>
        {showDoc && showReview && (
          <div>
            <PDFRightBar file={file} />
          </div>
        )}
      </div>
      {!showDoc && !showReview && (
        <div className="participants_header">
          <div className="d-flex justify-content-center pt-3">
            <h3>
              {requested_docs[props.current_requested_doc] &&
                requested_docs[props.current_requested_doc].name}
            </h3>
          </div>
        </div>
      )}
      {!showReview && showDoc && (
        <div className="participants_header">
          <div className="d-flex justify-content-center pt-3">
            <h3>
              {review_docs[props.current_review_doc] &&
                review_docs[props.current_review_doc].display_name}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};
const mapStateToProps = (stroe: IStoreState) => {
  const { settings, participant, file } = stroe;
  const { participants, total } = participant;
  const { index, current_review_doc, current_requested_doc, current_doc } =
    settings;
  const {
    count,
    sigining_docs,
    requested_docs,
    review_docs,
    current_package_name,
  } = file;
  return {
    current_doc,
    current_requested_doc,
    current_review_doc,
    participants,
    total,
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
  updateTotalParticipant,
})(AddParticipant);
