import React, {FC, ReactElement} from "react";
import {IndexRouteObject, NonIndexRouteObject, Outlet, RouteObject} from "react-router-dom";

type IRoute = IRouteElement[] & { PATH: Readonly<string> };
type IRouteElement = NonIndexRouteObject & { Route: IRoute };

interface ICreateRouteProps {
    path: string;
    Guard: FC<{ children: any }> | null;
    Layout: FC | null;
    Component: FC | null;
    routes: IRoute[];
}

function CreateRoute({path, Guard, Component, Layout, routes}: ICreateRouteProps): IRoute {
    if (Guard || Layout) {
        if (!Layout) throw "Layout is not Provided";

        const Wrapper = Guard && <Guard><Layout /></Guard> || <Layout />;
        const route: NonIndexRouteObject = {
            path: path,
            element: Wrapper,
            children: [{path: "", element: Component && <Component />}]
        }
        //@ts-ignore
        const out: IRoute = [route];

        routes.forEach(routeNode => {
            const compiledPath = routeNode.map(route => {
                route.Route.PATH = (path + "/" + route.path).replace(/\/+/, "/");
                return ({...route, path: route.Route.PATH});
            });
            route.children!.push(...compiledPath)
        })
        out.PATH = path;
        return out;
    }
    //@ts-ignore
    const out:IRoute = [];
    const route: IRouteElement = {
        path: path,
        element: Component && <Component />,
        Route: out
    }
    out.push(route);
    routes.forEach(routeNode => {
        const compiledPath = routeNode.map(route => {
            route.Route.PATH = (path + "/" +  route.path).replace(/\/+/, "/")
            return ({...route, path: route.Route.PATH});
        });
        out.push(...compiledPath)
    })
    out.PATH = path;
    return out;
}

export default CreateRoute;