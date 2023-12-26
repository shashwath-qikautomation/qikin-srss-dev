import { routes } from "./helper/routes";
import "./styles/App.css";
import "./styles/modal.css";
import "./styles/table.css";
import { Navigate, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import Inventory from "./pages/inventory/Inventory";
import WorkOrders from "./pages/work-order/WorkOrders";

import PageNotFound from "./pages/PageNotFound";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "./components/NavBar";
import { useCallback, useEffect } from "react";
import Settings from "./pages/setting/setting";
import { getCurrentUser } from "./services/authServices";
import { listenToData } from "./services/websocketSevices";
import { socket } from "./helper/socketConnection";
import UserList from "./pages/setting/user_management/userList";
import AddNewUser from "./pages/setting/user_management/AddNewUser";
import CreateNewRole from "./pages/setting/user_management/CreateNewRole";
import PurchaseOrders from "./pages/purchase-order/PurchaseOrders";
import AddPurchase from "./pages/purchase-order/AddPurchase";
import { LOGIN } from "./redux/action";
import ProductPage from "./pages/product/productPage";
import AddProduct from "./pages/product/AddProduct";
import AddWorkOrder from "./pages/work-order/AddWorkOrder";
import EditWorkOrder from "./pages/work-order/editWorkOrder";
import PurchaseWorkOrder from "./pages/work-order/purchaseWorkOrder";
import EditPurchaseOrder from "./pages/purchase-order/EditPurchaseOrder";
import VendorsInventory from "./pages/vendors/VendorsInventory";

function App() {
  const { currentUser } = useSelector((state) => state);

  let dispatch = useDispatch();

  const getHomePage = useCallback(() => {
    return routes.homePage;
  }, []);

  useEffect(() => {
    const tokenData = getCurrentUser();
    dispatch({ type: LOGIN, payload: tokenData });
  }, []);

  useEffect(() => {
    if (currentUser) {
      console.log("Socket", socket);
      if (!socket.connected) {
        socket.connect();
        listenToData(socket, dispatch, currentUser);
      }
    }
  }, [currentUser]);

  return (
    <div
      style={{
        background: "#f5f5f5",
      }}
    >
      {currentUser && <NavBar />}

      <Routes>
        <Route path="/*" element={<PageNotFound />} />
        <Route path={"/"} element={<Navigate to={getHomePage()} replace />} />
        <Route
          index
          path={routes.homePage}
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.inventory}
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.vendorsInventory}
          element={
            <ProtectedRoute>
              <VendorsInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.products}
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.workOrders}
          element={
            <ProtectedRoute>
              <WorkOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.editWorkOrder + "/:id"}
          element={
            <ProtectedRoute keySet="EditWorkOrder">
              <EditWorkOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.settings}
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        >
          <Route
            path={routes.users}
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.AddNewUser}
            element={
              <ProtectedRoute>
                <AddNewUser />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.editUser + "/:id"}
            element={
              <ProtectedRoute>
                <AddNewUser />
              </ProtectedRoute>
            }
          />
          <Route
            path={routes.CreateNewRole}
            element={
              <ProtectedRoute>
                <CreateNewRole />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path={routes.addProduct}
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path={routes.editProduct + "/:id"}
          element={
            <ProtectedRoute keySet="AddProducts">
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.addProducts}
          element={
            <ProtectedRoute>
              <AddPurchase />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.addWorkOrder}
          element={
            <ProtectedRoute>
              <AddWorkOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.purchaseWorkOrder}
          element={
            <ProtectedRoute>
              <PurchaseWorkOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.purchaseOrders}
          element={
            <ProtectedRoute>
              <PurchaseOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.editPurchaseOrder + "/:id"}
          element={
            <ProtectedRoute>
              <EditPurchaseOrder />
            </ProtectedRoute>
          }
        />
        <Route path={routes.login} element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
