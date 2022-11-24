const RequestDocument = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "8px 0" }}>
      <div className="px-1">
        <i
          className="fas fa-file"
          style={{ fontSize: "18px", color: "#F5A623" }}
        ></i>
      </div>
      <div className="searchtext px-1">Name:</div>
      <div>
        <input
          type="text"
          className="form-control"
          style={{ width: "98%", fontSize: "14px" }}
          value=""
          placeholder="Type a name for requested document"
        />
      </div>
      <div className="searchtext px-1">Message:</div>
      <div>
        <input
          type="text"
          className="form-control"
          style={{ width: "98%", fontSize: "14px" }}
          value=""
          placeholder="Type message to signer"
        />
      </div>
      <div title="Remove Requested Document" className="ps-1">
        <i
          className="fas fa-trash-alt cursor"
          style={{ fontSize: "18px", color: "#2973A1" }}
        ></i>
      </div>
    </div>
  );
};
export default RequestDocument;
