function add(a: number, b: number): number {
    return a + b;
}

type UnionType = string | number

function check(x: UnionType) {
    if (typeof x === "string") {
        console.log(x.toUpperCase())
    }
}