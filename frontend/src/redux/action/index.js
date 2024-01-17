//-----------action types-----------------------
const LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  INVENTORY = "INVENTORY",
  BOM_LIST = "BOM_LIST",
  WORK_ORDERS = "WORK_ORDERS",
  USERS = "USERS",
  ROLE = "ROLE",
  SETTINGS = "SETTINGS",
  PURCHASE_LIST = "SAVE_PURCHASE_ITEMS",
  VENDORS_LIST = "VENDORS_LIST",
  VENDORS_INVENTORY = "VENDORS_INVENTORY";

//--------------actions-----------------------
const updateLoginUser = (payload) => {
    return {
      type: LOGIN,
      payload,
    };
  },
  updateInventory = (payload) => {
    return {
      type: INVENTORY,
      payload,
    };
  },
  updateBOMList = (payload) => {
    return {
      type: BOM_LIST,
      payload,
    };
  },
  updateWorkOrder = (payload) => {
    return {
      type: WORK_ORDERS,
      payload,
    };
  };
const updateUsers = (payload) => {
  // getUsers
  return {
    type: USERS,
    payload,
  };
};
const updateRole = (payload) => {
  //getRoleData
  return {
    type: ROLE,
    payload,
  };
};

const updateSettings = (payload) => {
  return {
    type: SETTINGS,
    payload,
  };
};

const updatePurchase = (payload) => {
  return {
    type: PURCHASE_LIST,
    payload,
  };
};

const updateVendors = (payload) => {
  return {
    type: VENDORS_LIST,
    payload,
  };
};

const updateVendorsInventory = (payload) => {
  return {
    type: VENDORS_INVENTORY,
    payload,
  };
};

export {
  LOGIN,
  LOGOUT,
  INVENTORY,
  BOM_LIST,
  WORK_ORDERS,
  USERS,
  ROLE,
  SETTINGS,
  PURCHASE_LIST,
  VENDORS_LIST,
  VENDORS_INVENTORY,
  //------------------------------
  updateLoginUser,
  updateInventory,
  updateBOMList,
  updateWorkOrder,
  updateUsers,
  updateRole,
  updateSettings,
  updatePurchase,
  updateVendors,
  updateVendorsInventory,
};
