import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Test from "./components/Admin/Dashboard/Test";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/test",
    name: "Test",
    icon: "nc-icon nc-chart-pie-35",
    component: Test,
    layout: "/admin"
  }
];

export default dashboardRoutes;
