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

function modAddBarret(x, y, n) {
    let sum = big.sum(x, y);
    return barretReduction(sum, n);
}

function modSubBarret(x, y, n) {
    let sub = big.sub(x, y);
    return barretReduction(sub, n);
}

function modMulBarret(x, y, n) {
    let mul = big.mul(x, y);
    return barretReduction(mul, n);
}

function modQuadraticMulBarret(x,n) {
    let power = big.mul(x, x);
    return barretReduction(power, n);
}

function modPowerBarret(num1, num2, n) {
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

let a = "3A7EF2554E8940FA9B93B2A5E822CC7BB262F4A14159E4318CAE3ABF5AEB1022EC6D01DEFAB48B528868679D649B445A753684C13F6C3ADBAB059D635A2882090FC166EA9F0AAACD16A062149E4A0952F7FAAB14A0E9D3CB0BE9200DBD3B0342496421826919148E617AF1DB66978B1FCD28F8408506B79979CCBCC7F7E5FDE7";
let b = "D4D2110984907B5625309D956521BAB4157B8B1ECE04043249A3D379AC112E5B9AF44E721E148D88A942744CF56A06B92D28A0DB950FE4CED2B41A0BD38BCE7D0BE1055CF5DE38F2A588C2C9A79A75011058C320A7B661C6CE1C36C7D870758307E5D2CF07D9B6E8D529779B6B2910DD17B6766A7EFEE215A98CAC300F2827DB";
let c = "791EDB102DA183759979CEF70E1405AF14B98CD44357EADF6A8E35E49F99BB56CBD3F68897D6E05502ED1DE14EC46D04F96992C2D129737987E84E62371648B37633794016852A8CBFFCFDE06B17EC216AE8914D59E677A15A90361A594F0D1524A41AE63C59D343D4E522646722B0292DD7C85571AC9A84FDA6CD2D8DE307F6";
let n = "170076B15F9575D21DE39D5C429799BBCDDB867016DE2248E3CFDE73A4D70C8636A9E41ABE671E7B9FB4739A5FF64DF9D0D3A64E0C9B20BFE58F1C62B28477EE9FD202010BAC440ADF3CA016A32DB844F23DEC2AB93AE869A6262FC23C5CE419807CDBA930A5433884E3B34B22477289BD3A7712CDD4B4110BD9887E7428FDF7";

//(a+b)*c mod n
let result = barretReduction(big.mul(big.sum(a,b), c), n);
console.log(result + '\n');

//c*(a+b) mod n
result = barretReduction(big.mul(c, big.sum(a,b)), n);
console.log(result + '\n');

//a*c + c*b mod n
result = barretReduction(big.sum(big.mul(a,c), big.mul(b,c)), n);
console.log(result + '\n');

//n*a mod m = a + a + ... + a mod m
//                   n

a = "8703A1E982F278420C2D60CA7A0ED76C91855E3147B50357074A04EAF6515F07C1D8967674C7577D4112652E8135D145329F0DAE738F75C35004A154F1C43449DB87B6BE0F3EBF5B3BA1016F0A04A10C7EA76C3D30EEDB34B1E6E1009B3FF5C987FA313097485E6F8C78744E2F49DF62D13AD204E00F731BAE0E085C353D8D75";
result = "0";
n = "791EDB102DA183759979CEF70E1405AF14B98CD44357EADF6A8E35E49F99BB56CBD3F68897D6E05502ED1DE14EC46D04F96992C2D129737987E84E62371648B37633794016852A8CBFFCFDE06B17EC216AE8914D59E677A15A90361A594F0D1524A41AE63C59D343D4E522646722B0292DD7C85571AC9A84FDA6CD2D8DE307F6";

let t = 100;

for(let i = 0; i < 256; i++){
    result = big.sum(a, result);
}
console.log(barretReduction(result, n) + '\n');

result = barretReduction(big.mul(a, t.toString()), n);
console.log(result);






