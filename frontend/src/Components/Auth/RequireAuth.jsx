
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";

function RequireAuth({allowedRoles}){
    const { isLoggedIn , role  }= useSelector((state)=>state.auth);

    return isLoggedIn && allowedRoles.find((myRole)=>myRole ==role ) ? (
        <Outlet/>
    ): isLoggedIn ?(
        <Navigate to="/denied"/>
    ):(
        <Navigate to="login"/>
    )
}

RequireAuth.propTypes = {
    allowedRoles: PropTypes.array.isRequired
}
export default RequireAuth;