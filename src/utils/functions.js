export const tempConversion = (num, unit) => {
    return unit === 'C' ? num : ((num * 1.8) + 32);
}

export const humanizeStr = (str) => {
    return (str || '')
        .replace(/^[\s_]+|[\s_]+$/g, '')
        .replace(/[_\s]+/g, ' ')
        .replace(/^[a-z]/, function (m) { return m.toUpperCase(); });
}