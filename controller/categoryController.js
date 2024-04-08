const pool = require('../config/dbConfig');

async function updateCategory(req, res) {
    try {
        const { a1 , a2 } = req.body;

        console.log(a1 , a2)
        const sql = `UPDATE product_type SET name = ? WHERE id = ?`;
        const values = [a2 , a1];

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
    updateCategory
};
