import React, { FC, ReactElement, ReactNode, useMemo } from "react";
import { IService } from "../service/CreateService";
import { IProvider } from "../provider/CreateProvider";

type TProvider<K> = FC<{children: ReactNode, props?: K}> | { provider: FC<{children: ReactNode, props?: K}>, props?: K }

export interface ICreateComponentConfig<T, K> {
    readonly providers: Array<TProvider<K>>;
    View: FC<T>;
}

function CreateComponent<T, K>({View, providers = []}: ICreateComponentConfig<T, K>) {
    const Component: FC<T> = (props) => {
        const render = <View {...props} />;
        return providers.reduceRight((acc, el) => {
            const [Provider, props] = typeof el === 'function' ? [el, undefined] : [el.provider, el.props];
            if (!Provider) throw new Error(`hook ${el} has no Provider`);
            return (
                <Provider props={props}>
                    {acc}
                </Provider>
            )
        }, render);
    }
    return Component;
}

export default CreateComponent;