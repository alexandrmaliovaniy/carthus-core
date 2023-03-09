import React, {FC, ReactElement} from "react";
import {NonIndexRouteObject, Outlet, RouteObject} from "react-router-dom";

interface ICreateRouteProps {
    path: string;
    Guard: FC | null;
    Component: FC | null;
    routes: RouteObject[] | RouteObject[][];
}

function CreateRoute({path, Guard, Component, routes}: ICreateRouteProps): RouteObject[] {
    if (Guard) {
        const route: RouteObject = {
            path: path,
            element: <Guard />,
            children: [{path: "", element: Component && <Component />}, ...routes.flat()]
        }
        return [route];
    }
    const route: RouteObject = {
        path: path,
        element: Component && <Component />,
    }
    const childRoutes = routes.flat().map(route => ({...route, path: path + route.path}));
    return [route, ...childRoutes];
}

export default CreateRoute;