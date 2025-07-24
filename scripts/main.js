document.addEventListener("DOMContentLoaded", () => {
  const balance = document.getElementById("balance");
  const income = document.getElementById("income");
  const expense = document.getElementById("expense");
  const list = document.getElementById("list");
  const form = document.getElementById("form");
  const text = document.getElementById("text");
  const amount = document.getElementById("amount");

  const history = [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const transactionName = text.value.trim();
    const transactionAmount = parseFloat(amount.value.trim());

    if (transactionName && transactionAmount) {
      const newTransaction = createNewTransaction(transactionName, transactionAmount);
      // Add a new transaction
      history.push(newTransaction);
      // Display a new transaction
      const listItem = document.createElement("li");
      listItem.className = newTransaction.type === "income" ? "plus" : "minus"
      listItem.innerHTML = `${newTransaction.name} <span>${displayTransaction(newTransaction.amount)}</span> <button class="delete-btn">x</button>`
      list.appendChild(listItem);
      // Calculate income/expense
      const totalIncome = calculateTotal("income");
      const totalExpense = calculateTotal("expense");
      // Display total income/expense
      income.textContent = displayTransaction(totalIncome)
      expense.textContent = displayTransaction(totalExpense)
      // Display total balance
      let totalBalance = parseFloat((totalIncome + totalExpense).toFixed(2));
      balance.textContent = displayTotalTransactions(totalBalance)
    }
  })

  function createNewTransaction(name, amount) {
    return {
      name: name,
      amount: parseFloat(amount.toFixed(2)),
      type: amount >= 0 ? "income" : "expense"
    }
  }

  function calculateTotal(type) {
    return parseFloat(history
      .filter(item => item.type === type)
      .reduce((acc, item) => acc += item.amount, 0)
      .toFixed(2))
  }

  function displayTotalTransactions(amount) {
    return amount >= 0 ? `$${amount}` : `-$${amount * -1}`
  }

  function displayTransaction(amount) {
    return amount >= 0 ? `+$${amount}` : `-$${amount * -1}`
  }
})