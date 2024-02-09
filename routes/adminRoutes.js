const { createAdmin, getAllAdmins, getAdminById, updateAdminById, deleteAdminById } = require("../controllers/adminController");

const adminRouter = require("express").Router();

// Create a new admin
adminRouter.post('/', createAdmin);

// Get all admins
adminRouter.get('/', getAllAdmins);

// Get admin by ID
adminRouter.get('/:id', getAdminById);

// Update admin by ID
adminRouter.put('/update/:id', updateAdminById);

// Delete admin by ID
adminRouter.delete('/delete/:id', deleteAdminById);

module.exports = adminRouter