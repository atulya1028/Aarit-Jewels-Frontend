import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../slices/authSlice';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { token } = useParams();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Reset Password</h2>
      <Formik
        initialValues={{ password: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          dispatch(resetPassword({ token, password: values.password })).unwrap().then(() => navigate('/login'));
        }}
      >
        <Form className="space-y-4">
          <div>
            <label htmlFor="password" className="block">New Password</label>
            <Field name="password" type="password" className="border p-2 w-full" />
            <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
          </div>
          <button type="submit" className="bg-blue-600 text-white p-2 w-full">
            Reset
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default ResetPassword;