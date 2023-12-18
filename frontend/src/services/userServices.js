import http from "./httpServices";
import apiEndPoints from "./apiEndPoints";

const getRoleData = async () => {
  try {
    const { data } = await http.get(
      apiEndPoints.serverPath + apiEndPoints.role
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async () => {
  try {
    const { data } = await http.get(
      apiEndPoints.serverPath + apiEndPoints.user
    );
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//AddUsers
const addUsers = async (user) => {
  try {
    const data = await http.post(
      apiEndPoints.serverPath + apiEndPoints.user,
      user
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateUsers = async (user) => {
  console.log(user.id);
  try {
    const data = await http.patch(
      apiEndPoints.serverPath + apiEndPoints.user + "/" + user.id,
      user
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteUsers = async (deleteUsers) => {
  try {
    const { status } = await http.delete(
      apiEndPoints.serverPath + apiEndPoints.user + "/" + deleteUsers
    );
    if (status === 200) {
      return status;
    }
  } catch (error) {
    console.log(error);
  }
};

// Roles services

const addRoleData = async (role) => {
  try {
    const data = await http.post(
      apiEndPoints.serverPath + apiEndPoints.role,
      role
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteRole = async (deleteRole) => {
  try {
    const status = await http.delete(
      apiEndPoints.serverPath + apiEndPoints.role + "/" + deleteRole
    );
    if (status === 200) {
      return status;
    }
  } catch (error) {
    console.log(error);
  }
};

const editRole = async (editRole) => {
  try {
    let data = await http.patch(
      apiEndPoints.serverPath + apiEndPoints.role + "/" + editRole._id,
      editRole
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const userServices = {
  getUsers,
  addUsers,
  updateUsers,
  deleteUsers,
  getRoleData,

  //Roles
  addRoleData,
  deleteRole,
  editRole,
};

export default userServices;
