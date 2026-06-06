import { Outlet } from "react-router-dom";
import Tabs from "@/components/profiles/Tabs";
export default function ProfileLayout() {
  return (
    <>
      <Tabs />
      <Outlet />
    </>
  );
}
