import { store } from "../redux/store";
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
} from "../redux/action";
import socketEvents from "./webSocketEvents";

export const listenToData = (socket, dispatch, currentUser) => {
  // Users;
  socket.on(socketEvents.USER, async (dataFromSocket) => {
    const { userList } = store.getState();
    console.log(dataFromSocket.id);
    if (dataFromSocket.status === 1) {
      //to add users
      let users = [...userList];
      users.push(dataFromSocket.id);
      dispatch({ type: USERS, payload: users });
    }
    if (dataFromSocket.status === 2) {
      // to update users
      let users = [...userList];
      let userFound = users.find((user) => user._id === dataFromSocket.id._id);
      let index = users.indexOf(userFound);
      users[index] = dataFromSocket.id;
      dispatch({ type: USERS, payload: users });
    }
    if (dataFromSocket.status === 3) {
      // to delete users
      let users = [...userList];
      users = users.filter((f) => f._id !== dataFromSocket.id);
      dispatch({ type: USERS, payload: users });
    }
  });

  // Roles;
  socket.on(socketEvents.ROLES, async (dataFromSocket) => {
    let { roleData } = store.getState();
    console.log(dataFromSocket.id);
    if (dataFromSocket.status === 1) {
      //to add roles
      let roles = [...roleData];
      roles.push(dataFromSocket.id);
      dispatch({ type: ROLE, payload: roles });
    }
    if (dataFromSocket.status === 2) {
      //to update roles
      let roles = [...roleData];
      let roleFound = roles.find((role) => role._id === dataFromSocket.id._id);
      console.log(roleFound);
      let index = roles.indexOf(roleFound);
      console.log(index);
      roles[index] = dataFromSocket.id;
      dispatch({ type: ROLE, payload: roles });
    }
    if (dataFromSocket.status === 3) {
      //to delete roles
      let roles = [...roleData];
      roles = roles.filter((role) => role._id !== dataFromSocket.id);
      dispatch({ type: ROLE, payload: roles });
    }
  });

  // to Purchase order
  socket.on(socketEvents.PURCHASE, async (dataFromSocket) => {
    let { purchaseList } = store.getState();
    console.log(dataFromSocket.id);
    if (dataFromSocket.status === 1) {
      //to add purchase items
      let purchase = [...purchaseList];
      purchase.push(dataFromSocket.id);
      dispatch({ type: PURCHASE_LIST, payload: purchase });
    }
    if (dataFromSocket.status === 2) {
      //to update purchase item
      let purchase = [...purchaseList];
      let itemFound = purchase.find(
        (purchase) => purchase._id === dataFromSocket.id._id
      );
      let index = purchase.indexOf(itemFound);
      console.log(index);
      purchase[index] = dataFromSocket.id;
      dispatch({ type: PURCHASE_LIST, payload: purchase });
    }
    if (dataFromSocket.status === 3) {
      //to delete purchase item
      let purchase = [...purchaseList];
      purchase = purchase.filter(
        (purchase) => purchase._id !== dataFromSocket.id
      );
      dispatch({ type: PURCHASE_LIST, payload: purchase });
    }
  });

  // to Inventory
  socket.on(socketEvents.INVENTORY, async (dataFromSocket) => {
    let { inventory } = store.getState();
    console.log(dataFromSocket.id);
    if (dataFromSocket.status === 1) {
      //to add inventory items
      let inventoryList = [...inventory];
      inventoryList.push(dataFromSocket.id);
      dispatch({ type: INVENTORY, payload: inventoryList });
    }
    if (dataFromSocket.status === 2) {
      //to update inventory item
      let inventoryList = [...inventory];
      let itemFound = inventoryList.find(
        (e) => e._id === dataFromSocket.id._id
      );
      let index = inventoryList.indexOf(itemFound);
      inventoryList[index] = dataFromSocket.id;
      dispatch({ type: INVENTORY, payload: inventoryList });
    }
    if (dataFromSocket.status === 3) {
      //to delete product item
      let inventoryList = [...inventory];
      inventoryList = inventory.filter((e) => e._id !== dataFromSocket.id);
      dispatch({ type: INVENTORY, payload: inventoryList });
    }
  });

  // to Products
  socket.on(socketEvents.PRODUCTS, async (dataFromSocket) => {
    let { products } = store.getState();
    console.log(dataFromSocket.id);
    if (dataFromSocket.status === 1) {
      //to add product items
      let product = [...products];
      product.push(dataFromSocket.id);
      dispatch({ type: BOM_LIST, payload: product });
    }
    if (dataFromSocket.status === 2) {
      //to update product item
      let product = [...products];
      let itemFound = product.find((e) => e._id === dataFromSocket.id._id);
      let index = product.indexOf(itemFound);
      product[index] = dataFromSocket.id;
      dispatch({ type: BOM_LIST, payload: product });
      console.log(product);
    }
    if (dataFromSocket.status === 3) {
      //to delete product item
      let product = [...products];
      product = product.filter((e) => e._id !== dataFromSocket.id);
      dispatch({ type: BOM_LIST, payload: product });
    }
  });

  // to Work orders
  socket.on(socketEvents.WORK_ORDER, async (dataFromSocket) => {
    let { workOrders } = store.getState();
    console.log(dataFromSocket.id);
    if (dataFromSocket.status === 1) {
      //to add Work orders
      let workOrder = [...workOrders];
      workOrder.push(dataFromSocket.id);
      dispatch({ type: WORK_ORDERS, payload: workOrder });
    }
    if (dataFromSocket.status === 2) {
      //to update Work orders
      let workOrder = [...workOrders];
      let itemFound = workOrder.find(
        (workOrder) => workOrder._id === dataFromSocket.id._id
      );
      let index = workOrder.indexOf(itemFound);
      workOrder[index] = dataFromSocket.id;
      dispatch({ type: WORK_ORDERS, payload: workOrder });
    }
    if (dataFromSocket.status === 3) {
      //to delete Work orders
      let workOrder = [...workOrders];
      workOrder = workOrder.filter(
        (workOrder) => workOrder._id !== dataFromSocket.id
      );
      dispatch({ type: WORK_ORDERS, payload: workOrder });
    }
  });

  // TO Vendors
  socket.on(socketEvents.VENDORS, async (dataFromSocket) => {
    let { vendorsList } = store.getState();
    console.log(dataFromSocket.id);
    if (dataFromSocket.status === 1) {
      //to add Vendors
      let vendor = [...vendorsList];
      vendor.push(dataFromSocket.id);
      dispatch({ type: VENDORS_LIST, payload: vendor });
    }
    if (dataFromSocket.status === 2) {
      //to update Vendors
      let vendor = [...vendorsList];
      let itemFound = vendor.find(
        (vendor) => vendor._id === dataFromSocket.id._id
      );
      let index = vendor.indexOf(itemFound);
      vendor[index] = dataFromSocket.id;
      dispatch({ type: VENDORS_LIST, payload: vendor });
    }
    if (dataFromSocket.status === 3) {
      //to delete Vendors
      let vendor = [...vendorsList];
      vendor = vendor.filter((vendor) => vendor._id !== dataFromSocket.id);
      dispatch({ type: VENDORS_LIST, payload: vendor });
    }
  });
};
