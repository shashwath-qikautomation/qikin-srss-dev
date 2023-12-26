import {
  BOM_LIST,
  INVENTORY,
  LOGIN,
  LOGOUT,
  WORK_ORDERS,
  USERS,
  ROLE,
  SETTINGS,
  PURCHASE_LIST,
  VENDORS_LIST,
} from "../action";

const initialState = {
  currentUser: null,
  workOrders: [],
  inventory: [],
  userList: [],
  roleData: [],
  products: [],
  workOrderFields: [
    {
      path: "partNumber",
      label: "Part Number",
    },
    {
      path: "partDescription",
      label: "Part Description",
    },
    {
      path: "quantity",
      label: "Quantity",
    },
    {
      path: "UID",
      label: "Unique ID",
    },
  ],
  purchaseList: [],
  vendorsList: [],
  settings: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, currentUser: action.payload };
    case LOGOUT:
      return { ...state, currentUser: null };
    case INVENTORY:
      return { ...state, inventory: action.payload };
    case BOM_LIST:
      return { ...state, products: action.payload };
    case WORK_ORDERS:
      return { ...state, workOrders: action.payload };
    case USERS:
      return { ...state, userList: action.payload };
    case ROLE:
      return { ...state, roleData: action.payload };
    case SETTINGS:
      return { ...state, settings: action.payload };
    case PURCHASE_LIST:
      return { ...state, purchaseList: action.payload };
    case VENDORS_LIST:
      return { ...state, vendorsList: action.payload };
    default:
      return state;
  }
};
export default reducer;
