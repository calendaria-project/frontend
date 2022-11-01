import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { IActionMethodCallback, IRequestData } from "./interfaces";
import exceptions from "./json/exceptions.json";
import exceptionsV2 from "./json/exceptionsV2.json";
import { ApyType } from "./types";

const mode = "DEVELOPMENT";

/**
 * @deprecated use actionMethodResultSync
 */
export const actionMethodResult = (
    data: IRequestData | IRequestData[] | any[],
    callback: ({ error, data, next }: IActionMethodCallback) => void
): never | void => {
    if (Array.isArray(data)) {
        const { errors, result } = arrayData(data);

        const nextFnc = function* nextFunctionGenerator(): Generator<any, any, any> {
            yield result;
        };

        const nextFunction = nextFnc();

        callback({ error: errors, data: result, next: nextFunction.next });
    } else {
        const result = defaultData(data);

        const nextFnc = function* nextFunctionGenerator(): Generator<any, any, any> {
            yield result;
        };

        const nextFunction = nextFnc();

        callback({ error: result.error, data: result.data, next: nextFunction.next });
    }
};

interface IErrorData {
    status:
        | 400
        | 401
        | 402
        | 403
        | 404
        | 405
        | 406
        | 407
        | 408
        | 409
        | 410
        | 418
        | 419
        | 429
        | 434
        | 500
        | 503
        | 507
        | 520;
    message: string;
}

export const actionMethodResultSync = async (
    /**
     * axios url
     */
    apiType: ApyType,
    /**
     * axios url
     */
    url: string,
    /**
     * axios method
     */
    method: "post" | "get" | "patch" | "put" | "delete",
    /**
     * axios config
     */
    config?: AxiosRequestConfig,
    /**
     * axios data (post, patch, put, delete)
     */
    data?: any[] | object | null,
    /**
     * set own event handler
     */
    errorData?: IErrorData[],
    /**
     * using for render own function
     */
    fnc = {
        beforeRequest: (...args: any): void => {},
        afterRequest: (response: AxiosResponse): void => {}
    }
) => {
    try {
        fnc.beforeRequest();
        let actionCallback;
        let baseUrl = "";
        switch (apiType) {
            case "DICTIONARY":
                baseUrl = String(process.env.DICTIONARY_URL);
                break;
            case "FILE":
                baseUrl = String(process.env.FILE_URL);
                break;
            case "USER":
                baseUrl = String(process.env.USER_URL);
                break;
            default:
                break;
        }
        const requestUrl = baseUrl + url;
        switch (method) {
            case "get":
                var response = await axios
                    .get(requestUrl, config)
                    .catch((reason) => exceptionHandler(requestUrl, reason, errorData));
                break;
            case "patch":
                var response = await axios
                    .patch(requestUrl, data, config)
                    .catch((reason) => exceptionHandler(requestUrl, reason, errorData));
                break;
            case "post":
                var response = await axios
                    .post(requestUrl, data, config)
                    .catch((reason) => exceptionHandler(requestUrl, reason, errorData));
                break;
            case "put":
                var response = await axios
                    .put(requestUrl, data, config)
                    .catch((reason) => exceptionHandler(requestUrl, reason, errorData));
                break;
            case "delete":
                var response = await axios
                    .delete(requestUrl, config)
                    .catch((reason) => exceptionHandler(requestUrl, reason, errorData));
        }

        fnc.afterRequest(response);

        if (response?.data) {
            actionCallback = response.data;
        }

        return actionCallback;
    } catch (err: any) {
        const messageError = mode.includes("PROD")
            ? err.message?.split("!")[0]
            : err.message?.split("!")[1];
        throw new Error(messageError);
        // throw new Error();
    }
};

export const exceptionHandler = (url: string, err: AxiosError, errorData?: IErrorData[]): never => {
    const response = err.response!;

    if (response) {
        if (errorData) {
            let hasResult = errorData.find((err) => err.status === response.status);

            if (hasResult) throw new Error(hasResult.message);
        }

        let exception = exceptionsV2.find((obj) => obj.status === response.status);
        throw new Error(
            `${exception?.message} \n !${mode} MODE: exception status ${exception?.status} \n ${exception?.httpMessage}`
        );
        // throw new Error();
    } else {
        if (mode.includes("LOCAL")) {
            setTimeout(() => {
                window.open(url);
            }, 4000);
            throw new Error(
                `!${mode} failed to response to server, check access to ${url}. \n Opening ${url}...`
            );
        } else
            throw new Error(
                `Произошла ошибки при оброботке запроса, пожалуйста, повторите попытку чуть позднее \n !${mode} MODE: failed to response to server`
            );
    }
};

const defaultData = (
    data: any
): {
    error: object | null;
    data: {};
} => {
    const result = {
        error: {} as object | null,
        data: {}
    };

    if (data.code !== "SUCCESS") {
        const exceptionData = exceptions.find((el) => el.code === data.statusCode) as object;

        result.error = {
            ...exceptionData,
            ...data
        };
    } else {
        result.error = null;
        result.data = data.data;
    }

    return result;
};

const arrayData = (data: any[]) => {
    const errors = [] as any;
    const result = [] as any;

    data.forEach((element, index) => {
        if (element.data.code === "SUCCESS") {
            result.push(element.data.data);
        } else {
            const exceptionData = exceptions.find(
                (el) => el.code === element.data.statusCode
            ) as object;

            errors.push({
                error: {
                    ...exceptionData,
                    ...data[index]
                }
            });
        }
    });

    return {
        errors,
        result
    };
};
