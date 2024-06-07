import React, { useState } from "react";
import Modal from "react-modal";
import {
  FaUtensils,
  FaFilm,
  FaPlane,
  FaShoppingCart,
  FaShoppingBasket,
  FaEllipsisH,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import "./ExpenseTable.css";

Modal.setAppElement("#root");

const icons = {
  Food: <FaUtensils />,
  Entertainment: <FaFilm />,
  Travel: <FaPlane />,
  Shopping: <FaShoppingCart />,
  Grocery: <FaShoppingBasket />,
  Others: <FaEllipsisH />,
};

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
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: "10px",
    border: "border: 1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: " 0 8px 12px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
  },
};

const TableWithPagination = ({
  expenseData: data,
  handleExpenseListUpdate,
  categories,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currExpense, setCurrExpense] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handleInputChange = (e, isExpense = true) => {
    const { name, value } = e.target;
    setCurrExpense((prevState) => ({ ...prevState, [name]: value }));
  };

  const getPageNumbers = () => {
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + 2, pageCount);
    if (currentPage > pageCount - 2) {
      start = Math.max(pageCount - 2, 1);
      end = pageCount;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, pageCount));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryIcon = (category) => {
    return icons[category] || <FaEllipsisH />;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openModal = (expense) => {
    setIsModalOpen(true);
    setCurrExpense(expense);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrExpense({
      title: "",
      price: "",
      category: "",
      date: "",
    }); // Reset editing expense
  };

  const handleEdit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    const updatedExpenses = data.filter((expense) => expense.id !== id);
    handleExpenseListUpdate(updatedExpenses);
  };

  const editExpense = (e) => {
    e.preventDefault();

    // Find the index of the expense you're updating
    const expenseIndex = data.findIndex(
      (expense) => expense.id === currExpense.id
    );

    // Make a copy of the current expenses array
    const updatedExpenses = [...data];

    // Update the expense at the found index with the new details
    if (expenseIndex !== -1) {
      updatedExpenses[expenseIndex] = {
        ...updatedExpenses[expenseIndex],
        ...currExpense,
      };

      // Update the expenses list with the edited expense
      handleExpenseListUpdate(updatedExpenses);
      setIsModalOpen(false);
    } else {
      console.log("Expense not found");
    }
  };

  return (
    <>
      <div className="expense-container">
        <h2 className="Recent-top-expenses-header">Recent Transactions & Top Expenses</h2>
        <br />
        <div className="expense-table-container">
          {currentItems.map((item, index) => (
            <div className="expense-row" key={index}>
              <div className="expense-row-icon-title">
                <div className="expense-icon">
                  {React.cloneElement(getCategoryIcon(item.category), {
                    className: "expense-category-icon",
                  })}
                </div>
                <div className="expense-title-date">
                  <div className="expense-title">{item.title}</div>
                  <div className="expense-date">{formatDate(item.date)}</div>
                </div>
              </div>
              <div className="expense-price-edit-delete-container">
                <div className="expense-price">
                  ₹{parseInt(item.price, 10).toLocaleString()}
                </div>
                <button
                  className="action-btn edit-btn"
                  onClick={() => openModal(item)}
                >
                  <FaEdit />
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              &laquo;
            </button>
            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
            <button onClick={nextPage} disabled={currentPage === pageCount}>
              &raquo;
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={modalStyle}
        contentLabel="Edit Expense"
      >
        <h2 className="modal-header">Edit Expense</h2>
        <form className="modal-form-expense" onSubmit={editExpense}>
          <input
            name="title"
            placeholder="Title"
            value={currExpense.title}
            onChange={handleInputChange}
            requireds
          />

          <input
            name="price"
            placeholder="Price"
            type="number"
            value={currExpense.price}
            onChange={handleInputChange}
            required
          />
          <select
            className="select-option"
            name="category"
            value={currExpense.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>{" "}
            {/* Default empty option */}
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            name="date"
            placeholder="Date"
            type="date"
            value={currExpense.date}
            onChange={handleInputChange}
            required
          />
          <div>
            <button className="glassmorphismButtonAdd" type="submit">
              Save
            </button>
            <button
              className="glassmorphismButton"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default TableWithPagination;
