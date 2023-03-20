import {object, z} from 'zod';
import * as Path from "path";

interface ICreateData<T extends Array<any>, K extends z.Schema, M extends ReadonlyArray<(...args: any) => any>, C extends ((...args: T) => Promise<any>) | ((...args: T) => any)> {
    Schema: K,
    Source: C;
    middleware: M;
}

type LastElementType<T extends readonly any[], K> = T extends readonly [...infer _, infer L] ? L : K;

type UnionToIntersection<U> =
    (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never

type MiddlewareChanges<T extends readonly any[]> = T extends readonly ((...args: any) => infer L)[] ? L : never;


type Return<T, D> = T extends (...args: any[]) => Promise<any> ? Promise<D> : D;




type OptionalPropertyNames<T> =
    { [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
    { [P in K]: L[P] | Exclude<R[P], undefined> };

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<
    & Pick<L, Exclude<keyof L, keyof R>>
    & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
    & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
    & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
    >;

type Spread<A extends ReadonlyArray<((...args: any) => any) | unknown>> = A extends [infer L, ...infer R] ? L extends (...args: any) => any ?
    SpreadTwo<ReturnType<L>, Spread<R>> : unknown : unknown



function CreateData<T extends Array<any>, K extends z.Schema, M extends ReadonlyArray<(...args: any) => any>, C extends ((...args: T) => Promise<any>) | ((...args: T) => any)>({Schema, Source, middleware} : ICreateData<T, K, M, C>) {
    // type ReturnData = z.infer<typeof Schema> & UnionToIntersection<MiddlewareChanges<typeof middleware>>;

    type ReturnData = Spread<[() => z.infer<typeof Schema>, ...typeof middleware]>

    return (...args: T): Return<typeof Source, ReturnData> => {
        if (Source.constructor.name === 'AsyncFunction') {
            Source(...args)
                .then(result => {
                    Schema.parse(result);
                    let finalRes = result as z.infer<typeof Schema>;
                    for (const md of middleware) {
                        finalRes = md(finalRes);
                    }
                    return finalRes;
                })
        }
        const result = Source(...args);
        Schema.parse(result);
        let finalRes = result as z.infer<typeof Schema>;
        for (const md of middleware) {
            finalRes = md(finalRes);
        }
        return finalRes;
    }
};


interface IDataProvider<T extends Array<any>> {
    (...props: T): any
}

export type { IDataProvider }

export default CreateData;