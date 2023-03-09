import React, { FC, ReactElement, ReactNode, useMemo } from "react";
import { IService } from "../service/CreateService";
import { IProvider } from "../provider/CreateProvider";

export interface ICreateComponentConfig<T> {
    readonly providers: FC<{children: any}>[];
    View: FC<T>;
}

function CreateComponent<T>({View, providers = []}: ICreateComponentConfig<T>) {
    const Component: FC<T> = (props) => {
        const render = View(props);
        return providers.reduceRight((acc, el) => {
            const Provider = el;
            if (!Provider) throw new Error(`hook ${el} has no Provider`);
            return (
                <Provider>
                    {acc}
                </Provider>
            )
        }, render);
    }
    return Component;
}

export default CreateComponent;