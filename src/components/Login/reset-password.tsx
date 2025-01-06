import { toast } from '@/hooks/use-toast';
import callApi from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword']
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema)
    });

    const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
        try {
            const response = await callApi<{ message: string }>({
                endpoint: "/auth/reset-password",
                method: "POST",
                body: {
                    token: token,
                    newPassword: data.newPassword
                }
            });

            toast({ title: "Password reset successfully. Redirecting...", description: response.message })

            // Redirect to login or home page after success
            setTimeout(() => {
                navigate('/login');
            }, 1000);

        } catch (err: any) {
            if (err.response) {
                toast({ title: "Error", description: "An error occurred while resetting the password", variant: "destructive" })
            } else {
                toast({ title: "Error", description: "Issue while connecting to the server", variant: "destructive" })
            }
        }
    };

    if (!token) {
        return <div>Invalid or missing reset token. Please check your link or request a new one.</div>;
    }

    return (
        <div className={`flex flex-col gap-6 items-center justify-center mt-[88px] ${className}`} {...props}>
            <Card className="">
                <CardHeader className="text-2xl">
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        Enter your new password below to reset it.
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-sm:min-w-[30rem] sm:w-full">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                {...register('newPassword')}
                                placeholder="Enter your new password"
                            />
                            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register('confirmPassword')}
                                placeholder="Confirm your new password"
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                        </div>

                        <Button type="submit" variant={"neutral"}>
                            Reset Password
                        </Button>
                    </form>
                </CardContent>
            </Card>

        </div>
    );
}

