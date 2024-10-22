import { DateTimeRegexType } from "../@types/objectTypes";

/**
 * Date time object regular expressions.
 */
const dateTimeRegex: DateTimeRegexType = {
    date: RegExp(/\d{4}-\d{2}-\d{2}/),
    time: RegExp(/\d{2}:\d{2}:\d{2}/),
    dateTime: RegExp(/\d{4}-\d{2}-\d{2} - \d{2}:\d{2}:\d{2}/)
}

/**
 * Use this function to convert a std date (Y-m-d H:i:s) to 
 * a human readable string: d - Month - y - H:i:s
 * 
 * @param stdDate 
 * @returns {string}
 */
function toTextDate(stdDate: string): string {
    const date = new Date(stdDate);

    // Format the date.
    const dateOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    const fDate = new Intl.DateTimeFormat('it-IT', dateOptions).format(date);

    if (dateHasTime(stdDate)) {
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        const fTime = new Intl.DateTimeFormat('it-IT', timeOptions).format(date);

        return `${fDate} - ${fTime}`;
    }

    return `${fDate}`;
}

/**
 * Check if the passed date is a stdDate in this format: Y-m-d H:i:s
 * @param stdDate
 * @return {boolean}
 */
function isStdDate(stdDate: string): boolean {
    return dateTimeRegex.date.test(stdDate);
}

/**
 * Check if a passed string has effectively a date in this format Y-m-d.
 * 
 * @param stdDate 
 * @param {boolean}
 */
function dateHasDate(stdDate: string): boolean {
    return dateTimeRegex.date.test(stdDate) as boolean;
}

/**
 * Check if a date has time inside its string.
 * 
 * @param stdDate 
 * @returns {boolean}
 */
function dateHasTime(stdDate: string): boolean {
    return dateTimeRegex.time.test(stdDate) as boolean;
}

/**
 * Export.
 */
export {
    dateTimeRegex,
    toTextDate,
    isStdDate,
    dateHasDate,
    dateHasTime
}