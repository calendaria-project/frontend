import { AxiosRequestConfig } from "axios";

export const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const postFormDataHeader = (token: string): AxiosRequestConfig => {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "*/*"
        }
    };
};

export const getRequestHeader = (token: string): AxiosRequestConfig => {
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json"
        }
    };
};
