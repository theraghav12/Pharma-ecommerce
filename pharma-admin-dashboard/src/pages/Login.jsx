import React, { useState, useContext } from "react";
import { Input, Button, Typography, Card } from "@material-tailwind/react";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                dispatch({ type: "LOGIN", payload: data.user }); // Adjust based on your backend response
                toast.success("Login successful");
                navigate("/pharma/dashboard");
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (err) {
            toast.error("Login failed");
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-blue-gray-50">
            <Card className="w-full max-w-sm p-6">
                <Typography variant="h4" color="blue-gray">
                    Admin Login
                </Typography>
                <div className="mt-6 space-y-4">
                    <Input
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button fullWidth onClick={handleLogin}>
                        Login
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default Login;
