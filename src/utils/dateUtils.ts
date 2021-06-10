import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);

export const isValidTimestamp = (timestamp: string): boolean => {
    return dayjs.unix(parseInt(timestamp)).isValid();
};
// Unix Timestamp (seconds)
export const toIsoString = (timestamp: string): string => {
    if (!isValidTimestamp(timestamp)) return '';
    const unixTimestamp = dayjs.unix(parseInt(timestamp));

    return unixTimestamp.toISOString();
};

// Unix Timestamp (milliseconds)
export const unixMsToIsoString = (timestamp: string): string => {
    if (!isValidTimestamp(timestamp)) return '';
    const unixTimestamp = dayjs(parseInt(timestamp));

    return unixTimestamp.toISOString();
};

export const toHumanDateText = (timestamp: string): string => {
    if (!isValidTimestamp(timestamp)) return '';
    const unixTimestamp = dayjs.unix(parseInt(timestamp));
    return unixTimestamp.toNow(true);
};
