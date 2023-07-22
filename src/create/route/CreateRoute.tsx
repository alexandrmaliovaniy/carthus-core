import React, {FC, ReactElement} from "react";
import {IndexRouteObject, NonIndexRouteObject, Outlet, RouteObject} from "react-router-dom";

type IRoute = IRouteElement[] & { PATH: Readonly<string> };
type IRouteElement = NonIndexRouteObject & { Route: IRoute, Check?: boolean };

interface ICreateRouteProps {
    path: string;
    Guard: ((...args: any[]) => any) | null;
    Layout: ((...args: any[]) => any) | null;
    Component: ((...args: any[]) => any) | null;
    routes: IRoute[];
}

function CreateRoute({path, Guard, Component, Layout, routes}: ICreateRouteProps): IRoute {
    if (Guard || Layout) {
        if (!Layout) throw "Layout is not Provided";

        //@ts-ignore
        const out: IRoute = [];

        const Wrapper = Guard && <Guard><Layout /></Guard> || <Layout />;
        const route: IRouteElement = {
            path: path,
            element: Wrapper,
            children: [{path: "", element: Component && <Component />}],
            Route: out,
            Check: true,
        }

        out.push(route);


        routes.forEach(routeNode => {
            const compiledPath = routeNode.map(route => {
                return ({...route, path: route.path});
            });
            route.children!.push(...compiledPath)
        })
        // out.PATH = path;
        return out;
    }
    //@ts-ignore
    const out:IRoute = [];
    const route: IRouteElement = {
        path: path,
        element: Component && <Component />,
        Route: out,
        Check: true
    }
    out.push(route);
    routes.forEach(routeNode => {
        const compiledPath = routeNode.map(route => {
            return ({...route, path: (path + "/" +  route.path).replace(/\/+/, "/")});
        });
        out.push(...compiledPath)
    })
    // out.PATH = path;
    return out;
}

export default CreateRoute;