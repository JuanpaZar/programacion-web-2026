/* IMC */

function calcularIMC(peso, altura) {
    return peso / (altura * altura);
}
function clasificarIMC(imc) {
    if (imc < 18.5) {
        return "Bajo peso";
    } else if (imc < 25) {
        return "Normal";
    } else if (imc < 30) {
        return "Sobrepeso";
    } else {
        return "Obesidad";
    }
}

 let peso = Number(prompt("Ingresa tu peso en kg:"));
let altura = Number(prompt("Ingresa tu altura en metros:"));
if (peso > 0 && altura > 0) {
    let imc = calcularIMC(peso, altura);

    console.log("Tu IMC es: " + imc.toFixed(2));
    console.log("Clasificacion: " + clasificarIMC(imc));
} else {
    console.log("Error: el peso y la altura deben ser mayores que 0");
}


/*FizzBuzz */

function fizzBuzz(n) {
    if (n <= 0 || n % 1 !== 0) {
         console.log("Error: ingresa un numero entero mayor que 0");
    } else {
        for (let i = 1; i <= n; i++) {
            if (i % 3 === 0 && i % 5 === 0) {
                console.log("FizzBuzz");
            } else if (i % 3 === 0) {
                 console.log("Fizz");
            } else if (i % 5 === 0) {
                console.log("Buzz");
            } else {
                console.log(i);
            }
        }
    }
}

let  numero = Number(prompt("Ingresa un numero para FizzBuzz:"));
fizzBuzz(numero);




