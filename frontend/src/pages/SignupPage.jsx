import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { LOGO } from '../src/img/Mensahe_app_LOGO';

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firsName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: '',
    });

    const [isSignUp, setIsSignUp] = useAuthStore();

    const validateForm = () => {
        // Add form validation logic here
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        // Add sign-up logic here
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* The Login show in Left Side Part */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* LOGO */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <img src={LOGO} alt="Mensahe Logo" className="w-12 h-12"/>
                            </div>
                        </div>
                    </div>  
                </div>            
            </div>
        </div>
    );

};

export default SignUpPage;