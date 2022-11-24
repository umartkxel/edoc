import Modal from "../general/Modal";
import React, { useEffect, useState } from "react";
import { Loader } from "../general/Loader";
import { ApiService } from "../../services/apiService";
import { connect } from "react-redux";
import { IStoreState } from "../../reducers";
import { IPendingDoc } from "../../interface";

interface IProps {
  session: string | null;
  user: any;
  host: string;
  type?: string;
  loader: boolean;
  onClose(): void;
  onChoose?(temp?: any): void;
}
const PendingDocModal: React.FC<IProps> = ({
  host,
  session,
  user,
  onClose,
}) => {
  const [pendingDocs, setPendingDocs] = useState<IPendingDoc[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await ApiService.post("/PENDING/", {
        session,
        controlid: user.controlid,
        action: "GETLIST",
        host,
      });
      if (res.result) {
        setPendingDocs(res.pendingdocs);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
    // eslint-disable-next-line
  }, []);

  return (
    <Modal classes="" onClose={onClose}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title">Pending Documents</div>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col py-1">
                Please select pending documents you would like to use:
              </div>
            </div>
            {loading ? (
              <div className="d-flex justify-content-center">
                <Loader />
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid black",
                  width: "100%",
                  padding: "5px",
                }}
              >
                {pendingDocs.map((p) => {
                  return (
                    <div className="form-check cursor" key={p.docid}>
                      <input className="form-check-input" type="checkbox" />
                      <label
                        className="form-check-label cursor"
                        htmlFor="flexCheckDefault"
                      >
                        {p.docname}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="row">
              <div className="col-sm-6 py-1">
                <div className="ckbxdivpad">
                  <label className="containerCB" style={{ fontSize: "18px" }}>
                    Delete from pending
                    <input type="checkbox" id="DltFrmPndCH" checked />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
              <div className="col-sm-6 py-1">
                <div className="ckbxdivpad" id="ApplyMtTmpDiv">
                  <label className="containerCB" style={{ fontSize: "18px" }}>
                    Apply matching template(s)
                    <input type="checkbox" id="ApplyTmpCH" checked />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Select
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state: IStoreState) => {
  const { auth } = state;
  const { token: session, user, ip: host } = auth;
  return {
    session,
    user,
    host,
  };
};

export default connect(mapStateToProps)(PendingDocModal);
