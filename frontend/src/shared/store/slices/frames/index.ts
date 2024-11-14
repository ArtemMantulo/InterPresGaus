import { IFrames } from "@/shared/types/frames";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { createFrame, deleteFrame, getFrames } from "./thunks";

const initialState: IFrames = {
    frames: [],
};
const framesSlice = createSlice({
    name: "frames",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getFrames.fulfilled, (state, action) => {
            state.frames = action.payload;
        });

        builder.addCase(createFrame.fulfilled, (state, action) => {
            state.frames = [action.payload, ...state.frames];
        });

        builder.addCase(deleteFrame.fulfilled, (state, action) => {
            if (action.payload?.length) state.frames = action.payload;
        });
    },
});

export default framesSlice.reducer;

export const selectFrames = (state: RootState) => state.frames.frames;
