import React, { createContext, FC, ReactNode, useContext } from "react"

export interface ICreateServiceConfig<T> {
    hook: () => NonNullable<T>;
}

export interface IService<T> {
    Use: () => T;
}

function CreateService<T>(config: ICreateServiceConfig<T>) : IService<T> {
    return {
        Use: config.hook
    }
}

export default CreateService;