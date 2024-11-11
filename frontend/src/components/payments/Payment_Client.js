import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment_Client.css'; // Import your CSS file for styling
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  fromAccountNumber: Yup.string().required('From Account is required'),
  toAccountNumber: Yup.string().required('To Account is required'),
  amount: Yup.number().min(1, 'Amount must be at least 1').required('Amount is required'),
  currency: Yup.string()
    .oneOf(['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'ZAR', 'CAD', 'CHF', 'CNY'], 'Invalid currency')
    .required('Currency is required'),
  paymentMethod: Yup.string()
    .oneOf(['Credit Card', 'Debit Card', 'Bank Transfer', 'Paypal'], 'Invalid payment method')
    .required('Payment method is required'),
  swiftCode: Yup.string().required('Swift code is required'),
});
function Payments_Client() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]); // State to store fetched transactions
  const token = localStorage.getItem('token');

  // Fetch transactions for the logged-in user
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('https://localhost:5000/api/my-transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setTransactions(response.data.transactions); // Store transactions in state
      } catch (err) {
        alert('No transactions found.');
      }
    };

    fetchTransactions(); // Call the function to fetch transactions when the component mounts
  }, [token]);

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    const payload = {
      fromAccountNumber: values.fromAccountNumber,
      toAccountNumber: values.toAccountNumber,
      amount: values.amount,
      currency: values.currency,
      swiftCode: values.swiftCode,
      paymentMethod: values.paymentMethod,
    };

    try {
      // Make the POST request to the payment API
      const response = await axios.post('https://localhost:5000/api/create', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Handle response after successful submission
      if (response.status === 201) {
        alert('Payment successful.');

        // After payment, fetch the updated transactions
        const updatedTransactions = await axios.get('https://localhost:5000/api/my-transactions', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Update the state with the new transactions
        setTransactions(updatedTransactions.data.transactions);

        resetForm(); // Reset the form after successful submission
      }
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message); // Show server error message
        setErrors({ serverError: err.response.data.message });
      } else {
        setErrors({ serverError: 'Something went wrong. Please try again.' }); // Show generic error message
      }
    } finally {
      setSubmitting(false); // Stop the form submission state
    }
  };

  const handleCancel = (resetForm) => {
    alert('Transaction canceled.');
    resetForm(); // Reset the form on cancel
  };

  return (
    <div className="payments-container">
      <div className="payments-box">
        <h1 className="payments-title">Payments</h1>
        <p>Here is where you can make your transactions and see a list of all your past transactions.</p>

        <Formik
          initialValues={{
            fromAccountNumber: '',
            toAccountNumber: '',
            amount: '',
            currency: '',
            paymentMethod: '',
            swiftCode: ''
          }} // Initial form values
          validationSchema={validationSchema} // Validation schema for form fields
          onSubmit={handleSubmit} // Form submission handler
        >
          {({ isSubmitting, errors, resetForm }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="fromAccountNumber">From Account:</label>
                <Field type="text" id="fromAccountNumber" name="fromAccountNumber" placeholder="Enter from account" className="input-field" />
                <ErrorMessage name="fromAccountNumber" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="toAccountNumber">To Account:</label>
                <Field type="text" id="toAccountNumber" name="toAccountNumber" placeholder="Enter to account" className="input-field" />
                <ErrorMessage name="toAccountNumber" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <Field type="number" id="amount" name="amount" placeholder="Enter amount" className="input-field" />
                <ErrorMessage name="amount" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="currency">Currency:</label>
                <Field as="select" id="currency" name="currency" className="input-field">
                  <option value="">Select currency</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                  <option value="ZAR">ZAR</option>
                  <option value="CAD">CAD</option>
                  <option value="CHF">CHF</option>
                  <option value="CNY">CNY</option>
                </Field>
                <ErrorMessage name="currency" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method:</label>
                <Field as="select" id="paymentMethod" name="paymentMethod" className="input-field">
                  <option value="">Select payment method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Paypal">Paypal</option>
                </Field>
                <ErrorMessage name="paymentMethod" component="div" className="error-message" />
              </div>

              <div className="form-group">
                <label htmlFor="swiftCode">Swift Code:</label>
                <Field as="select" id="swiftCode" name="swiftCode" className="input-field">
                  <option value="">Select Swift Code</option>
                  <option value="ABSAZAJJ">Absa Bank - ABSAZAJJ</option>
                  <option value="SBZAZAJJ">Standard Bank - SBZAZAJJ</option>
                  <option value="FIRNZAJJ">First National Bank (FNB) - FIRNZAJJ</option>
                  <option value="NEDSZAJJ">Nedbank - NEDSZAJJ</option>
                  <option value="CABLZAJJ">Capitec Bank - CABLZAJJ</option>
                  <option value="INVZZAJJ">Investec Bank - INVZZAJJ</option>
                  <option value="AFSIZAJJ">African Bank - AFSIZAJJ</option>
                  <option value="HSBCZAJJ">HSBC Bank - HSBCZAJJ</option>
                  <option value="RMBKZAJJ">Rand Merchant Bank - RMBKZAJJ</option>
                </Field>
                <ErrorMessage name="swiftCode" component="div" className="error-message" />
              </div>

              {errors.serverError && <p className="error-message">{errors.serverError}</p>}

              <div className="button-group">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Make Payment'}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => handleCancel(resetForm)}
                  disabled={isSubmitting}
                >
                  Cancel Payment
                </button>

                <button className="button logout" onClick={() => navigate('/')}>
                  Logout
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Transactions Table */}
        <div className="transactions-container">
      <h2>Your Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>From Account</th>
            <th>To Account</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Payment Method</th>
            <th>Swift Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction._id}>  {/* Use a unique identifier from the transaction */}
                <td>{transaction.fromAccount?.accountNumber}</td>
                <td>{transaction.toAccount?.accountNumber}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.currency}</td>
                <td>{transaction.paymentMethod}</td>
                <td>{transaction.swiftCode}</td>
                <td>{transaction.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No transactions available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
      </div>
    </div>
  );
}

export default Payments_Client;


/* This code was adapted from various tutorials on React, Formik, and Yup for form handling and validation */
// This method was adapted from the Express documentation on routing and various tutorials on transaction management
// https://expressjs.com/en/guide/routing.html
// Express Documentation
// https://expressjs.com/