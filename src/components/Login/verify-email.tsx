import { toast } from '@/hooks/use-toast';
import callApi from '@/utils/utils';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import React from 'react';

const VerifyEmail: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {

        if (!token) {
            toast({ title: "Error in verification", description: "Verify link broken" });
            navigate("/login");
            return; // Exit early if no token
        }

        const verifyEmail = async () => {
            try {
                const response = await callApi<{ message: string }>({
                    endpoint: "/auth/verify-email",
                    method: "POST",
                    body: { token: token },
                });

                toast({ title: "Email Verified", description: response.message + " You can login now",duration: 2000 });

                setTimeout(() => {
                    navigate('/login');
                }, 1000);

            } catch (err: any) {
                console.log("err ro is ", err)
                if (err.response) {
                    toast({ title: "Error", description: "An error occurred while verifying email", variant: "destructive" });
                } else {
                    toast({ title: "Error", description: "Issue while connecting to the server", variant: "destructive" });
                }
                navigate("/login"); // Redirect to login on error
            }
        };

        verifyEmail();

    }, [navigate]);

    return (
        <div>Verifying your email...</div>
    );
};

export default VerifyEmail;