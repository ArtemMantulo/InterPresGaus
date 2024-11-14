import { IFrame } from "@/shared/types/frames";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getFrame = createAsyncThunk(
    "frame/getFrame",
    async (id: string, { rejectWithValue }) => {
        try {
            return await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/frames/get/${id}`,
            ).then((res) => res.json());
        } catch (err) {
            return rejectWithValue(err);
        }
    },
);

export const changeFrame = createAsyncThunk(
    "frame/change",
    async (
        { data, id }: { data: Partial<IFrame>; id: string },
        { rejectWithValue },
    ) => {
        try {
            return await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/frames/change/${id}/`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ data }),
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
