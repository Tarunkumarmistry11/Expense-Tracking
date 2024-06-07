import React, { useState } from "react";
import WalletExpensesComponent from "../WalletExpenses/WalletExpenses";
import ExpensesTable from "../ExpenseTable/ExpenseTable";
import "./Dashboard.css";
import TopExpenses from "../TopExpenses/TopExpenses";

function Dashboard() {
  const [walletBalance, setWalletBalance] = useState(
    localStorage.getItem("walletBalance")
      ? JSON.parse(localStorage.getItem("walletBalance"))
      : 5000
  );

  const [expenses, setExpenses] = useState(
    localStorage.getItem("expenses")?.length > 0
      ? JSON.parse(localStorage.getItem("expenses"))
      : []
  );
  const handleExpenseListUpdate = (expenses) => {
    setExpenses(expenses);
    const totalBalance =
      localStorage.getItem("totalBalance") - getTotalExpenses();

    setWalletBalance(totalBalance);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  };

  const getTotalExpenses = () => {
    return expenses.reduce(
      (total, expense) => total + parseInt(expense.price, 10),
      0
    );
  };

  const categories = [
    "Food",
    "Entertainment",
    "Travel",
    "Shopping",
    "Grocery",
    "Others",
  ];

  return (
    <div className="dashboard-container">
      <h1 className="Main-head">Expense Tracker</h1>
      <WalletExpensesComponent
        handleExpenseListUpdate={handleExpenseListUpdate}
        categories={categories}
        expenses={expenses}
        setExpenses={setExpenses}
        getTotalExpenses={getTotalExpenses}
        walletBalance={walletBalance}
        setWalletBalance={setWalletBalance}
      />
      {expenses.length > 0 && (
        <div className="dashboard-info-container">
          <ExpensesTable
            expenseData={expenses}
            handleExpenseListUpdate={handleExpenseListUpdate}
            categories={categories}
          />
          <TopExpenses data={expenses} categories={categories} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
