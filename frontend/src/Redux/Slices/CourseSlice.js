import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosinstance";

const initialState = {
    courseData: [],
    loading: false,
    error: null,
}

export const getAllCourse = createAsyncThunk("/course/get", async () => {
    try {
        const response = axiosInstance.get("/courses");
        toast.promise(response, {
            loading: "loading course data ...",
            success: "courses loaded sucessfully",
            error: "Failed to get the courses",
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const getMyCourses = createAsyncThunk("/courses/my-courses", async () => {
    try {
        const response = axiosInstance.get("/courses/my-courses");
        toast.promise(response, {
            loading: "loading course data ...",
            success: "courses loaded sucessfully",
            error: "Failed to get the courses",
        });
        console.log("My courses: ", (await response).data);
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const createNewCourse = createAsyncThunk("/course/create", async (data) => {
    try {
        console.log("Data from create: ", data);
        let formData = new FormData();
        formData.append("name", data?.name);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
        formData.append("coverImage", data?.coverImage);
        formData.append("level", data?.level);
        formData.append("price", data?.price);
        data?.tags.forEach(tag => {
            formData.append("tags[]", tag);  // Sử dụng "tags[]" để gửi mảng
        });

        const response = axiosInstance.post("/courses/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                credentials: "include"
            }
        });
        toast.promise(response, {
            loading: "Creating new course",
            success: "Course created sucessfully",
            error: "Failed to create course"
        });

        return (await response).data;

    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const createNewCourseWithLesson = createAsyncThunk("/course/create-with-lesson", async (data) => {
    try {
        const formData = new FormData();

        // Thêm dữ liệu khóa học
        formData.append("name", data?.name);
        formData.append("description", data?.description);
        formData.append("category", data?.category);
        formData.append("coverImage", data?.coverImage);
        formData.append("level", data?.level);
        formData.append("price", data?.price);

        // Thêm tags
        data?.tags.forEach(tag => {
            formData.append("tags[]", tag);
        });

        // Thêm lessons dưới dạng JSON string
        formData.append("lessons", JSON.stringify(data.lessons));

        // Thêm video files nếu có
        data.lessons.forEach((lesson) => {
            if (lesson.videoFile) {
                formData.append(`videos`, lesson.videoFile);
            }
        });

        const res = await axiosInstance.post("/courses/create-with-lessons", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                credentials: "include"
            }
        });

        toast.promise(res, {
            loading: "Creating new course with lessons",
            success: "Course created with lessons successfully",
            error: "Failed to create course with lessons"
        });

        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
    try {
        const response = axiosInstance.delete(`/course/${id}`);
        toast.promise(response, {
            loading: "deleting course data ...",
            success: "course deleted sucessfully",
            error: "Failed to delete the course",
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const updateCourse = createAsyncThunk("/course/update", async (data) => {
    try {
        // creating the form data from user data
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("category", data.category);
        formData.append("createdBy", data.createdBy);
        formData.append("description", data.description);
        // backend is not allowing change of thumbnail
        if (data.thumbnail) {
            formData.append("thumbnail", data.thumbnail);
        }

        const res = axiosInstance.put(`/course/${data.id}`, {
            title: data.title,
            category: data.category,
            createdBy: data.createdBy,
            description: data.description,
        });

        toast.promise(res, {
            loading: "Updating the course...",
            success: "Course updated successfully",
            error: "Failed to update course",
        });

        const response = await res;
        return response.data;
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
});

export const addLesson = createAsyncThunk(
    'course/addLesson',
    async ({ courseId, lessonData }) => {
        try {
            const response = await axiosInstance.post(`/courses/${courseId}/lessons`, lessonData);
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add lesson");
            throw new Error(error?.response?.data?.message || "Failed to add lesson");
        }
    }
);


const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllCourse.fulfilled, (state, action) => {
            if (action.payload) {
                state.courseData = [...action.payload]
            }
        })
            .addCase(getMyCourses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMyCourses.fulfilled, (state, action) => {
                if (action.payload) {
                    state.courseData = [...action.payload]
                }
            })
            .addCase(getMyCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Handle addLesson async action
            .addCase(addLesson.pending, (state) => {
                state.loading = true;
            })
            .addCase(addLesson.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming courseId and lesson are returned in the response
                const { lesson, courseId } = action.payload;

                // Update the courseData with the new lesson added to the specific course
                state.courseData = state.courseData.map(course =>
                    course._id === courseId
                        ? { ...course, lessons: [...course.lessons, lesson] }
                        : course
                );
            })
            .addCase(addLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Handle any errors
            });
    }
});

export default courseSlice.reducer;
