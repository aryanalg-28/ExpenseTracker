
// Get HTML Elements
const form = document.getElementById("transaction-form");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");

const transactionList = document.getElementById("transaction-list");

// Load saved transactions
let transactions = [];

try {
    transactions = JSON.parse(
        localStorage.getItem("transactions")
    ) || [];

    if (!Array.isArray(transactions)) {
        transactions = [];
    }
} catch {
    transactions = [];
}

// Set today's date automatically
dateInput.value = new Date().toISOString().split("T")[0];

// Save transactions
function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

// Format currency
function formatMoney(amount) {
    return "₹" + amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Add new transaction
form.addEventListener("submit", function(event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid name and amount.");
        return;
    }

    const transaction = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        description: description,
        amount: amount,
        type: typeInput.value,
        category: categoryInput.value,
        date: dateInput.value
    };

    transactions.push(transaction);

    saveTransactions();
    updateDashboard();

    form.reset();
    dateInput.value = new Date().toISOString().split("T")[0];
});

// Update Dashboard
function updateDashboard() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }

    });

    const balance = totalIncome - totalExpense;

    balanceDisplay.textContent = formatMoney(balance);
    incomeDisplay.textContent = formatMoney(totalIncome);
    expenseDisplay.textContent = formatMoney(totalExpense);

    displayTransactions();
}

// Display Transactions
function displayTransactions() {

    transactionList.replaceChildren();

    if (transactions.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No transactions yet.";
        transactionList.appendChild(message);
        return;
    }

    // Show latest transaction first
    const sortedTransactions = [...transactions].reverse();

    sortedTransactions.forEach(function(transaction) {

        const item = document.createElement("div");
        item.className = "transaction";

        const info = document.createElement("div");
        info.className = "transaction-info";

        const title = document.createElement("h4");
        title.textContent = transaction.description;

        const details = document.createElement("p");
        details.textContent =
            transaction.category + " | " + transaction.date;

        info.appendChild(title);
        info.appendChild(details);

        const right = document.createElement("div");
        right.className = "transaction-right";

        const amount = document.createElement("span");
        amount.className = "transaction-amount";

        if (transaction.type === "income") {
            amount.classList.add("positive");
            amount.textContent = "+ " + formatMoney(transaction.amount);
        } else {
            amount.classList.add("negative");
            amount.textContent = "- " + formatMoney(transaction.amount);
        }

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteTransaction(transaction.id);
        });

        right.appendChild(amount);
        right.appendChild(deleteButton);

        item.appendChild(info);
        item.appendChild(right);

        transactionList.appendChild(item);

    });
}

// Delete Transaction
function deleteTransaction(id) {

    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });

    saveTransactions();
    updateDashboard();
}

// Initial Dashboard Update
updateDashboard();
