import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const moment = require('moment');
import * as moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);
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
    const unixTimestamp = moment.unix(parseInt(timestamp));
    const now = moment.default();

    return moment
        .duration(now.diff(unixTimestamp))
        .format('d [days] hh [hours] m [minutes]', { trim: false });
};

export const toHumanDateTextOld = (timestamp: string): string => {
    if (!isValidTimestamp(timestamp)) return '';
    const unixTimestamp = dayjs.unix(parseInt(timestamp));
    return unixTimestamp.toNow(true);
};
