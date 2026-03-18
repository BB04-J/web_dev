class Calculator {
    constructor() {
        this.result = 0;
    }

    add(num) {
        this.result += num;
    }

    subtract(num) {
        this.result -= num;
    }

    multiply(num) {
        this.result *= num;
    }

    divide(num) {
        if (num === 0) throw new Error("Division by zero");
        this.result /= num;
    }

    clear() {
        this.result = 0;
    }

    getresult() {
        return this.result;
    }

    calculate(expression) {

        expression = expression.replace(/\s+/g, "");

        if (!/^[0-9*+().\-\/]+$/.test(expression)) {
            throw new Error("Invalid Syntax");
        }

        const num = [];
        const operators = [];

        const precedence = (op) => {
            if (op === "+" || op === "-") return 1;
            if (op === "*" || op === "/") return 2;
            return 0;
        };

        const applyOperation = () => {
            const b = num.pop();
            const a = num.pop();
            const op = operators.pop();

            this.result = a;

            if (op === "+") this.add(b);
            if (op === "-") this.subtract(b);
            if (op === "*") this.multiply(b);
            if (op === "/") this.divide(b);

            num.push(this.result);
        };

        let i = 0;

        while (i < expression.length) {

            
            if (/\d/.test(expression[i])) {

                let n = "";

                while (
                    i < expression.length &&
                    (/\d/.test(expression[i]) || expression[i] === ".")
                ) {
                    n += expression[i];
                    i++;
                }

                num.push(Number(n));
                continue;
            }

           
            if (expression[i] === "(") {
                operators.push("(");
            }

            else if (expression[i] === ")") {

                while (
                    operators.length > 0 &&
                    operators[operators.length - 1] !== "("
                ) {
                    applyOperation();
                }

                if (!operators.length) {
                    throw new Error("Mismatched brackets");
                }

                operators.pop(); 
            }

           
            else {

                while (
                    operators.length > 0 &&
                    operators[operators.length - 1] !== "(" &&
                    precedence(operators[operators.length - 1]) >= precedence(expression[i])
                ) {
                    applyOperation();
                }

                operators.push(expression[i]);
            }

            i++;
        }

        
        while (operators.length > 0) {

            if (operators[operators.length - 1] === "(") {
                throw new Error("Mismatched brackets");
            }

            applyOperation();
        }

        if (num.length !== 1) {
            throw new Error("Invalid Expression");
        }

        this.result = num.pop();
        return this.result;
    }
}

const calc = new Calculator();
console.log(calc.calculate("100+200*3-(50/5)+7*(8-3)"));  