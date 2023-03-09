import React, { createContext, FC, ReactNode, useContext } from "react"

export interface ICreateServiceConfig<T> {
    context: NonNullable<T>;
    hook: () => NonNullable<T>;

}

export interface IProvider<T> {
    Context: React.Context<NonNullable<T>>;
    Use: () => T;
    Provider?: FC<{children?: ReactNode}>;
}

function CreateProvider<T>(config: ICreateServiceConfig<T>) : IProvider<T> {
    const Context = createContext(config.context);
    const Provider: IProvider<T>['Provider'] = ({children}) => <Context.Provider value={config.hook()}>{children}</Context.Provider>;
    const Use = () => useContext(Context);


    return {
        Context,
        Provider,
        Use,
    }
}

export default CreateProvider;