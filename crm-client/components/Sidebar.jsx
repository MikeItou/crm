import React from 'react'
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';

const Sidebar = () => {
    const pathName = useRouter().pathname;

    return (
        <aside className="bg-black sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
            <div>
                <p className="text-white text-2xl">CRM Customers</p>
            </div>
            <nav className="mt-5 list-none">
                <li className={pathName === "/" || pathName === "/customerForm" ? "bg-gray-700 p-2" : "p-2"}>
                    <Link href="/">
                        <a 
                            className="text-white block" 
                            style={{textDecoration: "none"}}
                        > 
                            <i className="fa fa-users fa-xs"></i> Customers
                        </a>
                    </Link>
                </li>
                <li className={pathName === "/products" ? "bg-gray-700 p-2" : "p-2"}>
                    <Link href="/products">
                        <a 
                            className="text-white block" 
                            style={{textDecoration: "none"}}
                        >
                            <i className="fa fa-archive fa-xs"></i> Products
                        </a>
                    </Link>
                </li>
                <li className={pathName === "/orders" ? "bg-gray-700 p-2" : "p-2"}>
                    <Link href="/orders">
                        <a 
                            className="text-white block" 
                            style={{textDecoration: "none"}}
                        >
                            <i className="fa fa-tags fa-xs"></i> Orders
                        </a>
                    </Link>
                </li>
            </nav>
        </aside>
    );
}

export default Sidebar;