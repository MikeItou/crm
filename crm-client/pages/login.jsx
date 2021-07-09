import React, { useState, Fragment } from 'react'
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';

const AUTHENTICATE_USER = gql`
    mutation authenticateUser($input: userValidate) {
        authenticateUser(input: $input) {
            token
        }
    }
`;

const Login = () => { 

    const [ authenticateUser ] = useMutation(AUTHENTICATE_USER);
    const [errorMessage, setErrorMessage] = useState(false);
    const [message, setMessage] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('The email is invalid')
                .required('The email is required'),
            password: Yup.string()
                .required('The password is required')
                .min(6, 'The password will be contain almost six characteres')
        }),
        onSubmit: async formValues => {
            try {
                const { email, password } = formValues;
                const { data } = await authenticateUser({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });

                const { token } = data.authenticateUser;
                localStorage.setItem('token', token);
                setMessage('Login successfull');
                setErrorMessage(false);
                setTimeout(() => {
                    setMessage(null);
                    router.push('/');
                }, 3000);
            } catch (error) {
                setErrorMessage(true);
                setMessage(error.message);
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            }
        }
    });

    const showMessage = (errorFlag) => {
        if (message) {
            return (
                <div 
                    className={
                        errorFlag 
                        ? "bg-red-100 py-2 px-2 w-full  my-2 max-w-sm text-center mx-auto border-l-4 border-red-500 text-red-700 p-3" 
                        : "bg-green-100 py-2 px-2 w-full  my-2 max-w-sm text-center mx-auto border-l-4 border-green-500 text-green-700 p-3"
                    }
                >
                    <p>{message}</p>
                </div>
            );
        } 
    }

    return (
       <Fragment>
           <Layout>
            {message && errorMessage === true ? showMessage(true) : showMessage(false)}
               <h1 className="text-center text-2xl text-white text-light">
                   Login
               </h1>
               <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="your_email@domain.com"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} 
                                />
                            </div>

                            {formik.touched.email && formik.errors.email ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ) : null}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Your Password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>

                            {formik.touched.password && formik.errors.password ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ) : null}

                            <input type="submit"
                                className="bg-gray-800 w-full mt-5 p-2  text-white uppercase hover:cursor-pointer hover:bg-gray-900"
                                value="Sign in"
                            />
                        </form>
                    </div>
               </div>
           </Layout>
       </Fragment>
    );
}

export default Login;