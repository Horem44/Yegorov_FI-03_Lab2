const bigInt = require('./bigLib');
const big = new bigInt();

function reverse(s){
    return s.split("").reverse().join("");
}

function killLastDigits(x, i) {
    return x.slice(0, -i);
}

function isEven(x){
    return x.endsWith("0");
}

function extended_gcdBin(p, q) {
    let shift = 0;

    while(isEven(p) && isEven(q)){
        p = killLastDigits(p, 1);
        q = killLastDigits(q, 1);
        shift++;
    }

    let p_0 = p;
    let q_0 = q;
    let sp = "1";
    let sq = "0";
    let tp = "0";
    let tq = "1";

    while(isEven(p)){
        if(!(isEven(sp) && isEven(sq))) {
            sp = big.subBin(sp, q_0);
            sq = big.sumBin(sq, p_0);
        }
        p = killLastDigits(p, 1);
        sp = killLastDigits(p, 1);
        sq = killLastDigits(p, 1);
    }

    while(big.compareBin(q, '0') !== 0){
        while(isEven(q)){
            if(!(isEven(tp) && isEven(tq))){
                tp = big.subBin(tp, q_0);
                tq = big.sumBin(tq, p_0);
            }
            q = killLastDigits(q, 1);
            tp = killLastDigits(tp, 1);
            tq = killLastDigits(tq, 1);
        }

        if(big.compareBin(p, q) === 1) {
            let t = p;
            p = q;
            q = t;

            t = sp;
            sp = tp;
            tp = t;

            t = sq;
            sq = tq;
            tq = t;
        }

        q = big.subBin(q, p);
        tp = big.subBin(tp, sp);
        tq = big.subBin(tq, sq);
    }

    return [big.shiftDigitsToHigh(p, shift) ,sp, sq];
}

function extended_gcd(p, q){
    p = big.hexToBinary(p);
    q = big.hexToBinary(q);

    return [big.binaryToHex(extended_gcdBin(p, q)[0]), big.binaryToHex(extended_gcdBin(p, q)[1]), big.binaryToHex(extended_gcdBin(p, q)[2])];
}

function lcmBin(x, y) {
    let gcd = extended_gcdBin(x,y)[0];
    let product = big.mulBin(x, y);
    return big.divBin(product, gcd)[0];
}

function lcm(x, y) {
    x = big.hexToBinary(x);
    y = big.hexToBinary(y);
    return big.binaryToHex(lcmBin(x, y));
}

function barretReductionBin(x, n){
    if(big.compareBin(x, big.mulBin(n, n)) === 1)
        return big.divBin(x, n)[1];


    let r = big.shiftDigitsToHigh("1", 2 * n.length);
    r = big.divBin(r, n)[0];


    let t_1 = big.mulBin(x, r)
    t_1 = big.divBin(t_1, big.shiftDigitsToHigh("1", 2*n.length))[0];
    t_1 = big.mulBin(t_1, n);
    let t = big.subBin(x, t_1);

    if(big.compareBin(t, n) === -1)
        return t;
    else
        return big.subBin(t, n);

}

function barretReduction(x, n){
    if(big.compare(x, big.mul(n, n)) === 1)
        return big.div(x, n)[1];

    x = big.hexToBinary(x);
    n = big.hexToBinary(n);
    return big.binaryToHex(barretReductionBin(x, n));
}

function modAdd(x, y, n) {
    let sum = big.sum(x, y);
    return barretReduction(sum, n);
}

function modSub(x, y, n) {
    let sub = big.sub(x, y);
    return barretReduction(sub, n);
}

function modMul(x, y, n) {
    let mul = big.mul(x, y);
    return barretReduction(mul, n);
}

function modQuadraticMul(x,n) {
    let power = big.mul(x, x);
    return barretReduction(power, n);
}

