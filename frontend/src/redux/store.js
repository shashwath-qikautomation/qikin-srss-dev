import { legacy_createStore as createStore } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
//import { persistStore, persistReducer } from "redux-persist";
//import storage from "redux-persist/lib/storage";
import reducer from "../redux/reducer";

// const persistConfig = {
//   key: "QIK-IN",
//   storage,
//   blacklist: ["currentUser"],
// };

//const persistedReducer = persistReducer(persistConfig, reducer);
let store = createStore(reducer, composeWithDevTools());
//let persistor = persistStore(store);

export { store };
