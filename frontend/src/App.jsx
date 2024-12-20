
import './App.css'

import { Route, Routes } from 'react-router-dom'

import RequireAuth from './Components/Auth/RequireAuth.jsx'
import AboutUs from './Pages/AboutUs.jsx'
import Contact from './Pages/Contact.jsx'
import CourseDescripition from './Pages/Course/CourseDescription.jsx'
import CourseList from './Pages/Course/CourseList.jsx'
import MyCourses from './Pages/Course/MyCourses.jsx'
import CreateCourse from './Pages/Course/CreateCourse.jsx'
import EditCourse from './Pages/Course/EditCourse.jsx'
import Denied from './Pages/Denied.jsx'
import AddCourseLectures from './Pages/Dashboard/AddLectures.jsx'
import AdminDashboard from './Pages/Dashboard/AdminDashboard.jsx'
import Displaylectures from './Pages/Dashboard/DisplayLectures.jsx'
import HomePage from './Pages/HomePage.jsx'
import Login from './Pages/Login.jsx'
import NotFound from './Pages/NotFound.jsx'
import ChangePassword from './Pages/Password/ChangePassword.jsx'
import ForgetPassword from './Pages/Password/ForgetPassword.jsx'
import ResetPassword from './Pages/Password/ResetPassword.jsx'
import CheckoutPage from './Pages/Payment/Checkout.jsx'
import CheckoutFailure from './Pages/Payment/CheckoutFailure.jsx'
import CheckoutSuccess from './Pages/Payment/CheckoutSuccess.jsx'
import Signup from './Pages/Signup.jsx'
import EditProfile from './Pages/User/EditProfile.jsx'
import Profile from './Pages/User/Profile.jsx'
import CourseLessons from './Pages/Course/CourseLesson';
import CourseLearn from './Components/CourseLearn';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/about' element={<AboutUs />}></Route>
        <Route path='/courses' element={<CourseList />}></Route>
        <Route path='/courses/my-courses' element={<MyCourses />}></Route>
        <Route path="/course/lessons" element={<CourseLessons />} />
        <Route path="/course/lessons/:lessonId" element={<CourseLessons />} />
        <Route path="course/learn" element={<CourseLearn />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/denied' element={<Denied />}></Route>
        <Route path='/course/description' element={<CourseDescripition />}></Route>

        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/forget-password' element={<ForgetPassword />}></Route>
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path='/course/addlecture' element={<AddCourseLectures />}></Route>
          <Route path='/admin/dashboard' element={<AdminDashboard />}></Route>
        </Route>
        <Route element={<RequireAuth allowedRoles={["admin", 'instructor']} />}>
          <Route path='/course/create' element={<CreateCourse />}></Route>
          <Route path='/course/edit' element={<EditCourse />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["admin", 'student', 'instructor']} />}>
          <Route path='/user/profile' element={<Profile />}></Route>
          <Route path='/user/editprofile' element={<EditProfile />}></Route>
          <Route path='/change-password' element={<ChangePassword />}></Route>
          <Route path='/checkout' element={<CheckoutPage />}></Route>
          <Route path='/checkout/success' element={<CheckoutSuccess />}></Route>
          <Route path='/checkout/fail' element={<CheckoutFailure />}></Route>
          <Route path='/course/displaylecture' element={<Displaylectures />}></Route>
          <Route path='/course/edit' element={<EditCourse />}></Route>
        </Route>

        <Route path='*' element={<NotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
