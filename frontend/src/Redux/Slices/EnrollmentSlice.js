import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance";

const initialState = {
    enrollments: [],
    isEnrolled: false,
    loading: false,
    error: null
};

export const enrollInCourse = createAsyncThunk(
    "enrollment/enroll",
    async (courseId) => {
        try {
            const response = await axiosInstance.post(`/enrollments/enroll/${courseId}`);
            toast.promise(response, {
                loading: "Enrolling in course...",
                success: "Successfully enrolled in course",
                error: "Failed to enroll in course"
            });
            return (await response).data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
            throw error;
        }
    }
);

export const checkEnrollmentStatus = createAsyncThunk(
    "enrollment/check",
    async (courseId) => {
        try {
            const response = await axiosInstance.get(`/enrollments/status/${courseId}`);
            return response.data;
        } catch (error) {
            console.error("Error checking enrollment:", error);
            throw error;
        }
    }
);

export const getMyEnrollments = createAsyncThunk(
    "enrollment/getMyEnrollments",
    async () => {
        try {
            const response = await axiosInstance.get("/enrollments/my-enrollments");
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
            throw error;
        }
    }
);

const enrollmentSlice = createSlice({
    name: "enrollment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(enrollInCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(enrollInCourse.fulfilled, (state) => {
                state.loading = false;
                state.isEnrolled = true;
            })
            .addCase(enrollInCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(checkEnrollmentStatus.fulfilled, (state, action) => {
                state.isEnrolled = action.payload.isEnrolled;
            })
            .addCase(getMyEnrollments.fulfilled, (state, action) => {
                state.enrollments = action.payload;
            });
    }
});

export default enrollmentSlice.reducer;