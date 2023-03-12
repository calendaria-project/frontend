import React from "react";
import { Navigate, RouteObject } from "react-router-dom";
import List from "./list";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Navigate to="/list" />
    },
    {
        path: "/list",
        element: <List />
    }
];

export default routes;
