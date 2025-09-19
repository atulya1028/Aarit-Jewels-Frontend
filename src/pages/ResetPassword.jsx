import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../slices/authSlice';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
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
                d="M12 11c0-1.657 1.567-3 3.5-3S19 9.343 19 11c0 3.5-7 7-7 7s-7-3.5-7-7c0-1.657 1.567-3 3.5-3S12 9.343 12 11z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-600 text-sm mt-2 mb-6">
            Enter your new password to secure your account
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            dispatch(resetPassword({ token, password: values.password }))
              .unwrap()
              .then(() => {
                toast.success('Password reset successfully! Please login.');
                resetForm();
                navigate('/login');
              })
              .catch((err) => {
                toast.error(err || 'Password reset failed');
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* New Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter your new password"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your new password"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  disabled={isSubmitting}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-indigo-600 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
