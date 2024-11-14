import { IFrames } from "@/shared/types/frames";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getFrames = createAsyncThunk(
    "frames/getFrames",
    async (_, { rejectWithValue }) => {
        try {
            return await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/frames/get/`,
            ).then((res) => res.json());
        } catch (err) {
            return rejectWithValue(err);
        }
    },
);

export const deleteFrame = createAsyncThunk(
    "frames/getFrame",
    async (id: string, { rejectWithValue }) => {
        try {
            return await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/frames/delete/${id}`,
                {
                    method: "DELETE",
                },
            ).then((res) => res.json());
        } catch (err) {
            return rejectWithValue(err);
        }
    },
);

export const createFrame = createAsyncThunk(
    "frames/createFrame",
    async (data: any, { rejectWithValue }) => {
        try {
            return await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/frames/create/`,
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            ).then((res) => res.json());
        } catch (err) {
            return rejectWithValue(err);
        }
    },
);
