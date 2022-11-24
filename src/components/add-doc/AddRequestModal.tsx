import Modal from "../general/Modal";
import React from "react";
interface IProps {
  onClose(): void;
  onTemplateClick(): void;
  onAdd(values?: any): void;
}
const AddRequestModal: React.FC<IProps> = ({
  onClose,
  onTemplateClick,
  onAdd,
}) => {
  return (
    <Modal onClose={onClose} classes="">
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content" style={{ fontSize: "18px" }}>
          <div className="modal-header justify-content-center">
            <div className="modal-title">Select Method</div>
          </div>
          <div className="modal-body">
            <div
              className="row RequestedDocModal mb-3 mx-auto w-100 align-items-center"
              data-bs-dismiss="modal"
              id="ReqCrtNewBtn"
              onClick={() => {
                onAdd();
                onClose();
              }}
            >
              <div className="col-2">
                <span className="fas fa-file-upload FASelectMethod"></span>
              </div>
              <div className="col-10">Create New Request</div>
            </div>
            <div
              className="row RequestedDocModal mb-3 mx-auto w-100 align-items-center"
              id="ReqUseTempBtn"
              data-bs-dismiss="modal"
              onClick={() => {
                onClose();
                onTemplateClick();
              }}
            >
              <div className="col-2">
                <span className="fas fa-file-invoice FASelectMethod"></span>
              </div>
              <div className="col-10">Use Requested Template</div>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                className="btn btn-primary"
                onClick={onClose}
                style={{ backgroundColor: "#0071BC" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddRequestModal;
