function calculate() {

  
    let num1 = Number(document.getElementById("n1").value);
    let num2 = Number(document.getElementById("n2").value);

    let operation = document.getElementById("operation").value;

    let result;

   

    // Perform selected operation
    if (operation === "add") {
        result = num1 + num2;
    }
    else if (operation === "sub") {
        result = num1 - num2;
    }
    else if (operation === "mul") {
        result = num1 * num2;
    }
    else if (operation === "div") {
        result = num1 / num2;
    }

    document.getElementById("result").innerHTML =
        "Result: " + result;
}