
function propToString(ob) {
    let string = '',
        denom = "'";
    for (let key in ob) {
        if (ob[key].indexOf('function') === 0) { denom = ''; }
        string += key + ': ' + denom + ob[key] + denom;
    }
    return string;
}

export default propToString;