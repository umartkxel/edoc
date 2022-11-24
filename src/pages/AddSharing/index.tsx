import React, { useEffect, useState } from "react";
import "./AddSharing.css";
import { connect } from "react-redux";
import { IStoreState } from "../../reducers";
import {
  getSharings,
  saveSharings,
  saveRequestUser,
  saveReveiwUser,
} from "../../actions/sharing";
import {
  IApiGroup,
  IApiSharingUser,
  IParticipants,
  IRequestDoc,
  IReviewDoc,
  ISigningDoc,
} from "../../interface";
import { Loader } from "../../components/general/Loader";
import { MAX_ZOOM, MIN_ZOOM } from "../../constants/index";
import PDFRightBar from "../../components/general/PDFRightBar";
import PDF from "../../components/add-participants/PDF";
import {
  updateHeaderTitle,
  updateIndex,
  updateCurrentDoc,
  updateReviewDoc,
  updateRequestedDoc,
  updateCurrentPDFPage,
} from "../../actions/settings";
import { throttle } from "../../helpers/throttle";

import {
  createNotification,
  IActionType,
} from "../../helpers/notificationHelper";
import { useNavigate } from "react-router-dom";
import Reviewdocs from "../../components/select_docs/Reviewdocs";
import Requesteddocs from "../../components/select_docs/RequestedDocs";

interface IProps {
  loaded: boolean;
  loader: boolean;
  groups: IApiGroup[];
  users: IApiSharingUser[];
  current_page: number;
  count: number;
  current_package_name: string;
  index: number;
  current_doc: number;
  current_review_doc: number;
  current_requested_doc: number;
  requested_docs: IRequestDoc[];
  review_docs: IReviewDoc[];
  sigining_docs: ISigningDoc[];
  participants: IParticipants[];

  selectedSharing: string[][];
  requestUser: number[][];
  reviewUser: number[][];

