const pool = require('../config/dbConfig');

const getInvoice = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM invoice');
        res.status(200).json(result);
    } catch (error) {
        console.error('Error retrieving invoices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createInvoice = async (req, res) => {
    const { cusID, orderId, tax_id } = req.body;
    console.log(cusID, orderId, tax_id )

    try {
        // Calculate total amount
        const totalAmount = await calculateTotalAmount(orderId);
        
        // Insert invoice
        const invoiceId = await insertInvoice(cusID, orderId, totalAmount, tax_id);
        
        // Insert invoice details
        await insertInvoiceDetails(orderId, invoiceId);

        res.status(200).json({ invoiceId });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to insert an invoice
async function insertInvoice(cusID, orderId, totalAmount, tax_id) {

    try {
        // Insert invoice query
        const invoiceInsertQuery = `INSERT INTO invoice (CusID, total_amount, tax_id) VALUES (?, ?, ?)`;
        const [result] = await pool.query(invoiceInsertQuery, [cusID, totalAmount, tax_id]);
        const invoiceId = result.insertId;

        // Update orders table with invoice ID
        const invoiceUpdateOrders = `UPDATE orders SET invoice_id = ? WHERE order_id = ?`;
        await pool.query(invoiceUpdateOrders, [invoiceId, orderId]);

        return invoiceId;
    } catch (error) {
        throw error;
    } 
} // <--- Missing closing curly brace for insertInvoice function

// Function to calculate total amount
async function calculateTotalAmount(orderId) {
    let totalAmount = 0;
    console.log(orderId)

    try {
        // Query to retrieve order details
        const orderDetailsQuery = `SELECT quantity, subtotal_price FROM order_details WHERE order_id = ?`;
        const [rows] = await pool.query(orderDetailsQuery, [orderId]);
        console.log(rows[0])

        rows.forEach(row => {
            totalAmount += row.subtotal_price;
        });
        console.log(totalAmount)
        // Apply tax (assuming 7% tax rate)
        totalAmount *= 1.07;
        return totalAmount;
    } catch (error) {
        throw error;
    } 
}

// Function to insert invoice details
async function insertInvoiceDetails(orderId, invoiceId) {

    try {
        // Query to retrieve order details
        const orderDetailsQuery = `SELECT * FROM order_details WHERE order_id = ?`;
        const [rows] = await pool.query(orderDetailsQuery, [orderId]);

        for (const row of rows) {
            const productId = row.pro_id;
            const quantity = row.quantity;
            const pricePerUnit = row.subtotal_price / quantity;
            const totalPrice = row.subtotal_price;

            // Insert invoice detail query
            const invoiceDetailInsertQuery = `INSERT INTO invoice_detail (invoice_id, ProID , quantity, price_per_unit, total_price) VALUES (?, ?, ?, ?, ?)`;
            await pool.query(invoiceDetailInsertQuery, [invoiceId, productId, quantity, pricePerUnit, totalPrice]);       
        }
    } catch (error) {
        throw error;
    } 
}

module.exports = {
    createInvoice,
    getInvoice
};
