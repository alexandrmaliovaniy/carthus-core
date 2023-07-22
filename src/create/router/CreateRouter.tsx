import React, {FC} from "react";
import {NonIndexRouteObject, RouteObject} from "react-router-dom";

type IRoute = IRouteElement[] & { PATH: Readonly<string> };
type IRouteElement = NonIndexRouteObject & { Route: IRoute, Check?: boolean };

interface ICreateRouterProps {
    path: string;
    Guard: ((...args: any[]) => any) | null;
    Layout: ((...args: any[]) => any) | null;
    Component: ((...args: any[]) => any) | null;
    routes: IRoute[];
}

const UpdatePath = (routes: IRoute, path: string) => {
    routes.PATH = path;
    routes.forEach(route => {
        if (!route.Check) return;
        route.Route.PATH = (path + "/" + route.path).replace(/\/+/, "/");
        console.log(route.Route.PATH, path, route.path)
        if (!route.children) return;
        route.children.forEach(children => {
            if (!children.Check) return;
            UpdatePath(children.Route, (route.Route.PATH).replace(/\/+/, "/"))
        })
    })
}

function CreateRouter({path, Guard, Layout, Component, routes}: ICreateRouterProps): IRoute {
    if (Guard || Layout) {
        if (!Layout) throw "Layout is not Provided";
        const Wrapper = Guard && <Guard><Layout /></Guard> || <Layout />;
        //@ts-ignore
        const out: IRoute = [];
        const route: IRouteElement = {
            path: path,
            element: Wrapper,
            children: [{path: "", element: Component && <Component />}],
            Route: out
        }
        out.push(route);

        routes.forEach(routeNode => {
            const compiledPath = routeNode.map(route => {
                return ({...route, path: (path + "/" + route.path).replace(/\/+/, "/")});
            });
            out.push(...compiledPath)
        })
        // out.PATH = path;
        UpdatePath(out, path);
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
            return ({...route, path: (path + "/" + route.path).replace(/\/+/, "/")});
        });
        out.push(...compiledPath)
    })
    // out.PATH = path;
    UpdatePath(out, path);
    return out;
}

export default CreateRouter;