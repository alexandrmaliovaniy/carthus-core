import React, {FC} from "react";
import {RouteObject} from "react-router-dom";

interface ICreateRouterProps {
    path: string;
    Guard: FC<{ children: any }> | null;
    Layout: FC | null;
    Component: FC | null;
    routes: RouteObject[] | RouteObject[][];
}


function CreateRouter({path, Guard, Layout, Component, routes}: ICreateRouterProps): RouteObject[] {
    if (Guard || Layout) {
        const Wrapper = Guard && <Guard><Layout /></Guard> || <Layout />;
        const route: RouteObject = {
            path: path,
            element: Wrapper,
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