import React, { FC, ReactElement, ReactNode, useMemo } from "react";
import { IService } from "../service/CreateService";
import { IProvider } from "../provider/CreateProvider";

type TProviderComponent<K> = FC<{children?: ReactNode} & K>;
type TProviderWithProps<K> = { provider: TProviderComponent<K>, props?: K };
type TProvider<K> = TProviderComponent<K> | TProviderWithProps<K>;

export interface ICreateRefComponentConfig<T, K> {
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

function CreateRefComponent<T, K>({View, providers = [], forwardRef = false}: ICreateRefComponentConfig<T, K>) {
    if (forwardRef) return React.forwardRef((props, ref) => {
        const providersWithProps = providers.map(provider => typeof provider === 'function' ? ({provider: provider, props: {}}) as TProviderWithProps<K> : provider);
        providersWithProps.push({
            provider: View,
            props: {...props, ref}
        })
        return renderNestedComponents<K>(providersWithProps);
    }) as FC<T>;
    const Component: FC<T> = React.forwardRef((props, ref) => {
        const providersWithProps = providers.map(provider => typeof provider === 'function' ? ({provider: provider, props: {}}) as TProviderWithProps<K> : provider);
        providersWithProps.push({
            provider: View,
            props: {...props, ref}
        })
        return renderNestedComponents<K>(providersWithProps);
    });
    return Component;
}

export default CreateRefComponent;