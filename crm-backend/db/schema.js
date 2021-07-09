const { gql } = require('apollo-server');

const typeDefs = gql`
    # Users
    type user {
        id: ID
        name: String
        lastName: String
        email: String
        create: String
    }

    type Token {
        token: String
    }

    input userData {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    input userValidate {
        email: String!
        password: String!
    }

    type topTenSellers {
        total: Float
        seller: [user]
    }

    # Products
    type product {
        id: ID
        name: String
        stock: Int
        price: Float
        create: String
    }

    input productData {
        name: String!
        stock: Int!
        price: Float!

    }

    # Customer
    type customer {
        id: ID
        name: String
        lastName: String
        email: String
        company: String
        phone: String
        seller: ID
    }

    input customerData {
        name: String!
        lastName: String!
        email: String!
        company: String!
        phone: String!
    }

    type topTenCustomer {
        total: Float
        customer: [customer]
    }

    # Order
    type order {
        id: ID
        order: [orderGroup]
        total: Float
        customer: ID
        seller: ID
        create: String
        status: orderStatus
    }

    type orderGroup {
        id: ID
        pieces: Int
    }

    input orderProductData {
        id: ID
        pieces: Int
    }

    input orderData {
        order: [orderProductData]
        total: Float!
        customer: ID!
        status: orderStatus
    }

    enum orderStatus {
        PROCESSING
        COMPLETE
        CANCELED
    }

    type Query {
        # Users
        getUser: user
        getTopTenSellers: [topTenSellers]

        # Products
        getProductList: [product]
        getProduct(id: ID!): product
        getProductByName(productName: String!): [product] 

        # Customers
        getCustomerList: [customer]
        getCustomerBySeller: [customer]
        getOnlyCustomer(id: ID!): customer
        getTopTenCustomers: [topTenCustomer]

        # Order
        getOrderList: [order]
        getOrderBySeller: [order]
        getOnlyOrder(id: ID!): order
        getOrderByStatus(status: String!): [order]
    }

    type Mutation {
        # Users
        createNewUser(input: userData): user
        authenticateUser(input: userValidate): Token

        # Products
        addProduct(input: productData) : product
        updateProduct(id: ID!, input: productData) : product
        deleteProduct(id: ID!) : String

        # Customers
        addCustomer(input: customerData) : customer
        updateCustomer(id: ID!, input: customerData) : customer
        deleteCustomer(id: ID!) : String

        # Orders
        addOrder(input: orderData) : order
        updateOrder(id: ID!, input: orderData) : order
        deleteOrder(id: ID!) : String

    }
`;

module.exports = typeDefs;
