import React, { FC, ReactElement, ReactNode, useMemo } from "react";
import { IService } from "../service/CreateService";
import { IProvider } from "../provider/CreateProvider";

type TProviderComponent<K> = FC<{children?: ReactNode, props?: K}>;
type TProviderWithProps<K> = { provider: TProviderComponent<K>, props?: K };
type TProvider<K> = TProviderComponent<K> | TProviderWithProps<K>;

export interface ICreateComponentConfig<T, K> {
    readonly providers: Array<TProvider<K>>;
    View: FC<T>;
}

function renderNestedComponents<K>(components: TProviderWithProps<K>[]) {
    // Base case: if there are no components left to render, return null
    if (components.length === 0) {
        return null;
    }

    const {provider : Component, props} = components[0];

    if (components.length === 1) {
        return <Component {...props} />
    }

    // Get the first component in the array


    // Recursively render the rest of the components in the array
    const nestedComponents = renderNestedComponents(components.slice(1));

    // Render the current component and its nested components
    return <Component {...props}>{nestedComponents}</Component>;
}

function CreateComponent<T, K>({View, providers = []}: ICreateComponentConfig<T, K>) {
    const Component: FC<T> = (props) => {
        const render = View(props);
        const providersWithProps = providers.map(provider => typeof provider === 'function' ? ({provider: provider, props: {}}) as TProviderWithProps<K> : provider);
        providersWithProps.push({
            provider: View,
            props: props
        })

        return renderNestedComponents<K>(providersWithProps);

        // return providers.reduceRight((acc, el) => {
        //     const [Provider, props] = typeof el === 'function' ? [el, undefined] : [el.provider, el.props];
        //     if (!Provider) throw new Error(`hook ${el} has no Provider`);
        //     return (
        //         <Provider props={props}>
        //             {acc}
        //         </Provider>
        //     )
        // }, render);
    }
    return Component;
}

export default CreateComponent;