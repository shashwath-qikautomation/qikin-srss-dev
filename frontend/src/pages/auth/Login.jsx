import "./newLogin.css";

import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CancelIcon from "@mui/icons-material/Cancel";
import { Container } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logoB.png";
import logoW from "../../assets/images/logoW.png";
//import { updateLoginUser } from "../../redux/action";
//import userServices from "../../services/userServices";
import { LOGIN } from "../../redux/action";
import { login, getCurrentUser } from "../../services/authServices";

function Login() {
  const navigate = useNavigate();
  const pinRef = useRef();
  const userIdRef = useRef();
  const [errors, setErrors] = useState("");
  const [pinValue, setPinValue] = useState([]);
  const [userId, setUserId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputFocus, setInputFocus] = useState(true);
  const [numberList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  const dispatch = useDispatch();

  const { currentUser, themeMode } = useSelector((state) => state);

  useEffect(() => {
    userIdRef.current.focus();
  }, []);

  useEffect(() => {
    if (currentUser) navigate("/", { replace: true });
  }, [currentUser, navigate]);

  const validateFields = useCallback(() => {
    const regex = /[0-9]/;
    let error = "";
    if (userId.length === 0) {
      error = "User ID  is required";
    } else if (userId.length !== 6) {
      error = "In correct User ID";
    } else if (pinValue.length === 0) {
      error = "Key is required";
    } else if (pinValue.length < 4 || pinValue.length > 6) {
      error = "Key must be min 4 or 6 ";
    } else if (!regex.test(pinValue)) {
      error = "Key is not valid";
    }
    return error;
  }, [pinValue, userId]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const validateError = validateFields();

    if (validateError) {
      setErrors(validateError);
    } else {
      setErrors("");
      let pin = pinValue.toString().split(",").join("");
      let userID = userId.toString().split(",").join("");
      const data = await login(userID, pin);
      console.log(data);
      if (data) {
        const tokenData = getCurrentUser();
        console.log(tokenData);
        if (tokenData) {
          dispatch({
            type: LOGIN,
            payload: tokenData,
          });
          navigate("/", { replace: true });
        } else {
          setErrors("Login Error");
        }
      } else {
        setErrors("User not found");
      }
    }
    setIsLoading(false);
  };

  function handelOnChange(event) {
    setPinValue(event.target.value);
  }
  function handelTextChange(event) {
    setUserId(event.target.value);
  }

  const handleNumber = (e) => {
    if (inputFocus) {
      setPinValue([...pinValue, e]);
    } else {
      setUserId([...userId, e]);
    }
  };

  const handleClear = () => {
    if (inputFocus) {
      setPinValue((prevState) => prevState.slice(0, -1));
    } else {
      setUserId((prevState) => prevState.slice(0, -1));
    }
  };

  return (
    <Container>
      <div className="loginContainer">
        <div className="logoContainer">
          <img src={themeMode === "light" ? logo : logoW} alt="logo" />
        </div>
        <div className="rightContainer">
          <div className="textContainer">
            <input
              autoComplete="off"
              ref={userIdRef}
              placeholder={"Login Id"}
              className="userId z-depth-1"
              type={"text"}
              value={userId.toString().split(",").join("").replaceAll("*")} //trim
              onClick={() => {}}
              onChange={(event) => {
                handelTextChange(event);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  pinRef.current.focus();
                }
              }}
              onFocus={() => {
                setInputFocus(false);
                userIdRef.current.focus();
              }}
              onBlur={() => {}}
            />
            <input
              placeholder={"Pin"}
              ref={pinRef}
              autoComplete="off"
              className="keyfield z-depth-1"
              type={"password"}
              value={pinValue.toString().split(",").join("").replaceAll("*")}
              onChange={(event) => {
                handelOnChange(event);
              }}
              onFocus={() => {
                setInputFocus(true);
                pinRef.current.focus();
              }}
              onKeyDown={(e) => {
                e.key === "Enter" && handleSubmit();
              }}
            />
          </div>
          <div className="numberContainer">
            {numberList.map((i) => (
              <div key={i} onClick={() => handleNumber(i)} className="number">
                {i}
              </div>
            ))}

            <div className="number" onClick={handleClear}>
              {" "}
              <CancelIcon />
            </div>
            <div
              onClick={() => setPinValue([...pinValue, 0])}
              className="number"
            >
              0
            </div>
            {isLoading ? (
              <div className="number">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div onClick={handleSubmit} className="number ">
                <ArrowCircleRightIcon />
              </div>
            )}
          </div>
          <div className="error">{errors}</div>
        </div>
      </div>
    </Container>
  );
}

export default Login;
