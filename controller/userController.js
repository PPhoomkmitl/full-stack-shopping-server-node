// const getConnection = require('../config/dbConfig');

const bcrypt = require('bcrypt');

// async function updateUser(req, res) {
//     try {
//         const cusID = req.body.id_customer;
//         const a1 = req.body.a1;
//         const a2 = req.body.a2;
//         const a3 = req.body.a3;
//         const a4 = req.body.a4;
//         const a5 = req.body.a5;

//         /* run update */ 
//         const query = `UPDATE customer SET CusFName = ?, CusLName = ?, sex = ?, Tel = ?, role = ? WHERE CusID = ?`;
//         await getConnection.query(query, [a1, a2, a3, a4, a5, cusID]);

//         console.log("Customer updated successfully");
//         res.status(200).json({ message: "Customer updated successfully" });
//     } catch (err) {
//         console.error("Error updating customer:", err);
//         res.status(500).json({ error: "Error updating customer" });
//     }
// }
const pool = require('../config/dbConfig');

async function createUser(req, res) {
    const { a1, a2, a3, a5, a6, a7, role } = req.body;

    try {
        // Check if username already exists
        const usernameCheck = await pool.query("SELECT * FROM customer_account WHERE Username = ?", [a6]);

        if (usernameCheck.length > 0) {
            return res.status(400).json({ message: "Username has already been taken" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(a7, 10);

        // Insert into customer table
        const insertCustomerQuery = "INSERT INTO customer(CusFName, CusLName, sex, Tel, role) VALUES (?, ?, ?, ?, ?)";
        const customerInsertResult = await pool.query(insertCustomerQuery, [a1, a2, a3, a5, role]);
        const cusID = customerInsertResult.insertId;

        // Insert into customer_account table
        const insertAccountQuery = "INSERT INTO customer_account(Username, Password, CusID) VALUES (?, ?, ?)";
        await pool.query(insertAccountQuery, [a6, hashedPassword, cusID]);

        res.redirect('/customer_index.php?success=true');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error occurred while processing the request" });
        res.redirect('./customer_insert_form');
    }
}


async function blockUser(req , res) {
    const { user_id , number } = req.body;
    try {
        // Check if username already exists
        const usernameCheck = await pool.query("SELECT * FROM customer_account WHERE Username = ?", [user_id]);

        if (usernameCheck.length < 0) {
            return res.status(400).json({ message: "Username not found" });
        }

        // Insert into customer table
        const insertCustomerQuery = "UPDATE customer_account (active) VALUES (?) WHERE CusID = ?";
        await pool.query(insertCustomerQuery, [number , user_id ]);

        res.redirect('/customer_index.php');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error occurred while processing the request" });
        res.redirect('./customer_insert_form');
    }
}


module.exports = {
    // updateUser,
    createUser,
    blockUser
};
