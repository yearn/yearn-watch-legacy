import { BigNumber } from 'ethers';
import * as moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

export const isValidTimestamp = (timestamp: string): boolean => {
    return moment.unix(parseInt(timestamp)).isValid();
};
// Unix Timestamp (seconds)
export const toIsoString = (timestamp: string): string => {
    if (!isValidTimestamp(timestamp)) return '';
    const unixTimestamp = moment.unix(parseInt(timestamp)).utc();

    return unixTimestamp.toISOString();
};

// Unix Timestamp (milliseconds)
export const unixMsToIsoString = (timestamp: string): string => {
    if (!isValidTimestamp(timestamp)) return '';
    const unixTimestamp = moment.default(parseInt(timestamp)).utc();

    return unixTimestamp.toISOString();
};

export const toHumanDateText = (timestamp: string): string => {
    if (!isValidTimestamp(timestamp)) return '';
    const unixTimestamp = moment.unix(parseInt(timestamp)).utc();
    const now = moment.utc();

    return moment
        .duration(now.diff(unixTimestamp))
        .format('d [days] hh [hours] m [minutes]', { trim: false });
};

interface LastReportLike {
    lastReportText: string;
    lastReport: string | BigNumber;
}

export const displayLastReport = (value?: LastReportLike): string => {
    return value && value.lastReport
        ? `${value.lastReportText} (${unixMsToIsoString(
              value.lastReport.toString()
          )})`
        : '';
};
