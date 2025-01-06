import { LoginForm } from "./login-form";
import timeCapsuleImage from "../../../public/time-capsule.jpg";
import './login.css'; // Assuming you've created this CSS file

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center mt-[88px]">
            <LoginForm />
        </div>
    );
}