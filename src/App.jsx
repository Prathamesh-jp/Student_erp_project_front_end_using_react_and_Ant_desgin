import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Branches from "./pages/Branches";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Exams from "./pages/Exams";
import Reports from "./pages/Reports";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/students" element={<MainLayout><Students /></MainLayout>} />
      <Route path="/branches" element={<MainLayout><Branches /></MainLayout>} />
      <Route path="/attendance" element={<MainLayout><Attendance /></MainLayout>} />
      <Route path="/fees" element={<MainLayout><Fees /></MainLayout>} />
      <Route path="/exams" element={<MainLayout><Exams /></MainLayout>} />
      <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
    </Routes>
  );
};

export default App;