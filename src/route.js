import Dashboard from "./components/Admin/Dashboard/Dashboard";
import UserList from "./components/Admin/User/UserList";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User",
    icon: "nc-icon nc-single-02",
    component: UserList,
    layout: "/admin"
  }
];

export default dashboardRoutes;
