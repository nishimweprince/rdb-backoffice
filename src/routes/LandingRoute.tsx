import { RootState } from "@/states/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LandingRoute = () => {

    // STATE VARIABLES
    const { user, token } = useSelector((state: RootState) => state.user);

    // NAVIGATION
    const navigate = useNavigate();

    // HANDLE REDIRECT
    useEffect(() => {
        if (user && token) {
            navigate('/dashboard');
        } else {
            navigate('/auth/login');
        }
    }, [user, token, navigate]);

  return null
}

export default LandingRoute;
