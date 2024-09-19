import Dashboard from "./components/Admin/Dashboard/Dashboard";
import createUser from "./components/Admin/User/CreateUser";
import EditUser from "./components/Admin/User/EditUser";
import UserList from "./components/Admin/User/UserList";
import ViewUser from "./components/Admin/User/ViewUser";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
    type:"sideBar"
  },
  {
    path: "/user",
    name: "User",
    icon: "nc-icon nc-single-02",
    component: UserList,
    layout: "/admin",
    type:"sideBar"
  },
  {
    path: "/user/add",
    name: "Add User",
    icon: "nc-icon nc-chart-pie-35",
    component: createUser,
    layout: "/admin"
    },
    {
      path: "/user/edit",
      name: "Edit User",
      icon: "nc-icon nc-chart-pie-35",
      component: EditUser,
      layout: "/admin"
      },
      {
        path: "/user/view/:id",
        name: "View User",
        icon: "nc-icon nc-chart-pie-35",
        component: ViewUser,
        layout: "/admin"
        },
];

export default dashboardRoutes;
