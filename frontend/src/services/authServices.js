import apiEndPoints from "./apiEndPoints";
import http from "./httpServices";
import jwtDecode from "jwt-decode";

const login = async (userId, pin) => {
  try {
    const { data } = await http.post(
      apiEndPoints.serverPath + apiEndPoints.login,
      { userId, pin }
    );
    //console.log(data);
    //set token from data to the local storage
    if (data?.token) {
      localStorage.setItem("token", data.token);
      return data;
    }
  } catch (error) {
    console.log(error);
  }
  // try{
  //   const { data } = await http.post(apis.serverPath + apis.login, {
  //       emailId,
  //       password,
  //     });
  // }
};

const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!(token === "undefined") && token) {
    let userData = jwtDecode(token);
    return userData;
  } else {
    localStorage.removeItem("token");
  }
  return null;
};

export { login, getCurrentUser };
