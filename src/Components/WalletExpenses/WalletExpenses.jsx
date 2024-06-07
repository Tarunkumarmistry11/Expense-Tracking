import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./WalletExpenses.css";
import PieChart from "../PieChart/pieChart";
import { v4 as uuidv4 } from "uuid";

// Ensure the modal is bound to your appElement for accessibility reasons
Modal.setAppElement("#root");

const WalletExpensesComponent = ({
  handleExpenseListUpdate,
  categories,
  expenses,
  setExpenses,
  getTotalExpenses,
  walletBalance,
  setWalletBalance,
}) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    id: null,
    title: "",
    price: "",
    category: "",
    date: "",
  });
  const [newIncome, setNewIncome] = useState("");

  const handleInputChange = (e, isExpense = true) => {
    const { name, value } = e.target;
    if (isExpense) {
      setNewExpense((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setNewIncome(value);
    }
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (walletBalance < newExpense.price) {
      return alert("Couldn't add expense, insufficient wallet balance.");
    }
    newExpense.id = uuidv4();

    const updatedBalance = walletBalance - newExpense.price;
    setWalletBalance(updatedBalance);
    localStorage.setItem("walletBalance", JSON.stringify(updatedBalance));
    localStorage.setItem("expenses", JSON.stringify([...expenses, newExpense]));

    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    setIsExpenseModalOpen(false);
    setNewExpense({
      id: null,
      title: "",
      price: "",
      category: "",
      date: "",
    }); // Reset form
  };

  const addIncome = (e) => {
    e.preventDefault();
    if (!isNaN(newIncome) && newIncome.trim() !== "") {
      setWalletBalance((prevBalance) => prevBalance + parseInt(newIncome, 10));
      localStorage.setItem(
        "totalBalance",
        JSON.stringify(walletBalance + parseInt(newIncome, 10))
      );
      setIsIncomeModalOpen(false);
      setNewIncome(""); // Reset form
    }
  };

  useEffect(() => {
    handleExpenseListUpdate(expenses);
  }, [expenses]);

  //By default add totalBalance as 5000
  useEffect(() => {
    if (!localStorage.getItem("totalBalance"))
      localStorage.setItem("totalBalance", JSON.stringify(5000));
  }, []);

  const modalStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "80%",
      maxWidth: "500px",
      background: "#eeeeee",
      borderRadius: "10px",
      border: "border: 1px solid rgba(255, 255, 255, 0.18)",
      boxShadow: " 0 8px 12px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(2px)",
    },
  };

  return (
    <div className="wallet-container glassmorphism">
      <div className="wallet-income-expense-container">
        <div className="wallet-card-container glassmorphism">
          <h2>
            Wallet Balance:{" "}
            <span className="income-amount"> ₹{walletBalance} </span>
          </h2>
          <button
            className="wallet-button"
            onClick={() => setIsIncomeModalOpen(true)}
          >
            + Add Income
          </button>
        </div>
        <div className="wallet-card-container glassmorphism">
          <h2>
            Expenses:
            <span className="expense-amount"> ₹{getTotalExpenses()} </span>
          </h2>
          <button
            className="expense-button"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            + Add Expense
          </button>
        </div>
      </div>
      <PieChart data={expenses} />

      {/* Modal for adding income */}
      <Modal
        isOpen={isIncomeModalOpen}
        onRequestClose={() => setIsIncomeModalOpen(false)}
        style={modalStyle}
        contentLabel="Add New Income"
      >
        <h2 className="modal-header">Add New Income</h2>
        <form className="modal-form-income" onSubmit={addIncome}>
          <input
            className="glassmorphismButton"
            name="income"
            placeholder="Income amount"
            type="number"
            value={newIncome}
            onChange={(e) => handleInputChange(e, false)}
            required
          />
          <div>
            <button className="glassmorphismButtonAdd" type="submit">
              Add Income
            </button>
            <button
              className="glassmorphismButton"
              type="button"
              onClick={() => setIsIncomeModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal for adding expenses */}
      <Modal
        isOpen={isExpenseModalOpen}
        onRequestClose={() => setIsExpenseModalOpen(false)}
        style={modalStyle}
        contentLabel="Add New Expense"
      >
        <h2 className="modal-header">Add New Expense</h2>
        <form className="modal-form-expense" onSubmit={addExpense}>
          <input
            className="glassmorphismButton"
            name="title"
            placeholder="Expense title"
            type="text"
            value={newExpense.title}
            onChange={handleInputChange}
            required
          />
          <input
            className="glassmorphismButton"
            name="price"
            placeholder="Expense amount"
            type="number"
            value={newExpense.price}
            onChange={handleInputChange}
            required
          />
          <select
            className="glassmorphismButton"
            name="category"
            value={newExpense.category}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            className="glassmorphismButton"
            name="date"
            type="date"
            value={newExpense.date}
            onChange={handleInputChange}
            required
          />
          <div>
            <button className="glassmorphismButtonAdd" type="submit">
              Add Expense
            </button>
            <button
              className="glassmorphismButton"
              type="button"
              onClick={() => setIsExpenseModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WalletExpensesComponent;
