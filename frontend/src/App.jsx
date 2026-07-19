import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Challenges from "./pages/Challenges";
import Leaderboard from "./pages/Leaderboard";
import TeacherRating from "./pages/TeacherRating";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import MaterialsPage from "./features/materials/MaterialsPage";
import SoftSkillsPage from "./features/softskills/SoftSkillsPage";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import RoleHome from "./components/RoleHome";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ChatPage from "./features/chat/ChatPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SocketProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<RoleHome />} />
            <Route path="/dashboard/student" element={<ProtectedRoute roles={["student"]}><AppLayout><StudentDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/dashboard/teacher" element={<ProtectedRoute roles={["teacher"]}><AppLayout><TeacherDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute roles={["admin"]}><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />

            {/* أقسام عامة (تصفّح بدون تسجيل) */}
            <Route path="/feed" element={<AppLayout><Feed /></AppLayout>} />
            <Route path="/challenges" element={<AppLayout><Challenges /></AppLayout>} />
            <Route path="/leaderboard" element={<AppLayout><Leaderboard /></AppLayout>} />
            <Route path="/teachers" element={<AppLayout><TeacherRating /></AppLayout>} />

            {/* أقسام تتطلب تسجيل دخول */}
            <Route path="/soft-skills" element={<ProtectedRoute roles={["student"]}><AppLayout><SoftSkillsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/materials" element={<ProtectedRoute><AppLayout><MaterialsPage /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><AppLayout><ChatPage /></AppLayout></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
