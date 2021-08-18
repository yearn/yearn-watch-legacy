import qs from 'query-string';
import { GenericListItem } from '../components/app';

/*
    Extreme	> 100M	5
    Very High	less than 100M	4
    High	less than 50M	3
    Medium 	less than 10M	2
    Low	less than 1M	1
*/
export const getTvlImpact = (tvl: number): number => {
    if (tvl < 1) {
        return 1;
    }
    if (tvl < 10) {
        return 2;
    }
    if (tvl < 50) {
        return 3;
    }
    if (tvl < 100) {
        return 4;
    }
    return 5;
};

export const getLongevityScore = (days: number): number => {
    /*
        5: Worst Score, new code, did not go to ape tax before
        4: Code has been live less than a month
        3: 1 to <4 months live
        2: 4+ months live
        1: Best score, Has had a 8+ months live in prod with no critical issues found and No changes in code base
    */
    if (days < 7) {
        return 5;
    }
    if (days <= 30) {
        return 4;
    }
    if (days < 120) {
        return 3;
    }
    if (days <= 240) {
        return 2;
    }
    return 1;
};

export const getExcludeIncludeUrlParams = (item: GenericListItem) => {
    const include = item.include ? ((item.include as unknown) as string[]) : [];
    const exclude = item.exclude ? ((item.exclude as unknown) as string[]) : [];
    const params = qs.stringify({ exclude, include });
    const urlParam = params.length > 0 ? `?${params}` : '';
    return urlParam;
};
