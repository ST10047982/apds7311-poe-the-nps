import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgetPassword.css';  // Ensure you have this CSS file
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Dynamic validation schema using Yup
const validationSchema = (userType) => Yup.object({
  username: Yup.string().required('Username is required'),
  accountNumber: userType === 'Client' 
    ? Yup.string().required('Account Number is required')
    : Yup.string(),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Za-z]/, 'Password must contain at least one letter')
    .matches(/\d/, 'Password must contain at least one number'),
});

function ForgetPassword() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('Client'); // State for userType selection

  // Handle the back button click
  const handleBackClick = () => {
    navigate('/login');
  };

  // Handle the password reset request
  const handleForgotPasswordClick = async (values, { setSubmitting, setErrors }) => {
    console.log("Password reset attempt with values:", values);

    try {
      let apiPath;
      if (userType === 'Client') {
        apiPath = 'https://localhost:5000/api/auth/user/forget-password';
      } else if (userType === 'Staff') {
        apiPath = 'https://localhost:5000/api/auth/staff/forget-password';
      } else if (userType === 'Admin') {
        apiPath = 'https://localhost:5000/api/auth/admin/forget-password';
      }

      const response = await axios.post(apiPath, {
        username: values.username,
        newPassword: values.newPassword,
        accountNumber: userType === 'Client' ? values.accountNumber : undefined,
      });

      console.log("Response data:", response.data);

      // Show success message and navigate to login page
      alert('Password reset successful.');
      navigate('/login');
    } catch (err) {
      console.error("Password reset error:", err);

      // Handle error response from server
      if (err.response) {
        setErrors({ serverError: err.response.data.message || 'Error occurred during password reset.' });
      } else {
        setErrors({ serverError: 'Something went wrong. Please try again later.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="forget-password-container">
        <div className="forget-password-box">
          <h1 className="forget-password-title">Forgot Password</h1>
          <p className="forget-password-description">
            Please enter your username and new password to reset your password.
          </p>

          <Formik
            initialValues={{ username: '', accountNumber: '', newPassword: '' }}
            validationSchema={validationSchema(userType)}
            onSubmit={handleForgotPasswordClick}
          >
            {({ isSubmitting, errors }) => (
              <Form>
                {/* User Type Dropdown */}
                <div className="form-group">
                  <label htmlFor="userType">User Type:</label>
                  <Field
                    as="select"
                    id="userType"
                    name="userType"
                    className="input-field"
                    onChange={(e) => setUserType(e.target.value)}
                    value={userType}
                  >
                    <option value="Client">Client</option>
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </Field>
                </div>

                {/* Username Input Field */}
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    className="input-field"
                  />
                  <ErrorMessage name="username" component="div" className="error-message" />
                </div>

                {/* Account Number Input Field for Clients */}
                {userType === 'Client' && (
                  <div className="form-group">
                    <label htmlFor="accountNumber">Account Number:</label>
                    <Field
                      type="text"
                      id="accountNumber"
                      name="accountNumber"
                      placeholder="Enter your account number"
                      className="input-field"
                    />
                    <ErrorMessage name="accountNumber" component="div" className="error-message" />
                  </div>
                )}

                {/* New Password Input Field */}
                <div className="form-group">
                  <label htmlFor="newPassword">New Password:</label>
                  <Field
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter your new password"
                    className="input-field"
                  />
                  <ErrorMessage name="newPassword" component="div" className="error-message" />
                </div>

                {/* Display server error if present */}
                {errors.serverError && (
                  <p className="error-message server-error">{errors.serverError}</p>
                )}

                {/* Submit and Back Buttons */}
                <div className="button-group">
                  <button
                    type="submit"
                    className="reset-password-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Reset Password'}
                  </button>
                  <button type="button" className="back-button" onClick={handleBackClick}>
                    Back to Login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;

// the code was taken and apadted from React and Hooks
// https://reactjs.org/docs/hooks-state.html