  updateHeaderTitle(payload: any): void;
  updateIndex(): void;
  updateCurrentDoc(): void;
  updateReviewDoc(): void;
  updateRequestedDoc(): void;
  updateCurrentPDFPage(payload: any): void;
  getSharings(payload?: any): void;
  saveSharings(payload: any): void;
  saveRequestUser(payload: any): void;
  saveReveiwUser(payload: any): void;
}
const AddSharing: React.FC<IProps> = (props) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("users");
  const [zoom, setZoom] = useState(1);
  const [pageHeight, setPageHeight] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedSharing, setSelectedSharing] = useState<string[]>([]);
  const [docs, setDocs] = useState<string[]>([]);

  useEffect(() => {
    const el = document.getElementById("sharing_content");
    if (el) {
      el.onscroll = throttle((e: any) => {
        const page = Math.floor((el.scrollTop + 10) / pageHeight);
        props.updateCurrentPDFPage({
          current_page: page,
        });
      }, 300);
    }
  }, [pageHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    props.updateHeaderTitle({ header_title: "Document Set Up - Sharing" });
    if (!props.loaded) {
      props.getSharings();
    }
    console.log("called mount ");
    const newDocs: string[] = [];
    props.sigining_docs.forEach((element) => {
      newDocs.push("sigining_doc");
    });

    props.review_docs.forEach((s) => {
      newDocs.push("review_doc");
    });
    props.requested_docs.forEach((s) => {
      newDocs.push("requested_doc");
    });
    setDocs(newDocs);
    return () => {
      props.updateHeaderTitle("");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSelect = () => {
    setSelected(selected === "users" ? "groups" : "users");
  };

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

  const handlePageHeight = (total: number) => {
    const el = document.getElementById("sharings_content_main");
    if (el) {
      setPageHeight(el.clientHeight / total);
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleSharing = (val: string) => {
    const foundIndex = selectedSharing.findIndex((s) => s === val);
    const newArr = [...selectedSharing];
    if (foundIndex > -1) {
      newArr.splice(foundIndex, 1);
    } else {
      newArr.push(val);
    }
    setSelectedSharing(newArr);
  };

  const handleCreateDFC = () => {
    const current = docs[props.index];
    const next = docs[props.index + 1];
    if (next === "sigining_doc") {
      props.updateIndex();
      props.updateCurrentDoc();
      navigate("/app/addIndexes");
    } else if (next === "review_doc") {
      props.updateIndex();
      if (current !== "sigining_doc") {
        props.updateReviewDoc();
      }
    } else if (next === "requested_doc") {
      props.updateIndex();
      if (current !== "review_doc" && current !== "sigining_doc") {
        props.updateRequestedDoc();
      }
    } else {
      navigate("/app/managepackage");
    }
  };

  const { loader, groups, users, sigining_docs, review_docs } = props;

  let file = "";

  if (sigining_docs[props.current_doc]) {
    file = sigining_docs[props.current_doc].uniqnm;
  } else if (review_docs[props.current_review_doc]) {
    file = review_docs[props.current_review_doc].uniqnm;
  }

  let userButtonClasses = "sharing_sidebar-select-button";
  let groupButtonClasses = "sharing_sidebar-select-button";
  if (selected === "users") {
    userButtonClasses = userButtonClasses + " selected";
  } else {
    groupButtonClasses = groupButtonClasses + " selected";
  }

  return (
    <div className="sharing_container">
      {docs[props.index] === "sigining_doc" && (
        <div className="sharings_sidebar">
          <div className="d-flex justify-content-between">
            <div>
              <p className="sidebar_icon">Sharing</p>
            </div>
            <div>
              <i className="fa-solid fa-angles-left sidebar_icon" />
            </div>
          </div>
          <div className="sharing_sidebar-text">
            <span>Select users or groups to share this document with.</span>
          </div>
          <div className="d-flex align-items-center border_box">
            <div className="mx-2">
              <button
                className="sharing_sidebar-button shadow"
                onClick={() => {
                  createNotification(
                    IActionType.success,
                    "Sharing saved.",
                    2000,
                    "bottom-right"
                  );
                  props.saveSharings({
                    index: props.current_doc,
                    selectedSharing: selectedSharing,
                  });
                }}
              >
                save
              </button>
            </div>
            <div className="sharing_sidebar-search">
              <input
                className="sharing_sidebar-search-input"
                type={"text"}
                value={search}
                onChange={onSearchChange}
              />
              <div className="pe-1">
                <i className="fa fa-solid fa-search search-icon" />
              </div>
            </div>
          </div>
          <div>
            <hr className="shadow" />
          </div>

          <div className="text-center">
            <button onClick={toggleSelect} className={userButtonClasses}>
              Users
            </button>
            <button onClick={toggleSelect} className={groupButtonClasses}>
              Groups
            </button>
          </div>

          <div className="content-container p-1">
            {loader && (
              <div className="text-center">
                <Loader />
              </div>
            )}
            {selected === "users" ? (
              <div>
                {users
                  .filter((u) =>
                    u.username.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((u) => {
                    return (
                      <div
                        className="d-flex align-items-center mt-2"
                        key={u.userid}
                      >
                        <div className="d-flex align-items-center px-1">
                          <input
                            type="checkbox"
                            checked={
                              !!selectedSharing.find((s) => s === u.userid)
                            }
                            onChange={() => {
                              toggleSharing(u.userid);
                            }}
                          />
                        </div>
                        <div className="sharing_sidebar-name-container">
                          <span className="px-2">{u.username}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div>
                {groups
                  .filter((g) =>
                    g.groupname.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((g) => {
                    return (
                      <div
                        className="d-flex align-items-center mt-2"
                        key={g.groupid}
                      >
                        <div className="d-flex align-items-center px-1">
                          <input
                            type="checkbox"
                            checked={
                              !!selectedSharing.find((s) => s === g.groupid)
                            }
                            onChange={() => {
                              toggleSharing(g.groupid);
                            }}
                          />
                        </div>
                        <div className="sharing_sidebar-name-container">
                          <span className="px-2">{g.groupname}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}

      {docs[props.index] === "review_doc" && (
        <Reviewdocs
          participants={props.participants}
          review_docs={props.review_docs}
          current_review_doc={props.current_review_doc}
          reviewUser={props.reviewUser}
          onSave={handleCreateDFC}
          saveReveiwUser={props.saveReveiwUser}
        />
      )}
      {docs[props.index] === "requested_doc" && (
        <Requesteddocs
          participants={props.participants}
          requested_docs={props.requested_docs}
          current_requested_doc={props.current_requested_doc}
          requestUser={props.requestUser}
          onSave={handleCreateDFC}
          saveRequestUser={props.saveRequestUser}
        />
      )}

      <div className="sharings_header">
        <div className="sharings_header_container">
          <div>
            <div>
              <span className="fa-layers fa-fw fa-2x">
                <i className="fa fa-folder folder-icon"></i>
                <span className="fa-layers-text w-100 text-white folder-icon-text">
                  {props.count}
                </span>
              </span>
            </div>
            <div className="sharings_header_documents">
              <span>Document</span>
              <br />
              <span>
                {props.index + 1} of {props.count}
              </span>
            </div>
          </div>

          <div>
            <div>
              <h5>Package : {props.current_package_name}</h5>
            </div>
          </div>

          {docs[props.index] === "sigining_doc" && (
            <div className="sharings_header_zoom_container">
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
          )}
        </div>
      </div>

      <div className="sharing_content" id="sharing_content">
        {docs[props.index] === "requested_doc" && (
          <div className="page_title">
            <h5 className="text-center">
              <b>Requested Document </b> :{" "}
              {props.requested_docs[props.current_requested_doc].name}
            </h5>
          </div>
        )}

        {docs[props.index] === "review_doc" && (
          <div className="page_title">
            <h5 className="text-center">
              <b>Review Document </b> :{" "}
              {props.review_docs[props.current_review_doc].display_name}
            </h5>
          </div>
        )}

        {docs[props.index] === "sigining_doc" && (
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: "0 0" }}
            className="sharings_content_main"
            id="sharings_content_main"
          >
            <PDF file={file} handlePageHeight={handlePageHeight} />
          </div>
        )}
      </div>

      <div className="sharing_rightbar pt-3">
        {docs[props.index] === "sigining_doc" && (
          <button className="btn btn-primary" onClick={handleCreateDFC}>
            Next
          </button>
        )}

        {docs[props.index] === "sigining_doc" && (
          <div>
            <PDFRightBar file={file} currentPage={props.current_page} />
          </div>
        )}
      </div>
    </div>
  );
};

const mapStatetoProps = (state: IStoreState) => {
  const { sharing, file, settings, participant } = state;
  const { participants } = participant;
  const {
    loaded,
    loader,
    groups,
    users,
    selectedSharing,
    requestUser,
    reviewUser,
  } = sharing;
  const {
    count,
    sigining_docs,
    requested_docs,
    review_docs,
    current_package_name,
  } = file;
  const {
    index,
    current_doc,
    current_review_doc,
    current_requested_doc,
    current_page,
  } = settings;
  return {
    loaded,
    loader,
    groups,
    users,
    current_page,
    count,
    index,
    sigining_docs,
    review_docs,
    requested_docs,
    current_package_name,

    participants,
    selectedSharing,
    current_doc,
    current_review_doc,
    current_requested_doc,

    requestUser,
    reviewUser,
  };
};

export default connect(mapStatetoProps, {
  getSharings,
  updateHeaderTitle,
  updateIndex,
  updateCurrentDoc,
  updateReviewDoc,
  updateRequestedDoc,
  updateCurrentPDFPage,
  saveSharings,
  saveRequestUser,
  saveReveiwUser,
})(AddSharing);
