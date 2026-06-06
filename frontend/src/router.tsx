import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardView from "@/views/projects/DashboardView";
import PrivateLayout from "@/layouts/PrivateLayout";
import CreateProjectView from "./components/Projects/CreateProjectView";
import EditProjectView from "./views/projects/EditProjectView";
import ProjectDetailsView from "./views/projects/ProjectDetailsView";
import PublicLayout from "./layouts/PublicLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import ConfirmAccountView from "./views/auth/ConfirmAccountView";
import RequestNewCodeView from "./views/auth/RequestNewCodeView";
import ForgotPasswordView from "./views/auth/ForgotPasswordView";
import GeneratePasswordView from "./views/auth/GeneratePasswordView";

import ProfileView from "./views/profile/ProfileView";
import ChangePasswordView from "./views/profile/ChangePasswordView";
import ProfileLayout from "./layouts/ProfileLayout";
import ProjectTeamView from "./views/projects/ProjectTeamView";
import NotFound from "./views/404/NotFound";
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/projects/create" element={<CreateProjectView />} />
          <Route path="/projects/:projectId" element={<ProjectDetailsView />} />
          <Route
            path="/projects/:projectId/team"
            element={<ProjectTeamView />}
          />
          <Route
            path="/projects/:projectId/edit"
            element={<EditProjectView />}
          />
          <Route element={<ProfileLayout />}>
            <Route path="/profile" element={<ProfileView />} />
            <Route
              path="profile/change-password"
              element={<ChangePasswordView />}
            />
          </Route>
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/auth/login" element={<LoginView />} />
          <Route path="/auth/register" element={<RegisterView />} />
          <Route
            path="/auth/confirm-account"
            element={<ConfirmAccountView />}
          />
          <Route path="/auth/request-code" element={<RequestNewCodeView />} />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordView />}
          />
          <Route path="/auth/new-password" element={<GeneratePasswordView />} />
          <Route path="/404" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
