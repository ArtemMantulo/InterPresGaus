import { createAsyncThunk } from "@reduxjs/toolkit";

const getMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
    try {
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${window.token}`,
            },
        });
    } catch (err) {
        return rejectWithValue(err);
    }
});

export const login = createAsyncThunk(
    "auth/login",
    async (data: any, { rejectWithValue }) => {
        try {
            return await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`,
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
