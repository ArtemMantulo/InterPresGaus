import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

const initialState = {
    frames: [],
};
const framesSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {},
});

export default framesSlice.reducer;

export const selectFrames = (state: RootState) => state.frames.frames;
