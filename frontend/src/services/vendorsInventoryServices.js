import http from "./httpServices";
import apiEndPoints from "./apiEndPoints";

// Vendor Services
const getVendors = async () => {
  try {
    const { data } = await http.get(
      apiEndPoints.serverPath + apiEndPoints.vendor
    );
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//Add Vendors
const addVendors = async (vendor) => {
  console.log(vendor);
  try {
    const data = await http.post(
      apiEndPoints.serverPath + apiEndPoints.vendor,
      vendor
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateVendors = async (vendor) => {
  try {
    const data = await http.patch(
      apiEndPoints.serverPath + apiEndPoints.vendor + "/" + vendor._id,
      vendor
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteVendors = async (deleteVendors) => {
  console.log(deleteVendors);
  try {
    const { status } = await http.delete(
      apiEndPoints.serverPath + apiEndPoints.vendor + "/" + deleteVendors
    );
    if (status === 200) {
      return status;
    }
  } catch (error) {
    console.log(error);
  }
};

// Vendor Inventory Services

const getVendorInventory = async () => {
  try {
    const { data } = await http.get(
      apiEndPoints.serverPath + apiEndPoints.vendorEntity
    );
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//Add Vendors
const addVendorInventory = async (vendorData) => {
  console.log(vendorData);
  try {
    const { data } = await http.post(
      apiEndPoints.serverPath + apiEndPoints.vendorEntity,
      vendorData
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const vendorsServices = {
  getVendors,
  addVendors,
  updateVendors,
  deleteVendors,

  //Vendor Inventory
  getVendorInventory,
  addVendorInventory,
};

export default vendorsServices;
