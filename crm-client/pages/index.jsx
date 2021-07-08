import React, { Fragment, useState } from 'react';
import Layout from '../components/Layout';
import {gql, useMutation, useQuery} from '@apollo/client';
import DataTable from 'react-data-table-component';
import Swal from "sweetalert2";
import { useRouter } from 'next/dist/client/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

const GET_CUSTOMERS_BY_USER = gql`
  query getCustomerBySeller {
    getCustomerBySeller {
      id
      name
      lastName
      email
      phone
      company
    }
  }
`;

const DELETE_CUSTOMER = gql`
    mutation deleteCustomer($id: ID!) {
      deleteCustomer(id: $id)
    }
`;

const Home = () => {

    const [ customerId, setCustomerId ] = useState(null);
    const { data, loading, error } = useQuery(GET_CUSTOMERS_BY_USER);
    const [ deleteCustomer ] = useMutation(DELETE_CUSTOMER, {
        update(cache) {
            const { getCustomerBySeller } = cache.readQuery({ query: GET_CUSTOMERS_BY_USER});
            cache.writeQuery({
                query: GET_CUSTOMERS_BY_USER,
                data: { getCustomerBySeller: getCustomerBySeller.filter( currentCustomer => currentCustomer.id !== customerId ) }
            });
        }
    });
    const router = useRouter();

    if (loading) return null;
    if (!data.getCustomerBySeller) return router.push('/login');

    const deleteAction = (name, lastName, id) => {
        setCustomerId(id);
        Swal.fire({
            title: 'Are you sure?',
            text: `${name + ' ' + lastName} will be delete`,
            icon: 'warning',
            confirmButtonText: 'Delete',
            confirmButtonColor: '#3085d6',
            showCancelButton:true,
            cancelButtonColor: '#d33',
        }).then( async (result) => {
            if (result.isConfirmed) {
                try {
                    const { data } = await deleteCustomer({
                        variables: {
                            id
                        }
                    });
                    Swal.fire(
                        'Deleted!',
                        data.deleteCustomer,
                        'success'
                    )
                    setCustomerId(null);
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: `${name + ' ' + lastName} cannot be delete`,
                        icon: 'error',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                        showCancelButton: false,
                        cancelButtonColor: '#d33',
                    })
                }
            }
        })
    }


    const setColumns = [
        { name: 'Name', selector: 'name', sortable: true },
        { name: 'Last Name', selector: 'lastName', sortable: true },
        { name: 'Email', selector: 'email', sortable: true },
        { name: 'Phone', selector: 'phone', sortable: true },
        { name: 'Company', selector: 'company', sortable: true },
        { name: 'Actions', selector: 'id', sortable: false,
            cell: (row) =>
                <div className="btn-group">
                    <button type="button" className="btn btn-warning btn-sm fa fa-edit" onClick={() => editAction ()}/>
                    <button type="button" className="btn btn-danger btn-sm fa fa-trash" onClick={() => deleteAction(row.name, row.lastName, row.id)}    />
                </div>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                color: 'black',
                background: 'rgba(147, 197, 253)',
                justifyContent: 'center',
                fontSize: '16px'
            }
        }
    };

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Customers</h1>
                <button
                    type="button"
                    className="btn btn-success btn-sm justify-end"
                    onClick={() => router.push('/customerForm')}
                >
                    <i className="fa fa-plus"></i> New Customer
                </button>
                <div className="table-responsive">
                    <DataTable
                        columns={setColumns}
                        data={data.getCustomerBySeller}
                        pagination
                        fixedHeader
                        fixedHeaderScrollHeight="600px"
                        customStyles={customStyles}
                    />
                </div>
            </Layout>
        </div>
    )
}

export default Home;
