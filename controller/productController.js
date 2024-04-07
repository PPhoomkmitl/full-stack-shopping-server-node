const pool = require('../config/dbConfig');

async function updateProduct(req, res) {
    try {
        const { a1, a2, a3, a4 } = req.body;

        console.log(a1, a2, a3, a4)
        const sql = `UPDATE product SET ProName = ?, PricePerUnit = ?, StockQty = ? WHERE ProID = ?`;
        const values = [a2, a3, a4, a1];

        // Execute the update query
        await pool.query(sql, values);

        console.log('Data updated successfully');
        res.status(200).send({ redirectUrl: '/redirect-url' });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
}

module.exports = {
    updateProduct
};
