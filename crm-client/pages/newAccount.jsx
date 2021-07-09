import React, { useState } from 'react'
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';

const CREATE_NEW_USER = gql`
    mutation createNewUser($input: userData) {
        createNewUser(input: $input) {
            id
            name
            lastName
            email
        }
    }
`;

const NewAccount = () => {

    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(false);
    const [ createNewUser ] = useMutation(CREATE_NEW_USER);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            name: '',
            lastName: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('User name cannot be empty'),
            lastName: Yup.string()
                .required('User last name cannot be empty'),
            email: Yup.string()
                .email('The email is invalid')
                .required('User email cannot be empty'),
            password: Yup.string()
                .required('User password cannot be empty')
                .min(6, 'The password will be contain almost six characteres'),
        }),
        onSubmit: async formValues => {
            try {
                const { name, lastName, email, password } = formValues;
                const { data } = await createNewUser({
                    variables: {
                        input: {
                            name,
                            lastName,
                            email,
                            password
                        }
                    }
                });
                
                setMessage('User registered successfully.');
                setErrorMessage(false);
                setTimeout(() => {
                    setMessage(null);
                    router.push('/login');
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
                        ? "bg-red-100 py-2 px-3 w-full  my-3 max-w-sm text-center mx-auto border-l-4 border-red-500 text-red-700 p-4" 
                        : "bg-green-100 py-2 px-3 w-full  my-3 max-w-sm text-center mx-auto border-l-4 border-green-500 text-green-700 p-4"
                    }
                >
                    <p>{message}</p>
                </div>
            );
        } 
    }

    return (
        <Layout>
            { message && errorMessage === true ? showMessage(true) : showMessage(false) }
            <h1 className="text-center text-2xl text-white text-light">
                New Account
            </h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-sm">
                    <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Jhon"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        {formik.touched.name && formik.errors.name ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.name}</p>
                            </div>
                        ) : null} 

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                Last Name
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="lastName"
                                type="text"
                                placeholder="Foster"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        
                        {formik.touched.lastName && formik.errors.lastName ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.lastName}</p>
                            </div>
                        ) : null} 

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                User Email
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="user_email@domain.com"
                                value={formik.values.email}
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
                                User Password
                            </label>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="User Password"
                                value={formik.values.password}
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
                            value="Create Account"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NewAccount;