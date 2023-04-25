import React, {FC} from "react";
import {NonIndexRouteObject, RouteObject} from "react-router-dom";

type IRoute = IRouteElement[] & { PATH: Readonly<string> };
type IRouteElement = NonIndexRouteObject & { Route: IRoute };

interface ICreateRouterProps {
    path: string;
    Guard: FC<{ children: any }> | null;
    Layout: FC | null;
    Component: FC | null;
    routes: IRoute[];
}


function CreateRouter({path, Guard, Layout, Component, routes}: ICreateRouterProps): IRoute {
    if (Guard || Layout) {
        if (!Layout) throw "Layout is not Provided";
        const Wrapper = Guard && <Guard><Layout /></Guard> || <Layout />;
        const route: RouteObject = {
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

export default CreateRouter;