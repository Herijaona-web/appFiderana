import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - only authenticated users can access
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in cookies or authorization header
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123456789');

    // Add user to request object
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.redirect('/admin/login');
  }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).render('error', {
      error: 'Admin access required for this route'
    });
  }
};