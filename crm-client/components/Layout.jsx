import React from 'react'
import Head from 'next/head';
import { Fragment } from 'react';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/dist/client/router';
import Header from '../components/Header';

const Layout = ({ children }) => {
    const pathName = useRouter().pathname;

    return (
        <Fragment>
            <Head>
                <title>Customer Relationship Managment</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
                <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
            </Head>

            {pathName === "/login" || pathName === "/newAccount" ? (
                <div className="bg-gray-800 min-h-screen flex flex-col justify-center"> 
                    { children }
                </div>
            ) : (
                <div>
                    <div className="flex min-h-screen">
                        <Sidebar />
                        <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
                            <Header />
                            { children }
                        </main>
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default Layout;