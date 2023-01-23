export const getFormattedDateFromNow = (date: string, locales = "ru-RU") => {
    return new Date(date).toLocaleDateString(locales);
};

export const getFormattedDateFromNowWithTime = (date: string, locales = "ru-RU") => {
    return new Date(date).toLocaleDateString(locales, {
        hour: "2-digit",
        minute: "2-digit"
    });
};
