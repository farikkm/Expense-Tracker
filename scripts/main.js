document.addEventListener("DOMContentLoaded", () => {
  const balance = document.getElementById("balance");
  const income = document.getElementById("income");
  const expense = document.getElementById("expense");
  const list = document.getElementById("list");
  const form = document.getElementById("form");
  const text = document.getElementById("text");
  const amount = document.getElementById("amount");

  let history = JSON.parse(localStorage.getItem("transactions")) || [];
  if (history.length > 0) updateDisplay();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const transactionName = text.value.trim();
    const transactionAmount = parseFloat(amount.value.trim());

    if (!transactionName || !transactionAmount) return;

    const newTransaction = createNewTransaction(transactionName, transactionAmount);
    history.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(history));
    updateDisplay();
    clearInputs();
  })

  list.addEventListener("click", (e) => {
    const elem = e.target;
    if (elem.classList.contains("delete-btn")) {
      const transactionId = elem.getAttribute("data-id");
      history = history.filter(item => item.id !== parseInt(transactionId));
      localStorage.setItem("transactions", JSON.stringify(history));
      updateDisplay();
    }
  })

  function createNewTransaction(name, amount) {
    return {
      id: Date.now(),
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

  function displayTransaction(amount) {
    return amount >= 0 ? `$${amount}` : `-$${amount * -1}`
  }

  function updateDisplay() {
    // Calculate income/expense
    const totalIncome = calculateTotal("income");
    const totalExpense = calculateTotal("expense");
    // Display total income/expense
    income.textContent = `+${displayTransaction(totalIncome)}`
    expense.textContent = displayTransaction(totalExpense)
    // Display total balance
    let totalBalance = parseFloat((totalIncome + totalExpense).toFixed(2));
    balance.textContent = displayTransaction(totalBalance)
    // Display List
    list.innerText = "";
    for (const transaction of history) {
      const listItem = document.createElement("li");
      const listItemClass = transaction.type === "income" ? "plus" : "minus"
      const listItemTransaction = transaction.type === "income"
        ? `+${displayTransaction(transaction.amount)}` 
        : `${displayTransaction(transaction.amount)}`;

      listItem.className = listItemClass;
      listItem.innerHTML = `
        ${transaction.name} 
        <span>${listItemTransaction}</span> 
        <button data-id="${transaction.id}" class="delete-btn">x</button>
      `
      list.appendChild(listItem);
    }
  }

  function clearInputs() {
    text.value = "";
    amount.value = ""
  }
})