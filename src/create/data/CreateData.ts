import {object, z} from 'zod';
import * as Path from "path";

interface ICreateData<T extends Array<any>, K extends z.Schema, M extends ReadonlyArray<(...args: any) => any>, C extends ((...args: T) => Promise<any>) | ((...args: T) => any)> {
    Schema: K,
    Source: C;
    middleware: M;
}

type LastElementType<T extends readonly any[], K> = T extends readonly [...infer _, infer L] ? L : K;



type Return<T, D> = T extends (...args: any[]) => Promise<any> ? Promise<D> : D;


function CreateData<T extends Array<any>, K extends z.Schema, M extends ReadonlyArray<(...args: any) => any>, C extends ((...args: T) => Promise<any>) | ((...args: T) => any)>({Schema, Source, middleware} : ICreateData<T, K, M, C>) {
    type ReturnData = ReturnType<LastElementType<typeof middleware, () => z.infer<typeof Schema>>>;

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