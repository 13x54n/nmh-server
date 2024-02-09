const Joi = require('joi');
const Admin = require('../models/Admin');

// Create a new admin
async function createAdmin(req, res) {
  // Validate the request body
  const schema = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().required(),
    email: Joi.string().email().required(),
    details: Joi.object(),
  });

  try {
    const validatedData = await schema.validateAsync(req.body);

    // Create a new admin using the validated data
    const admin = new Admin(validatedData);
    const savedAdmin = await admin.save();

    res.json(savedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all admins
async function getAllAdmins(req, res) {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get admin by ID
async function getAdminById(req, res) {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update admin by ID
async function updateAdminById(req, res) {
  const { id } = req.params;

  // Validate the request body
  const schema = Joi.object({
    name: Joi.string(),
    role: Joi.string(),
    email: Joi.string().email(),
    details: Joi.object(),
  });

  try {
    const validatedData = await schema.validateAsync(req.body);

    const updatedAdmin = await Admin.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete admin by ID
async function deleteAdminById(req, res) {
  const { id } = req.params;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};