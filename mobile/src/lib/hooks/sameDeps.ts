export const sameDeps = (a: readonly unknown[], b: readonly unknown[]) => a.length === b.length && a.every((item, i) => Object.is(item, b[i]));
