export function difference<T>(array1: T[], array2: T[], key: keyof T): T[] {
    const array2Keys = new Set(array2.map(item => item[key]));
    return array1.filter(item => !array2Keys.has(item[key]));
}

export function intersection<T>(array1: T[], array2: T[], key: keyof T): T[] {
    const array2Keys = new Set(array2.map(item => item[key]));
    return array1.filter(item => array2Keys.has(item[key]));
}

export function union<T>(array1: T[], array2: T[], key: keyof T): T[] {
    const map = new Map();
    
    array1.forEach(item => map.set(item[key], item));
    array2.forEach(item => map.set(item[key], item));
    
    return Array.from(map.values());
}