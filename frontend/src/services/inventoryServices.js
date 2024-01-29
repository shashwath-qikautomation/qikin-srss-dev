import http from "./httpServices";
import apiEndPoints from "./apiEndPoints";

const getInventory = async () => {
  try {
    const { data: data } = await http.get(
      apiEndPoints.serverPath + apiEndPoints.inventory
    );
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const addInventory = async (inventory) => {
  try {
    const { status } = await http.post(
      apiEndPoints.serverPath + apiEndPoints.inventory,
      inventory
    );
    if (status === 200) {
      return status;
    }
  } catch (error) {
    console.log(error);
  }
};

const upsertInventoryData = async (inventory) => {
  console.log(inventory);
  try {
    const { data } = await http.post(
      apiEndPoints.serverPath + apiEndPoints.upsertInventory,
      inventory
    );
    console.log(
      apiEndPoints.serverPath + apiEndPoints.upsertInventory,
      inventory
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateInventory = async (updatedInventory) => {
  console.log(updatedInventory);
  try {
    const { data } = await http.patch(
      apiEndPoints.serverPath +
        apiEndPoints.inventory +
        "/" +
        updatedInventory._id,
      updatedInventory
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteInventory = async (selectedInventoryID) => {
  try {
    const { status } = await http.delete(
      apiEndPoints.serverPath +
        apiEndPoints.inventory +
        "/" +
        selectedInventoryID._id,
      selectedInventoryID
    );
    if (status === 200) {
      return status;
    }
  } catch (error) {
    console.log(error);
  }
};

const inventoryServices = {
  getInventory,
  addInventory,
  upsertInventoryData,
  updateInventory,
  deleteInventory,
};

export default inventoryServices;
