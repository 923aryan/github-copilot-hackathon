import { useAuth } from "@/context/authContext";
import callApi from "@/utils/utils";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../common/loadingSpinner";
const BASE_URL = import.meta.env.BASE_URL!

const AuthCallback = () => {
    const navigate = useNavigate();
    const { login } = useAuth()
    useEffect(() => {
        const handleAuth = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');

                if (code) {
                    console.log("check 1")
                    console.log("calling")
                    const data = await callApi<{ jwt: string }>({
                        endpoint: `/auth/github/callback?code=${code}`,
                        method: 'POST'
                    });
                    console.log("check 2")

                    if (data.jwt) {
                        console.log("check 3");

                        login(data.jwt);
                        // Redirect:
                        const redirectTo = localStorage.getItem('redirectTo') || "/";
                        console.log("removing")
                        localStorage.removeItem('redirectTo');
                        console.log("navigating to ", redirectTo);
                        navigate(redirectTo);
                    } else {
                        console.error('JWT not received');

                        navigate('/login', { replace: true });
                    }
                }
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/login', { replace: true }); // Redirect to login on any error
            }
        };

        handleAuth();
    }, []);

    return <div className="mt-[88px] flex w-full justify-center items-center">
        <LoadingSpinner/>
    </div>;
};

export default AuthCallback;