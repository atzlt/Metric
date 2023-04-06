// deno-lint-ignore no-explicit-any
export function argError(funcName: string, args: any[]) {
    return new Error(
        `Incorrect arguments in ${funcName}:\n${
            args.map((val, _) => val.toString()).join(";\n")
        }`,
    );
}
