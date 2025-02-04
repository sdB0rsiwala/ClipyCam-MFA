import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./views/SignIn";
import SignUp from "./views/SignUp";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";
import OtpPage from "./views/OtpPage";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/otp" element={<OtpPage />} />
                <Route path="/" element={<SignIn />} />
            </Routes>
        </Router>
    );
}

export default App;
