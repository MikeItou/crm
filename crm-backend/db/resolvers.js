const User = require('../model/User');
const Product = require('../model/Product');
const Customer = require('../model/Customer');
const Order = require('../model/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const createToken = (user, secretKey, expiresIn) => {
    const { id, name, lastName, email } = user;
    return jwt.sign({ id, name, lastName, email }, secretKey, { expiresIn });
}

const resolvers = {
    Query: {
        getUser: async (_, {}, ctx) => {
            try {
                return ctx.user;
            } catch (error) {
                console.log(error);
            }
        },
        getProductList: async () => {
            try {
                const products = await Product.find({});
                // Verify if are products
                if (!products) {
                    throw new Error('These no customers registered');
                }
                return products;
            } catch (error) {
                console.log(error);
            }
        },
        getProduct: async (_, { id }) => {
            try {
                const product = await Product.findById(id);
                // Verify if poroduct exists
                if (!product) {
                    throw new Error('The product selected no exists');
                }
                return product;
            } catch (error) {
                console.log(error);
            }
        },
        getCustomerList: async () => {
            try {
                const customers = await Customer.find({});
                // Verify if are customers
                if (!customers) {
                    throw new Error('These no customers registered');
                }
                return customers;
            } catch (error) {
                console.log(error);
            }
        },
        getCustomerBySeller: async (_, {}, ctx) => {
            try {
                const customers = await Customer.find({ seller: ctx.user.id.toString() });
                // Verify if are customers
                if (!customers) {
                    throw new Error('These no customers registered');
                }
                return customers;
            } catch (error) {
                console.log(error)
            }
        },
        getOnlyCustomer: async (_, { id }, ctx) => {
            try {
                const customer = await Customer.findById(id);
                // Verify if customer exists
                if (!customer) {
                    throw new Error('The customer selected no exists');
                }
                //Only the seller will see the info
                if (customer.seller.toString() !== ctx.user.id) {
                    throw new Error('You cannot access here');
                }

                return customer;
            } catch (error) {
                console.log(error);
            }
        },
        getOrderList: async () => {
            try {
                const order = await Order.find({});
                // Verify if order exist
                if (!order) {
                    throw new Error('These no order registered');
                }
                return order;
            } catch (error) {
                console.log(error);
            }
        },
        getOrderBySeller: async (_, {}, ctx) => {
            try {
                const orders = await Order.find({ seller: ctx.user.id.toString() });
                // Verify if are order
                if (!orders) {
                    throw new Error('These no order registered');
                }
                return orders;
            } catch (error) {
                console.log(error)
            }
        },
        getOnlyOrder: async (_, { id }, ctx) => {
            try {
                const order = await Order.findById(id);
                // Verify if order exists
                if (!order) {
                    throw new Error('The order selected no exists');
                }
                // Only the seller will see the info
                if (order.seller.toString() !== ctx.user.id) {
                    throw new Error('You cannot access here');
                }
                return order;
            } catch (error) {
                console.log(error);
            }
        },
        getOrderByStatus: async (_, { status }, ctx) => {
            try {
                const orders = await Order.find({ seller: ctx.user.id, status });
                // Verify if order exists
                if (!orders) {
                    throw new Error('The order selected no exists');
                }
                return orders;
            } catch (error) {
                console.log(error);
            }
        },
        getTopTenCustomers: async () => {
            const bestCustomers = await Order.aggregate([
                { $match: { status: "COMPLETE" }},
                { $group: { 
                    _id : "$customer", 
                    total : { $sum :  "$total"  }
                }},
                { $lookup : { 
                    from: 'customers', 
                    localField: '_id', 
                    foreignField: "_id", 
                    as: "customer"
                }},
                { $sort: { total: -1 }},
                { $limit: 10 }
            ]);
            return bestCustomers;
        },
        getTopTenSellers: async () => {
            const bestSellers = await Order.aggregate([
                { $match: { status: "COMPLETE" }},
                { $group: { 
                    _id : "$seller", 
                    total : { $sum :  "$total"  }
                }},
                { $lookup : { 
                    from: 'users', 
                    localField: '_id', 
                    foreignField: "_id", 
                    as: "seller"
                }},
                { $sort: { total: -1 }},
                { $limit: 10 }
            ]);
            return bestSellers;
        },
        getProductByName: async (_, { productName }) => {
            try {
                const products = await Product.find({$text: { $search : productName }}).limit(25);
                return products;
            } catch (error) {
                console.log(error);
            }
        }
    },
    Mutation: {
        createNewUser: async (_, { input } ) => {
            try {
                const { email, password } = input;
                 // Validate if user exist
                const userExist = await User.findOne({ email });
                if (userExist) {
                    throw new Error('This user is already registered.');
                }
                //Hashing password
                const salt = bcrypt.genSaltSync(10);
                input.password = await bcrypt.hash(password, salt);
                //Save the user
                const newUser = new User(input);
                newUser.save();
                return newUser;
            } catch (error) {
                return error;
            }
        },
        authenticateUser: async (_, { input } ) => {
            try {
                const { email, password } = input;
                // Validate if user exist
                const userExist = await User.findOne({ email });
                if (!userExist) {
                    throw new Error('The user no exist');
                }
                //Compare password
                const userPassword = await bcrypt.compare( password, userExist.password);
                //Return JSON Web Token (JWT)
                return {
                    token: createToken(userExist, process.env.SECRET_KEY, '24h')
                }
            } catch (error) {
                return error;
            }
        },
        addProduct: async (_, { input }) => {
            try {
                const newProduct = new Product(input);
                const result = await newProduct.save();
                return result;
            } catch (error) {
                console.log(error);
            }
        },
        updateProduct: async (_, { id, input }) => {
            try {
                let product = Product.findById(id);
                // Verify if poroduct exists
                if (!product) {
                    throw new Error('The product selected no exists');
                }
                product = await Product.findByIdAndUpdate(id, input);
                return product;
            } catch (error) {
                console.log(error);
            }
        },
        deleteProduct: async (_, { id }) => {
            try {
                let product = Product.findById(id);
                // Verify if poroduct exists
                if (!product) {
                    throw new Error('The product selected no exists');
                }
                await Product.findOneAndDelete({_id: id});
                return 'The product was deleted';
            } catch (error) {
                console.log(error);
            }
        },
        addCustomer: async (_, { input }, ctx) => {
            try {
                const { name, lastName, email, company, phone } = input;
                //Validate if customer exists
                const customer = await Customer.findOne({ email });
                if (customer) {
                    throw new Error('This client is registered')
                }
                //Save Customer
                const newCustomer = new Customer(input);
                //Seller assign
                newCustomer.seller = ctx.user.id; 
                const result = await newCustomer.save();
                return result;
            } catch (error) {
                console.log(error);
            }

        },
        updateCustomer: async (_, { id, input }, ctx) => {
            try {
                let customer = await Customer.findById(id);
                // Verify if customer exists
                 if (!customer) {
                    throw new Error('The customer selected no exists');
                }
                //Only the seller will see the info
                if (customer.seller.toString() !== ctx.user.id) {
                    throw new Error('This action cannot be execute');
                }

                customer = await Customer.findByIdAndUpdate(id, input);
                return customer;
            } catch (error) {
                console.log(error);
            }
        },
        deleteCustomer: async (_, { id }, ctx) => {
            try {
                let customer = await Customer.findById(id);
                // Verify if customer exists
                if (!customer) {
                    throw new Error('The customer selected no exists');
                }
                //Only user can be deleted
                if (customer.seller.toString() !== ctx.user.id) {
                    throw new Error('This action cannot be execute');
                }

                await Customer.findOneAndDelete({_id: id});
                return 'The customer was deleted';
            } catch (error) {
                return error;
            }
        },
        addOrder: async (_, { input }, ctx) => {
            try {
                //Customer exists
                const { customer } = input
                const customerExists = await Customer.findById(customer);
                if (!customerExists) {
                    throw new Error('The customer selected no exists');
                }
                //Only user can be create order
                if (customerExists.seller.toString() !== ctx.user.id) {
                    throw new Error('This action cannot be execute');
                }
                //Valid pieces in stock
                for await ( const item of input.order) {
                    const { id } = item;
                    const product = await Product.findById(id);
                    if (item.pieces > product.stock) {
                        throw new Error(`These no enough pieces of ${product.name} in stock`);
                    }
                    // Update Stock
                    product.stock = product.stock - item.pieces;
                    await product.save();
                }
                //Adding new order
                const newOrder = new Order(input);
                //Seller assign
                newOrder.seller = ctx.user.id;
                //Save order
                const result = await newOrder.save();
                return result;
            } catch (error) {
                console.log(error);
            }

        },
        updateOrder: async (_, { id, input }, ctx) => {
            try {
                const { customer } = input;
                let order = await Order.findById(id);
                const customerExists = await Customer.findById(customer);
                // Verify if order exists
                 if (!order) {
                    throw new Error('The order selected no exists');
                }
                // Verify if customer exists
                 if (!customerExists) {
                    throw new Error('The customer selected no exists');
                }
                //Only the seller will see the info
                if (customerExists.seller.toString() !== ctx.user.id) {
                    throw new Error('This action cannot be execute');
                }
                // //Valid pieces in stock
                if ( input.order ) {
                    for await ( const item of input.order) {
                        const { id } = item;
                        const product = await Product.findById(id);
                        if (item.pieces > product.stock) {
                            throw new Error(`These no enough pieces of ${product.name} in stock`);
                        }
                        // Update Stock
                        product.stock = product.stock - item.pieces;
                        await product.save();
                    }
                }
                order = await Order.findByIdAndUpdate(id, input);
                return order;
            } catch (error) {
                console.log(error);
            }
        },
        deleteOrder: async (_, { id }, ctx) => {
            try {
                let order = await Order.findById(id);
                // Verify if order exists
                if (!order) {
                    throw new Error('The order selected no exists');
                }
                //Only user can be deleted
                if (order.seller.toString() !== ctx.user.id) {
                    throw new Error('This action cannot be execute');
                }

                await Order.findOneAndDelete({_id: id});
                return 'The order was deleted';
            } catch (error) {
                console.log(error);
            }
        },
    }
}

module.exports = resolvers;
