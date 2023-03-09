import React, {FC, ReactElement} from "react";
import {NonIndexRouteObject, Outlet, RouteObject} from "react-router-dom";

interface ICreateRouterProps {
    path: string;
    Guard: FC | null;
    Component: FC | null;
    routes: RouteObject[] | RouteObject[][];
}

function CreateRouter({path, Guard, Component, routes}: ICreateRouterProps): RouteObject[] {
    if (Guard) {
        const route: RouteObject = {
            path: path,
            element: <Guard />,
            children: [{path: "", element: Component && <Component />}]
        }
        return [route, ...routes.flat().map(route => ({...route, path: path + route.path}))];
    }
    const route: RouteObject = {
        path: path,
        element: Component && <Component />,
    }
    const childRoutes = routes.flat().map(route => ({...route, path: path + route.path}));
    return [route, ...childRoutes];
}

export default CreateRouter;