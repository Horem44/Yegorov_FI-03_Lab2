const binaryHexMap = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    "A": "1010",
    "B": "1011",
    "C": "1100",
    "D": "1101",
    "E": "1110",
    "F": "1111"
}

function reverse(s){
    return s.split("").reverse().join("");
}

class bigInt {
    deleteZero(num){
        let pos = 0;
        for (let i = 0; i < num.length; i++) {
            if (num[i] !== "0") {
                pos = i;
                break;
            }
        }
        return pos;
    }

    addZero(num1, num2){
        num1 = "0".repeat(num2.length - num1.length) + num1;
        return num1;
    }

    shiftDigitsToHigh(num, i) {
        return num + "0".repeat(i);
    }

    hexToBinary(num) {
        let numInBin = "";
        for (let i = 0; i < num.length; i++) {
            numInBin += binaryHexMap[num[i]];
        }

        if(num === "0") return "0";
        return (numInBin).slice(this.deleteZero(numInBin),);
    }

    binaryToHex(num) {
        let numInHex = "";
        let remainder = num.length % 4;

        if (remainder !== 0)
            num = "0".repeat(4 - remainder) + num;

        for (let i = 0; i < num.length; i += 4) {
            numInHex += Object.keys(binaryHexMap).find(key =>
                binaryHexMap[key] === (num[i] + num[i + 1] + num[i + 2] + num[i + 3]));
        }

        return numInHex.slice(this.deleteZero(numInHex), );
    }

    sumBin(num1, num2) {
        let carry = 0;
        let temp;
        let result = "";
        let maxlength = Math.max(num1.length, num2.length);

        if(num1.length < num2.length)
            num1 = this.addZero(num1, num2);
        else
            num2 = this.addZero(num2, num1);

        num1 = reverse(num1);
        num2 = reverse(num2);

        for(let i = 0; i < maxlength; i++){
            temp = (+num1[i]) + (+num2[i]) + carry;
            result += (temp & 1);
            carry = temp >> 1;
        }

        return reverse(result + carry);
    }

    sum(num1, num2){
        num1 = this.hexToBinary(num1);
        num2 = this.hexToBinary(num2);
        return this.binaryToHex(this.sumBin(num1, num2));
    }

    compareBin(num1, num2){
        let maxlength = Math.max(num1.length, num2.length);

        if(num1.length < num2.length)
            num1 = this.addZero(num1, num2);
        else
            num2 = this.addZero(num2, num1);

        for(let i = 0; i < maxlength; i++){
            if(num1[i] > num2[i])
                return 1;
            else if(num2[i] > num1[i])
                return -1;
        }

        return 0;
    }

    compare(num1, num2) {
        num1 = this.hexToBinary(num1);
        num2 = this.hexToBinary(num2);
        return this.compareBin(num1, num2);
    }

    subBin(num1, num2){
        //if(this.compareBin(num1, num2) === -1) return "Negative Number";
        let borrow = 0;
        let temp;
        let result = "";
        let maxlength = Math.max(num1.length, num2.length);

        if(num1.length < num2.length)
            num1 = this.addZero(num1, num2);
        else
            num2 = this.addZero(num2, num1);

        num1 = reverse(num1);
        num2 = reverse(num2);

        for(let i = 0; i < maxlength; i++){
            temp = (+num1[i]) - (+num2[i]) - borrow;
            if(temp >= 0){
                result += temp;
                borrow = 0;
            }else{
                result += 2 + temp;
                borrow = 1;
            }
        }


        return reverse(result + borrow);
    }

    sub(num1, num2){
        num1 = this.hexToBinary(num1);
        num2 = this.hexToBinary(num2);
        if(this.compareBin(this.hexToBinary(num1), this.hexToBinary(num2)) === -1) return "Negative Number";
        return this.binaryToHex(this.subBin(num1, num2));
    }

    mulBin(num1, num2){
        let result = "0";
        let numMax;
        let numMin;
        if(this.compareBin(num1, num2) === 1){
            numMax = num1;
            numMin = num2;
        }else if(this.compareBin(num1, num2) === -1){
            numMax = num2;
            numMin = num1;
        }else{
            numMax = num1;
            numMin = numMax;
        }

        for(let i = 0; i < numMax.length; i++){
            if(numMin[i] === "1") {
                result = this.sumBin(result, this.shiftDigitsToHigh(numMax, numMin.length - i - 1));
            }
        }

        if(result.length > 2048) {
            result = result.slice(result.length - 2048,);
        }

        return result;
    }

    mul(num1, num2){
        if(num1.length > 512) {
            num1 = num1.slice(num1.length - 512,);
        }
        if(num2.length > 512) {
            num2 = num2.slice(num2.length - 512,);
        }

        num1 = this.hexToBinary(num1);
        num2 = this.hexToBinary(num2);
        return this.binaryToHex(this.mulBin(num1, num2));
    }

    divBin(num1, num2){
        let result = "";
        let r = "";

        for(let i = 0; i < num1.length; i++){
            if(this.compareBin(r, num2) === 1 || this.compareBin(r, num2) === 0)
                break;

            r += num1[i];

            if(this.compareBin(r, num2) === -1){
                result += 0;
            }else{
                r = this.subBin(r, num2);
                result += 1;
            }
        }

        return [result, r];
    }

    div(num1, num2){
        num1 = this.hexToBinary(num1);
        num2 = this.hexToBinary(num2);
        return [this.binaryToHex(this.divBin(num1, num2)[0]), this.binaryToHex(this.divBin(num1, num2)[1])];
    }

    power(num1, num2){
        let result = "1";
        let num2Bin = (this.hexToBinary(num2));
        let lastStep = num2Bin.length - 1;

        for(let i = 0; i < num2Bin.length; i++){
            if(num2Bin[i] === "1") {
                result = this.mul(result, num1);
            }
            if(i !== lastStep){
                result = this.mul(result, result);
            }
        }

        return result;
    }

}


module.exports = bigInt;