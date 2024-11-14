import { IFrame, IFrames } from "@/shared/types/frames";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { getFrame } from "./thunks";
// import { getFrames } from "./thunks";

const initialState: { frame: IFrame | null } = {
    frame: null,
};
const frameSlice = createSlice({
    name: "frame",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFrame.fulfilled, (state, action) => {
            state.frame = {
                ...action.payload,
                // config: JSON.stringify(action.payload.config),
                // config_viewer: JSON.stringify(action.payload.config_viewer),
            };
        });
    },
});

export default frameSlice.reducer;

export const selectFrame = (state: RootState) => state.frame.frame;
