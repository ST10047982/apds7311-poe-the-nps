import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Dynamic validation schema using Yup
const validationSchema = (userType) => Yup.object({
  username: Yup.string().required('Username is required'),
  accountNumber: userType === 'Client' 
    ? Yup.string().required('Account Number is required')
    : Yup.string(),
  password: Yup.string().required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('Client');

  const handleBackClick = () => {
    navigate('/');
  };

  const handleForgotPasswordClick = () => {
    navigate('/forget-password');
  };

  const handleLoginClick = async (values, { setSubmitting, setErrors, resetForm }) => {
    console.log("Login attempt with values:", values);

    try {
      let apiPath;
      if (userType === 'Client') {
        apiPath = 'https://localhost:5000/api/auth/login/user';
      } else if (userType === 'Staff') {
        apiPath = 'https://localhost:5000/api/auth/login/staff';
      } else if (userType === 'Admin') {
        apiPath = 'https://localhost:5000/api/auth/login/admin';
      }

      const response = await axios.post(apiPath, {
        username: values.username,
        password: values.password,
        accountNumber: userType === 'Client' ? values.accountNumber : undefined,
      });

      console.log("Response data:", response.data);

      localStorage.setItem('token', response.data.token);

      // Redirect based on userType
      if (userType === 'Client') {
        navigate('/payments');
      } else if (userType === 'Staff') {
        navigate('/payment');
      } else if (userType === 'Admin') {
        navigate('/admin');
      }

      // Clear the form fields after successful login
      resetForm();
      
    } catch (err) {
      console.error("Login error:", err);

      if (err.response) {
        if (err.response.status === 403) {
          setErrors({ serverError: 'Your account is not approved by the admin yet.' });
        } else {
          setErrors({ serverError: err.response.data.message || 'Invalid login details.' });
        }
      } else {
        setErrors({ serverError: 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Login</h1>
          <p className="login-description">Please enter your login details below.</p>

          <Formik
            initialValues={{ username: '', accountNumber: '', password: '' }}
            validationSchema={validationSchema(userType)}
            onSubmit={handleLoginClick}
          >
            {({ isSubmitting, errors }) => (
              <Form>
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

                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="input-field"
                  />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>

                <button
                  type="button"
                  className="forgot-password-button"
                  onClick={handleForgotPasswordClick}
                >
                  Forgot Password?
                </button>

                {errors.serverError && <p className="error-message server-error">{errors.serverError}</p>}

                <div className="button-group">
                  <button type="submit" className="login-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                  <button type="button" className="back-button" onClick={handleBackClick}>
                    Back to Welcome
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

export default Login;
