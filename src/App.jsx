import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ReportEmergency from "./pages/ReportEmergency";
import MyReports from "./pages/MyReports";
import EmergencyInformationManagement from "./pages/EmergencyInformationManagement";
import EmergencyInfo from "./pages/EmergencyInfo";
import SafetyResources from "./pages/SafetyResources";
import ResponderManagement from "./pages/ResponderManagement";
import ResponderAssignments from "./pages/ResponderAssignments";
import Notifications from "./pages/Notifications";
import ResponderDashboard from "./pages/ResponderDashboard";
import ResponderAvailability from "./pages/ResponderAvailability";
import ResponderProfile from "./pages/ResponderProfile";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import VolunteerManagement from "./pages/VolunteerManagement";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* User & Citizen Profile Management */}

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/responder-dashboard"
                    element={<ResponderDashboard />}
                />

                <Route
                    path="/responder-availability"
                    element={<ResponderAvailability />}
                />

                <Route
                    path="/responder-profile"
                    element={<ResponderProfile />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />


                {/* Emergency Report Management */}

                <Route
                    path="/report-emergency"
                    element={<ReportEmergency />}
                />

                <Route
                    path="/my-reports"
                    element={<MyReports />}
                />


                {/* Default */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/register"
                            replace
                        />
                    }
                />

                <Route
                    path="/emergency-information-management"
                    element={<EmergencyInformationManagement />}
                />

                <Route
                    path="/emergency-info"
                    element={<EmergencyInfo />}
                />

                <Route
                    path="/safety-resources"
                    element={<SafetyResources />}
                />

                <Route
                    path="/responders"
                    element={<ResponderManagement />}
                />

                <Route
                    path="/responder-assignments"
                    element={<ResponderAssignments />}
                />

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />

                <Route
                    path="/volunteer-dashboard"
                    element={<VolunteerDashboard />}
                />

                <Route
                    path="/volunteer-management"
                    element={<VolunteerManagement />}
                />

                <Route
                    path="/coordinator-dashboard"
                    element={<CoordinatorDashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;