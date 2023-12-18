import http from "./httpServices";
import apiEndPoints from "./apiEndPoints";

const getBOMList = async () => {
  try {
    const { data } = await http.get(apiEndPoints.serverPath + apiEndPoints.Bom);

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const addBOMList = async (bom) => {
  console.log("bom", bom);
  try {
    const { status } = await http.post(
      apiEndPoints.serverPath + apiEndPoints.Bom,
      bom
    );

    if (status === 200) {
      return status;
    }
  } catch (error) {
    console.log(error);
  }
};

const updateBOMList = async (updateBOM) => {
  try {
    const { data } = await http.patch(
      apiEndPoints.serverPath + apiEndPoints.Bom + "/" + updateBOM._id,
      updateBOM
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteBOMList = async (deletingProductId) => {
  try {
    const { data } = await http.delete(
      apiEndPoints.serverPath + apiEndPoints.Bom + "/" + deletingProductId._id,
      deletingProductId
    );
    console.log(
      apiEndPoints.serverPath + apiEndPoints.Bom + "/" + deletingProductId
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const bomServices = {
  getBOMList,
  addBOMList,
  updateBOMList,
  deleteBOMList,
};

export default bomServices;
