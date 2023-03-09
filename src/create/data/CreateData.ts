import {object, z} from 'zod';
import * as Path from "path";

interface ICreateData<T extends Array<any>, K extends z.Schema, M extends ReadonlyArray<(...args: any) => any>> {
    Schema: K,
    Source: (...args: T) => Promise<any>;
    middleware: M;
}

type LastElementType<T extends readonly any[], K> = T extends readonly [...infer _, infer L] ? L : K;


function CreateData<T extends Array<any>, K extends z.Schema, M extends ReadonlyArray<(...args: any) => any>>({Schema, Source, middleware} : ICreateData<T, K, M>) {
    return async (...args: T): Promise<ReturnType<LastElementType<typeof middleware, () => z.infer<typeof Schema>>>> => {
        const result = await Source(...args);
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