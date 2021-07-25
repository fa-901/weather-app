export const tempConversion = (num, unit) => {
    return unit === 'C' ? num : ((num * 1.8) + 32);
}