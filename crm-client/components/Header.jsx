import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 

const GET_USER = gql`
    query getUser {
        getUser {
            id
            name
            lastName
        }
    }
`;

const Header = () => {

    const { data, loading, error } = useQuery(GET_USER);
    const router = useRouter();

    if (loading) return null
    
    if(!data.getUser) return router.push('/login');

    const { name, lastName } = data.getUser;

    const logout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }
    
    return (
        <div className="flex justify-between mb-6">
            <p className="mr-2 mt-2">{name} {lastName}</p>
            <button 
                type="button" 
                className="btn btn-danger btn-sm justify-end"
                onClick={() => logout()}
            >
                <i className="fa fa-sign-out"></i> Log out
            </button>
        </div>
    )
}

export default Header;