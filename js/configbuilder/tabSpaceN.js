

function tabSpaceN(n) {
    const tabSpace = '    ';
    let result = '';
    for (let i = 0; i < n; i++) {
        result += tabSpace;
    }
    return result;
}

export default tabSpaceN;