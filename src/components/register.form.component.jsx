import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { setUserToState } from "../store/user.slice";

const api = axios.create({
  baseURL: "http://localhost:4000/",
  headers: {
    "Content-Type": "application/json",
  },
});

const passwordRegex = /^(?=.*[A-Z])(?=.*[\W]).{8,}$/;

const registerValidation = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Your name is too short"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(passwordRegex, "Your password does not meet the requirements")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password is required"),
});

const initialValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  const handleRegister = async (values) => {
    try {
      const response = await api.post("/api/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      console.log(response.data);
      dispatch(setUserToState(response.data.user, response.data.token));
    } catch (error) {
      console.log(error);
      return;
    }
    if (error.response.status === 404) {
      setError(error.response.data.message);
      return;
    }
    if (error.response.status === 400) {
      setError(error.response.data.message);
      return;
    }
  };
  return (
    <div>
      <h3>Register to continue</h3>
      {error && <div>{error}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={registerValidation}
        onSubmit={async (values) => {
          await handleRegister(values);
        }}
      >
        <Form>
          <div>
            <label htmlFor="name">Name</label>
            <Field type="text" name="name" id="name" />
            <ErrorMessage name="name" component="div" />
          </div>
          <div className="">
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" id="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div className="">
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" id="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <div className="">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field
              type="password"
              name="confirmPassword"
              id="confirmPassword"
            />
            <ErrorMessage name="confirmPassword" component="div" />
          </div>
          <button type="submit">Register</button>
        </Form>
      </Formik>
      <a href="/login">
        <button>Go to Login Page</button>
      </a>
    </div>
  );
};
export default RegisterForm;
