import http from "./httpServices";
import apiEndPoints from "./apiEndPoints";

const getWorkOrders = async () => {
  try {
    const { data } = await http.get(
      apiEndPoints.serverPath + apiEndPoints.workOrders
    );

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getWorkOrderData = async (id) => {
  try {
    const { data } = await http.get(
      apiEndPoints.serverPath + apiEndPoints.workOrders + "/" + id
    );
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const addWorkOrder = async (workOrder) => {
  console.log(workOrder);
  try {
    const { status, data } = await http.post(
      apiEndPoints.serverPath + apiEndPoints.workOrders,
      workOrder
    );
    console.log(data);
    if (status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const updateWorkOrder = async (updatedWO) => {
  console.log(updatedWO);
  try {
    const { status, data } = await http.patch(
      apiEndPoints.serverPath + apiEndPoints.workOrders + "/" + updatedWO._id,
      updatedWO
    );
    if (status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteWorkOrder = async (deleteWOId) => {
  try {
    const { status } = await http.delete(
      apiEndPoints.serverPath + apiEndPoints.workOrders + "/" + deleteWOId
    );
    if (status === 200) {
      return status;
    }
  } catch (error) {
    console.log(error);
  }
};

const workOrderServices = {
  getWorkOrders,
  getWorkOrderData,
  addWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
};

export default workOrderServices;
