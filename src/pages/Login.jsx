import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../slices/authSlice';
import toast from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100 text-center">
        
        {/* Title */}
        <div className="mb-6">
          <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-purple-100 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 11c0-1.657 1.567-3 3.5-3S19 9.343 19 11c0 3.5-7 7-7 7s-7-3.5-7-7c0-1.657 1.567-3 3.5-3S12 9.343 12 11z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Login to Aarit Jewels</h2>
          <p className="text-gray-600 text-sm mt-2">
            Unlock exclusive offers & manage your account
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(loginUser(values))
              .unwrap()
              .then(() => {
                toast.success('Login successful');
                navigate('/');
              })
              .catch((error) => {
                toast.error(error || 'Login failed');
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Email */}
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter Mobile Number or Email"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1 text-left"
                />
              </div>

              {/* Password */}
              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1 text-left"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Continue to Login'}
              </button>
            </Form>
          )}
        </Formik>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <Link
            to="/forgot-password"
            className="text-purple-600 hover:underline"
          >
            Forgot Password?
          </Link>
          <p className="mt-4">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="text-purple-600 font-semibold hover:underline"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
