import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import Sidebar from "./components/sidebar";

// Pages (create these if not done yet)
import Dashboard from "./pages/dashboad";
import Orders from "./pages/dashboad";
import UploadMedicine from "./pages/uploadMedicines";
//import ManageMedicine from "./pages/ManageMedicine";
import Login from "./pages/Login";

// Context
import { AuthProvider } from "./context/AuthContext";

// Optional: Protected route wrapper
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex min-h-screen bg-gray-50">
                    {/* Sidebar (only on authenticated routes) */}
                    <Routes>
                        <Route
                            path="/pharma/*"
                            element={
                                <>
                                    <Sidebar />
                                    <main className="flex-1 p-4">
                                        <Routes>
                                            <Route
                                                path="dashboard"
                                                element={
                                                    <ProtectedRoute>
                                                        <Dashboard />
                                                    </ProtectedRoute>
                                                }
                                            />
                                            <Route
                                                path="dashboard/orders"
                                                element={
                                                    <ProtectedRoute>
                                                        <Orders />
                                                    </ProtectedRoute>
                                                }
                                            />
                                            <Route
                                                path="dashboard/upload-medicine"
                                                element={
                                                    <ProtectedRoute>
                                                        <UploadMedicine />
                                                    </ProtectedRoute>
                                                }
                                            />
                                            {/* <Route
                                                path="dashboard/manage-medicine"
                                                element={
                                                    <ProtectedRoute>
                                                        <ManageMedicine />
                                                    </ProtectedRoute>
                                                }
                                            /> */}
                                        </Routes>
                                    </main>
                                </>
                            }
                        />

                        {/* Public Routes */}
                        <Route path="/" element={<Login />} />
                    </Routes>
                </div>

                {/* Global toaster */}
                <Toaster position="top-right" />
            </Router>
        </AuthProvider>
    );
}

export default App;
