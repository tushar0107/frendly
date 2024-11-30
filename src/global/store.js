import { configureStore } from "@reduxjs/toolkit";
import { userReducer} from "./UserSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        //add other reducers
    },
});

export default store;