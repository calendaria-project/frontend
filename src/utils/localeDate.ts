interface DateTimeFormatOptions {
    localeMatcher?: "best fit" | "lookup" | undefined;
    weekday?: "long" | "short" | "narrow" | undefined;
    era?: "long" | "short" | "narrow" | undefined;
    year?: "numeric" | "2-digit" | undefined;
    month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
    day?: "numeric" | "2-digit" | undefined;
    hour?: "numeric" | "2-digit" | undefined;
    minute?: "numeric" | "2-digit" | undefined;
    second?: "numeric" | "2-digit" | undefined;
    timeZoneName?:
        | "short"
        | "long"
        | "shortOffset"
        | "longOffset"
        | "shortGeneric"
        | "longGeneric"
        | undefined;
    formatMatcher?: "best fit" | "basic" | undefined;
    hour12?: boolean | undefined;
    timeZone?: string | undefined;
}

const localeDate = (date: string, locale: string) => {
    const options: DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        timeZone: "UTC"
    };

    return new Date(date).toLocaleString(locale, options);
};
export default localeDate;
