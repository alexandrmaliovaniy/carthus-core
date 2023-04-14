import React, {FC, FunctionComponent, ReactElement, ReactNode, useMemo} from "react";
import { IService } from "../service/CreateService";
import { IProvider } from "../provider/CreateProvider";

export type ComponentProps<F> = F extends FC<infer P> ? P : never;

type TProviderComponent = FC<{children?: ReactNode}>;

type Return<T, D> = T extends (...args: any[]) => Promise<any> ? Promise<D> : D;

type OptionalPropertyNames<T> =
    { [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
    { [P in K]: L[P] | Exclude<R[P], undefined> };


type CommonArrayKeys<L, R, K = keyof L & keyof R, P = keyof K> = L[K] extends Array<any> ? R[K] extends Array<any> ? K : never : never;

type MergeArrays<L, R, K extends keyof L & keyof R> =
    { [P in K]: L[P] extends Array<infer M> ? R[P] extends Array<infer G> ? SpreadTwo<M, G>[] : R[P] : R[P] }

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
    & Pick<L, Exclude<keyof L, keyof R>>
    & Pick<R, Exclude<Exclude<keyof R, OptionalPropertyNames<R>>, CommonArrayKeys<L, R>>>
    & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
    & MergeArrays<L, R, keyof L & keyof R>
    & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
    >;


type Spread<A extends ReadonlyArray<FunctionComponent<any> | unknown>> = A extends [infer L, ...infer R]
    ? L extends FunctionComponent<infer C>
        ? SpreadTwo<C, Spread<R>>
        : 123
    : null;


type ArrayToIntersection<T extends readonly any[]> = T extends readonly [React.FC<infer Head>, ...infer Tail]
    ? [Head, ...MergeArray<Tail>]
    : never;

type MergeArray<T extends readonly any[]> = ArrayToIntersection<T>

export interface ICreateComponentConfig<T, K extends ReadonlyArray<any>> {
    readonly providers: K;
    View: FC<T>;
}

function renderNestedComponents<K, T>(components: TProviderComponent[], actualProps: T) {
    // Base case: if there are no components left to render, return null
    if (components.length === 0) {
        return null;
    }

    const Component = components[0];

    console.log(actualProps)

    if (components.length === 1) {
        return <Component {...actualProps} />
    }

    // Get the first component in the array


    // Recursively render the rest of the components in the array
    const nestedComponents = renderNestedComponents(components.slice(1), actualProps);

    // Render the current component and its nested components
    console.log(actualProps)
    return <Component {...actualProps}>{nestedComponents}</Component>;
}

function CreateComponent<T, K extends readonly any[]>({View, providers }: ICreateComponentConfig<T, K>) {
    const Component: FC<Spread<[FC<T>, ...K]>> = (props) => {
        console.log("QWE");
        return renderNestedComponents<K, T>([...providers, View], props);
    }
    return Component;
}

export default CreateComponent;