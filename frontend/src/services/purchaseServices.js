import http from "./httpServices";
import apiEndPoints from "./apiEndPoints";

const getPurchaseList = async () => {
  try {
    const { data } = await http.get(
      apiEndPoints.serverPath + apiEndPoints.purchase
    );

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const addPurchaseList = async (purchase) => {
  console.log("bom", purchase);
  try {
    const { status } = await http.post(
      apiEndPoints.serverPath + apiEndPoints.purchase,
      purchase
    );
    if (status === 200) {
      return status;
    }
  } catch (error) {
    console.log(error);
  }
};

const updatePurchaseList = async (purchase) => {
  try {
    const data = await http.patch(
      apiEndPoints.serverPath + apiEndPoints.purchase + "/" + purchase._id,
      purchase
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

const deletePurchaseList = async (deletingPurchaseId) => {
  console.log(deletingPurchaseId);
  try {
    const { data } = await http.delete(
      apiEndPoints.serverPath +
        apiEndPoints.purchase +
        "/" +
        deletingPurchaseId,
      deletingPurchaseId
    );

    return data;
  } catch (error) {
    console.log(error);
  }
};

const purchaseServices = {
  getPurchaseList,
  addPurchaseList,
  updatePurchaseList,
  deletePurchaseList,
};

export default purchaseServices;
