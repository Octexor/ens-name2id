const parseInput = (str: string) => {
    const delimeters = [/, /g, /,/g, / /g, /.eth/ig, /\./g, /\r\n/g, /\n+/g];
    let parsedStr = str;
    delimeters.forEach(d => {
        parsedStr = parsedStr.replace(d, '\n');
    });
    return parsedStr.trim().split('\n').map(n => n.trim());
};

export default parseInput;