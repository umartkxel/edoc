import "./login.css";
import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import { IStoreState } from "../../reducers";
import {
  loginRequest,
  setAuthLoader,
  userForgotPasswordRequest,
} from "../../actions/auth";
import { useNavigate } from "react-router-dom";

import { LoginForm } from "../../components/login/LoginForm";
import { Image as Img } from "simple-react-image";

interface IProps {
  loader: boolean;
  isAuthenticated: boolean;
  error: boolean;
  message: string;
  loginRequest(args: any): any;
  setAuthLoader(args: any): any;
  userForgotPasswordRequest(args: any): any;
}

const Login: React.FC<IProps> = (props) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (props.isAuthenticated) {
      navigate("/app");
    }
  }, [props.isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    props.setAuthLoader({ loader: false });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div>
      <div className="row g-0 w-100 h-100">
        <div
          className="col my-auto"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <div className="cursor w-100">
            <a target="_blank" rel="noreferrer">
              <Img
                id="loginImg"
                className="w-100"
                src={`https://images.pexels.com/photos/8388229/pexels-photo-8388229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
              />
            </a>
          </div>
        </div>
        <div
          className="col card"
          style={{ border: "none", minWidth: "450px", maxWidth: "450px" }}
        >
          <div className="row g-0 card-body">
            <div className="col-12 my-auto" style={{ minWidth: "400px" }}>
              <div className="row mt-2 text-center">
                <div className="col text-center">
                  <i className="fak fa-sigicon fa-3x text-primary"></i>
                </div>
              </div>
              <div className="row mt-2 text-center">
                <div className="SignInTitle col" id="UserLoginMsg">
                  Login to eDOCSignature
                </div>
              </div>

              <LoginForm
                loading={props.loader}
                onSubmit={props.loginRequest}
                onForgotPassord={props.userForgotPasswordRequest}
              />
            </div>
          </div>
          <div
            className="row g-0 card-footer"
            style={{ border: "none", background: "none" }}
          >
            <div className="col-12 mt-auto">
              <div
                className="row g-0 LoginFooter align-items-center p-2"
                style={{ minWidth: "400px" }}
              >
                <div className="col-1">
                  <i className="fas fa-lock-keyhole text-dark fa-lg ps-2"></i>
                </div>
                <div className="col-4 text-start">
                  <div className="FooterText">
                    Secured by eDOC Innovations, Inc.&nbsp;&nbsp;
                  </div>
                </div>
                <div className="col-3 text-center">
                  <div
                    className="FooterText cursor justify-content-center"
                    id="TOSBtn"
                    onClick={() =>
                      window.open("eDOCSignature EULA.htm", "_tos")
                    }
                  >
                    Terms and Conditions
                  </div>
                </div>
                <div className="col-4 text-end">
                  <div
                    className="justify-content-end"
                    style={{ width: "135px" }}
                  >
                    <div id="siteseal"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }: IStoreState) => {
  const { loader, isAuthenticated, error, message } = auth;
  return { loader, isAuthenticated, error, message };
};

export default connect(mapStateToProps, {
  loginRequest,
  setAuthLoader,
  userForgotPasswordRequest,
})(Login);
