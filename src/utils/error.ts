export const getError = (e: unknown): string => {
    let err = 'error';
    if (typeof e === 'string') {
        err = e; // works, `e` narrowed to string
    } else if (e instanceof Error) {
        err = e.message; // works, `e` narrowed to Error
    }
    return err;
};
