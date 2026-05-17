let balance = 10000;
const correctPin = "1234";

function updateBalance() {
    document.getElementById("balance").innerText =
        "Current Balance: Rs. " + balance;
}

function withdraw() {
    let amount = Number(document.getElementById("amount").value);

    // Check multiple of 100
    if (amount % 100 !== 0) {
        alert("Amount must be multiple of 100");
        return;
    }

    // Check valid amount
    if (amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    // Check sufficient balance
    if (amount > balance) {
        alert("Insufficient balance");
        return;
    }

    let pin = prompt("Enter PIN");

    if (pin === correctPin) {
        balance -= amount;
        updateBalance();
        alert("Withdrawal successful");
    } else {
        alert("Wrong PIN");
    }
}

function deposit() {
    let amount = Number(document.getElementById("amount").value);

    // Check multiple of 100
    if (amount % 100 !== 0) {
        alert("Amount must be multiple of 100");
        return;
    }

    // Check valid amount
    if (amount <= 0) {
        alert("Enter valid amount");
        return;
    }

    let pin = prompt("Enter PIN");

    if (pin === correctPin) {
        balance += amount;
        updateBalance();
        alert("Deposit successful");
    } else {
        alert("Wrong PIN");
    }
}