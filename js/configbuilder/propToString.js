
function propToString(prop, val) {
    let string = '',
        denom = "'";
   
    if (val.indexOf('function') === 0) { denom = ''; }
    string += prop + ': ' + denom + val + denom;

    return string;
}

export default propToString;