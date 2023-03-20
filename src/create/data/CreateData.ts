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


function CreateData<T extends Array<any>, K extends z.Schema, M extends ReadonlyArray<(...args: any) => any>, C extends ((...args: T) => Promise<any>) | ((...args: T) => any)>({Schema, Source, middleware} : ICreateData<T, K, M, C>) {
    type ReturnData = z.infer<typeof Schema> & UnionToIntersection<MiddlewareChanges<typeof middleware>>;

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