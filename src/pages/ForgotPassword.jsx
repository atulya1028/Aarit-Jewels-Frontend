import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../slices/authSlice';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-indigo-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-indigo-100">
        {/* Title */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16.5 9.5V7a4.5 4.5 0 00-9 0v2.5M5 9.5h14v11H5v-11z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="text-gray-600 text-sm mt-2 mb-6">
            Enter your registered email to receive a reset link
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            dispatch(forgotPassword(values.email))
              .unwrap()
              .then(() => {
                toast.success('Reset link sent! Check your email.');
                resetForm();
              })
              .catch((error) => {
                toast.error(error?.message || 'Failed to send reset link');
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-600 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;
