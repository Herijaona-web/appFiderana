import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Tarika from '../models/Tarika.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey123456789', {
        expiresIn: '30d'
    });
};

export const renderLogin = (req, res) => {
    res.render('admin/login', {
        title: 'Admin Login',
        layout: 'layouts/auth'
    });
};

export const handleLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier) {
            return res.render('admin/login', {
                title: 'Admin Login',
                layout: 'layouts/auth',
                error: 'Please provide email or username'
            });
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.render('admin/login', {
                title: 'Admin Login',
                layout: 'layouts/auth',
                error: 'Invalid credentials'
            });
        }

        if (user.role !== 'admin') {
            return res.render('admin/login', {
                title: 'Admin Login',
                layout: 'layouts/auth',
                error: 'Admin access required'
            });
        }

        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.redirect('/admin');
    } catch (error) {
        res.render('admin/login', {
            title: 'Admin Login',
            layout: 'layouts/auth',
            error: error.message
        });
    }
};

export const handleLogout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.redirect('/admin/login');
};

export const getDashboard = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            user: req.user,
            path: '/admin',
            stats: {
                users: usersCount,
                recentLogins: 1,
                securityAlerts: 0
            }
        });
    } catch (error) {
        res.status(500).render('error', {
            error: error.message
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.render('admin/users', {
            title: 'Users Management',
            user: req.user,
            path: '/admin/users',
            users
        });
    } catch (error) {
        res.sttuas(500).render('error', { error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        await User.create({ username, email, password, role });
        const users = await User.find().select('-password');

        res.render('admin/users', {
            title: 'Users Management',
            user: req.user,
            path: '/admin/users',
            users,
            success: 'User created successfully'
        });
    } catch (error) {
        const users = await User.find().select('-password');
        res.render('admin/users', {
            title: 'Users Management',
            user: req.user,
            path: '/admin/users',
            users,
            error: error.message
        });
    }
};

export const updateOrDeleteUser = async (req, res) => {
    try {
        const { username, email, role } = req.body;
        const method = req.body._method;

        if (method === 'PUT') {
            await User.findByIdAndUpdate(req.params.id, { username, email, role }, { new: true, runValidators: true });
        } else if (method === 'DELETE') {
            await User.findByIdAndDelete(req.params.id);
        } else {
            throw new Error('Invalid method');
        }

        const users = await User.find().select('-password');
        res.render('admin/users', {
            title: 'Users Management',
            user: req.user,
            path: '/admin/users',
            users,
            success: method === 'PUT' ? 'User updated successfully' : 'User deleted successfully'
        });
    } catch (error) {
        const users = await User.find().select('-password');
        res.render('admin/users', {
            title: 'Users Management',
            user: req.user,
            path: '/admin/users',
            users,
            error: error.message
        });
    }
};

export const getTarika = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const tarikas = await Tarika.find();
        res.render('admin/tarika', {
            title: 'Users tarika',
            user: req.user,
            path: '/admin/tarika',
            users,
            tarikas
        });
    } catch (error) {
        res.status(500).render('error', { error: error.message });
    }
};

// Création d'une nouvelle Tarika
export const createTarika = async (req, res) => {
    try {
        const { anarana } = req.body;
        await Tarika.create({ anarana });

        const tarikas = await Tarika.find();

        res.render('admin/tarika', {
            title: 'Tarika Management',
            tarikas,
            user: req.user,
            path: '/admin/tarika',
            success: 'Tarika created successfully',
        });
    } catch (error) {
        const tarikas = await Tarika.find();
        res.render('admin/tarika', {
            title: 'Tarika Management',
            tarikas,
            user: req.user,
            path: '/admin/tarika',
            error: error.message,
        });
    }
};