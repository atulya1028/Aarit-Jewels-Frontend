import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { changePassword } from "../slices/authSlice";
import toast from "react-hot-toast";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Current password is required"),
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm your new password"),
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
          <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
          <p className="text-gray-600 text-sm mt-2 mb-6">
            Keep your account secure by updating your password regularly
          </p>
        </div>

        {/* Form */}
        <Formik
          initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            dispatch(
              changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
              })
            )
              .unwrap()
              .then(() => {
                toast.success("Password changed successfully");
                resetForm();
              })
              .catch((error) => {
                toast.error(error || "Password change failed");
              })
              .finally(() => {
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Old Password */}
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <Field
                  name="oldPassword"
                  type="password"
                  placeholder="Enter your current password"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="oldPassword"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <Field
                  name="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <ErrorMessage
                  name="newPassword"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 6 characters long.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your new password"
                  className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                {isSubmitting ? "Changing..." : "Change Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangePassword;