function modPowerBarretBin(num1, num2, n) {
    let result = "1";
    let num2Bin = (big.hexToBinary(num2));
    let lastStep = num2Bin.length - 1;

    for(let i = 0; i < num2Bin.length; i++){
        if(num2Bin[i] === "1") {
            result = big.mul(result, num1);
            result = barretReduction(result, n);

        }
        if(i !== lastStep){
            result = big.mul(result, result);
            result = barretReduction(result, n);
        }
    }

    return result;
}
//console.log(modAdd("87D6D58D3991D536544389CEFA72FD0EBED75B2EBDC2C79BC3717793108F0952011E7E2D7040FFFB32F10BEB8ED0A485026B6860020B230128A8222B0525A6888942FB01C537800BF25D6F021D4B99D3CBD6DF9055FA22F91A6CFC4FDFC408AEF78F6418D3CE4E20EC7888B61BAE3D73C27C257CCA905DE0353C3A7CFFD9FE15", "791EDB102DA183759979CEF70E1405AF14B98CD44357EADF6A8E35E49F99BB56CBD3F68897D6E05502ED1DE14EC46D04F96992C2D129737987E84E62371648B37633794016852A8CBFFCFDE06B17EC216AE8914D59E677A15A90361A594F0D1524A41AE63C59D343D4E522646722B0292DD7C85571AC9A84FDA6CD2D8DE307F6", "A664199B424E606126A31B875E3D5E9E9C2E13D6995CC801E60C30247808A6EE01E78895E16EAD95354FE50A9396DA3D5BDB6327FBF7DE11871BF3D0143055EC"));
//console.log(modSub("87D6D58D3991D536544389CEFA72FD0EBED75B2EBDC2C79BC3717793108F0952011E7E2D7040FFFB32F10BEB8ED0A485026B6860020B230128A8222B0525A6888942FB01C537800BF25D6F021D4B99D3CBD6DF9055FA22F91A6CFC4FDFC408AEF78F6418D3CE4E20EC7888B61BAE3D73C27C257CCA905DE0353C3A7CFFD9FE15", "791EDB102DA183759979CEF70E1405AF14B98CD44357EADF6A8E35E49F99BB56CBD3F68897D6E05502ED1DE14EC46D04F96992C2D129737987E84E62371648B37633794016852A8CBFFCFDE06B17EC216AE8914D59E677A15A90361A594F0D1524A41AE63C59D343D4E522646722B0292DD7C85571AC9A84FDA6CD2D8DE307F6", "A664199B424E606126A31B875E3D5E9E9C2E13D6995CC801E60C30247808A6EE01E78895E16EAD95354FE50A9396DA3D5BDB6327FBF7DE11871BF3D0143055EC"));
//console.log(modMul("87D6D58D3991D536544389CEFA72FD0EBED75B2EBDC2C79BC3717793108F0952011E7E2D7040FFFB32F10BEB8ED0A485026B6860020B230128A8222B0525A6888942FB01C537800BF25D6F021D4B99D3CBD6DF9055FA22F91A6CFC4FDFC408AEF78F6418D3CE4E20EC7888B61BAE3D73C27C257CCA905DE0353C3A7CFFD9FE15", "791EDB102DA183759979CEF70E1405AF14B98CD44357EADF6A8E35E49F99BB56CBD3F68897D6E05502ED1DE14EC46D04F96992C2D129737987E84E62371648B37633794016852A8CBFFCFDE06B17EC216AE8914D59E677A15A90361A594F0D1524A41AE63C59D343D4E522646722B0292DD7C85571AC9A84FDA6CD2D8DE307F6", "A664199B424E606126A31B875E3D5E9E9C2E13D6995CC801E60C30247808A6EE01E78895E16EAD95354FE50A9396DA3D5BDB6327FBF7DE11871BF3D0143055EC"));
//console.log(modQuadraticMul("87D6D58D3991D536544389CEFA72FD0EBED75B2EBDC2C79BC3717793108F0952011E7E2D7040FFFB32F10BEB8ED0A485026B6860020B230128A8222B0525A6888942FB01C537800BF25D6F021D4B99D3CBD6DF9055FA22F91A6CFC4FDFC408AEF78F6418D3CE4E20EC7888B61BAE3D73C27C257CCA905DE0353C3A7CFFD9FE15", "A664199B424E606126A31B875E3D5E9E9C2E13D6995CC801E60C30247808A6EE01E78895E16EAD95354FE50A9396DA3D5BDB6327FBF7DE11871BF3D0143055EC"));
//console.log(barretReduction("D4D2110984907B5625309D956521BAB4157B8B1ECE04043249A3D379AC112E5B9AF44E721E148D88A942744CF56A06B92D28A0DB950FE4CED2B41A0BD38BCE7D0BE1055CF5DE38F2A588C2C9A79A75011058C320A7B661C6CE1C36C7D870758307E5D2CF07D9B6E8D529779B6B2910DD17B6766A7EFEE215A98CAC300F2827DB", "DAF1ABDA4AD4D9FE3E36A529210C2AE99B905922FC0519798A26E351FE23AF375AD6BA288EE030B70DF0CE1CDF1E8B75BA56494DC6ED36B181814CD5783E6C81"));
//console.log(barretReductionBin("1111", "10"));

console.time("djd");
console.log(modPowerBarretBin('4D3C91C579C2C6216567A5241614B561ADDF76C4BB659E6FE7F65FF76A918C843F0458B3EF457BCD9022D78798A29462EC99C74E6674690267D3E9844251B39D', "ABCD12", 'DAF1ABDA4AD4D9FE3E36A529210C2AE99B905922FC0519798A26E351FE23AF375AD6BA288EE030B70DF0CE1CDF1E8B75BA56494DC6ED36B181814CD5783E6C81'));
console.timeEnd("djd");




