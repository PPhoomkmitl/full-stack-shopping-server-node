// const getConnection = require('../config/dbConfig');

const bcrypt = require('bcrypt');
const pool = require('../config/dbConfig');

async function updateUser(req, res) {
    try {
        const {a1, a2, a3, a4, a5, cusID} = req.body;
        console.log(a1, a2, a3, a4, a5, cusID)

        /* run update */ 
        const query = `UPDATE customer SET CusFName = ?, CusLName = ?, sex = ?, Tel = ?, role = ? WHERE CusID = ?`;
        await pool.query(query, [a1, a2, a3, a4, a5, cusID]);

        console.log("Customer updated successfully");
        res.status(200).json({ message: "Customer updated successfully" });
    } catch (err) {
        console.error("Error updating customer:", err);
        res.status(500).json({ error: "Error updating customer" });
    }
}


async function createUser(req, res) {
    const { a1, a2, a3, a5, a6, a7, role } = req.body;
    console.log(a1, a2, a3, a5, a6, a7, role)

    try {
        // Check if username already exists
        const usernameCheck = await pool.query("SELECT * FROM customer_account WHERE Username = ?", [a6]);

        if (usernameCheck[0].length > 0) {
            console.log(usernameCheck)
            return res.status(400).json({ message: "Username has already been taken" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(a7, 10);

        // Insert into customer table
        const insertCustomerQuery = "INSERT INTO customer(CusFName, CusLName, sex, Tel, role) VALUES (?, ?, ?, ?, ?)";
        const customerInsertResult = await pool.query(insertCustomerQuery, [a1, a2, a3, a5, role]);
        const cusID = customerInsertResult[0].insertId;

        // Insert into customer_account table
        const insertAccountQuery = "INSERT INTO customer_account(Username, Password, CusID , active) VALUES (?, ?, ? , ?)";
        await pool.query(insertAccountQuery, [a6, hashedPassword, cusID ,'1']);
        return res.redirect('http://127.0.0.1/shoppingCart/admin/customer/customer_index.php?success=true');
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Error occurred while processing the request" });
    }
}



async function blockUser(req , res) {
    const user_id  = req.params.id
    const { active } = req.body;
    console.log(user_id  , active)
    try {
        // Check if username already exists
        const usernameCheck = await pool.query("SELECT * FROM customer_account WHERE Username = ?", [user_id]);

        if (usernameCheck.length < 0) {
            return res.status(400).json({ message: "Username not found" });
        }

        // Insert into customer table
        const insertCustomerQuery = "UPDATE customer_account SET active = ? WHERE CusID = ?";
        await pool.query(insertCustomerQuery, [active, user_id]);

        res.redirect('/customer_index.php');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error occurred while processing the request" });
        res.redirect('./customer_insert_form');
    }
}


module.exports = {
    updateUser,
    createUser,
    blockUser
};
