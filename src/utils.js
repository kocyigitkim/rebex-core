export function chooseIfNotUndefined(...values) {
    for (let i = 0; i < values.length; i++) {
        if (values[i] !== undefined) {
            return values[i];
        }
    }
    return undefined;
}

export function chooseIfTrue(...values) {
    for (let i = 0; i < values.length; i++) {
        if (values[i]) {
            return true;
        }
    }
    return false;
}

export function truncateString(str, maxLength) {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    }
    return str;
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}