// import express from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';
// import Staff from '../models/Staff.js';
// import bruteForce from '../middleware/bruteForceProtectionMiddleware.js';
// import loginAttemptLogger from '../middleware/loginAttemptMiddleware.js';

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET;

// // Registration Route for Users
// router.post('/register', async (req, res) => {
//     console.log('Register route hit');
//     try {
//         const { username, fullName, idNumber, accountNumber, password } = req.body;

//         // Define robust regex patterns for input validation
//         const usernameRegex = /^\w{3,30}$/;
//         const fullNameRegex = /^[a-zA-Z\s]{1,50}$/;
//         const idNumberRegex = /^\d{13}$/;
//         const accountNumberRegex = /^\d{10,12}$/;
//         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

//         // Validate the inputs with regex
//         if (!usernameRegex.test(username)) {
//             return res.status(400).json({ message: 'Invalid username. Must be 3-30 characters, alphanumeric, and can include underscores.' });
//         }
//         if (!fullNameRegex.test(fullName)) {
//             return res.status(400).json({ message: 'Invalid full name. Only letters and spaces are allowed, and must be 1-50 characters.' });
//         }
//         if (!idNumberRegex.test(idNumber)) {
//             return res.status(400).json({ message: 'Invalid ID number. Must be a 13-digit number.' });
//         }
//         if (!accountNumberRegex.test(accountNumber)) {
//             return res.status(400).json({ message: 'Invalid account number. Must be 10-12 digits.' });
//         }
//         if (!passwordRegex.test(password)) {
//             return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters long, include at least one letter and one number.' });
//         }

//         // Check if user already exists by account number
//         const existingUser = await User.findOne({ accountNumber});
//         if (existingUser) {
//             return res.status(400).json({ message: 'User with this account number already exists' });
//         }
       
   
//         // Hash Password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a "pending approval" user object
//         const pendingUser = new User({
//             username,
//             fullName,
//             idNumber,
//             accountNumber,
//             password: hashedPassword,
//             status: 'pending', // Add a status field to indicate pending approval
//         });

//         // Save pendingUser to the database
//         await pendingUser.save();

//         // Send success message
//         res.status(201).json({ message: 'Registration successful. Your account is waiting for admin approval.' });

//     } catch (err) {
//         res.status(500).json({ message: 'Internal Server Error' + error, error: err.message });
//     }
// });


// // Registration Route - Staff
// router.post('/register/staff', async (req, res) => {
//     console.log('Staff Register route hit');
//     try {
//         const { username, fullName, password } = req.body;

//         // Define regex patterns
//         const usernameRegex = /^\w{3,30}$/;
//         const fullNameRegex = /^[a-zA-Z\s]{1,50}$/;
//         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

//        // Validate the inputs with regex
//        if (!usernameRegex.test(username)) {
//         return res.status(400).json({ message: 'Invalid username. Must be 3-30 characters, alphanumeric, and can include underscores.' });
//         }
//         if (!fullNameRegex.test(fullName)) {
//             return res.status(400).json({ message: 'Invalid full name. Only letters and spaces are allowed, and must be 1-50 characters.' });
//         }

//         if (!passwordRegex.test(password)) {
//             return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters long, include at least one letter and one number.' });
//         }

//         // Check if admin already exists by username (or you can use another field like `email` if applicable)
//         const existingStaff = await Staff.findOne({ username });
//         if (existingStaff) {
//             return res.status(400).json({ message: 'Staff with this username already exists' });
//         }

//         // Hash Password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create the admin object
//         const newStaff = new Staff({
//             username,
//             fullName,
//             password: hashedPassword,
//             role: 'staff', // Explicitly set the role to admin
//         });

//         // Save the new admin to the database
//         await newStaff.save();

//         res.status(201).json({ message: 'Staff registration successful.' });

//     } catch (err) {
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });

// // Registration Route - Admin
// router.post('/register/admin', async (req, res) => {
//     console.log('Admin Register route hit');
//     try {
//         const { username, fullName, password } = req.body;

//         // Define regex patterns
//         const usernameRegex = /^\w{3,30}$/;
//         const fullNameRegex = /^[a-zA-Z\s]{1,50}$/;
//         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

//         // Validate the inputs with regex
//         if (!usernameRegex.test(username)) {
//             return res.status(400).json({ message: 'Invalid username. Must be 3-30 characters, alphanumeric, and can include underscores.' });
//         }
//         if (!fullNameRegex.test(fullName)) {
//             return res.status(400).json({ message: 'Invalid full name. Only letters and spaces are allowed.' });
//         }

//         if (!passwordRegex.test(password)) {
//             return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters long, include at least one letter and one number.' });
//         }

//         // Check if admin already exists by username (or you can use another field like `email` if applicable)
//         const existingAdmin = await Staff.findOne({ username });
//         if (existingAdmin) {
//             return res.status(400).json({ message: 'Admin with this username already exists' });
//         }

//         // Hash Password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create the admin object
//         const newAdmin = new Staff({
//             username,
//             fullName,
//             password: hashedPassword,
//             role: 'admin', // Explicitly set the role to admin
//         });

//         // Save the new admin to the database
//         await newAdmin.save();

//         res.status(201).json({ message: 'Admin registration successful.' });

//     } catch (err) {
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });

// // Update Password - Staff
// router.post('/staff/forget-password', async (req, res) => {
//     const { username, newPassword } = req.body;

//     if (!username || !newPassword) {
//         return res.status(400).json({ message: 'staff and new password are required.' });
//     }

//     try {
//         // Find the staff member by username
//         const staff = await Staff.findOne({ username });
//         if (!staff) {
//             return res.status(404).json({ message: 'Staff member not found.' });
//         }

//          // Validate the new password using regex (at least 8 characters, one letter, one number)
//         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//         if (!passwordRegex.test(newPassword)) {
//             return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters long, include at least one letter and one number.' });
//         }
 
//          // Hash the new password
//          const hashedPassword = await bcrypt.hash(newPassword, 10);
 
//         // Update the password in the database
//         staff.password = hashedPassword;
//         await staff.save();

//         res.status(200).json({ message: 'Password updated successfully.' });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });

// // Update Password - Admin
// router.post('/admin/forget-password', async (req, res) => {
//     const { username, newPassword } = req.body;

//     if (!username || !newPassword) {
//         return res.status(400).json({ message: 'Username and new password are required.' });
//     }

//     try {
//         // Find the admin member by username
//         const admin = await Staff.findOne({ username });
//         if (!admin) {
//             return res.status(404).json({ message: 'Admin member not found.' });
//         }

//         // Validate the new password using regex (at least 8 characters, one letter, one number)
//         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//         if (!passwordRegex.test(newPassword)) {
//             return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters long, include at least one letter and one number.' });
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Update the password in the database
//         admin.password = hashedPassword;
//         await admin.save();

//         res.status(200).json({ message: 'Password updated successfully.' });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });


// // Update Password - User
// router.post('/user/forget-password', async (req, res) => {
//     const { username, newPassword } = req.body;

//     if (!username || !newPassword) {
//         return res.status(400).json({ message: 'Username and new password are required.' });
//     }

//     try {
//         // Find the staff member by username
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(404).json({ message: 'User member not found.' });
//         }

//         // Validate the new password using regex (at least 8 characters, one letter, one number)
//         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
//         if (!passwordRegex.test(newPassword)) {
//             return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters long, include at least one letter and one number.' });
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Update the password in the database
//         user.password = hashedPassword;
//         await user.save();

//         res.status(200).json({ message: 'Password updated successfully.' });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });

// // Login Route
// router.post('/login/user', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
//     console.log('Login route hit');
//     try {
//         const { accountNumber, username, password } = req.body;

//         // Validate that all fields are provided
//         if (!accountNumber || !username || !password) {
//             return res.status(400).json({ message: 'Account number, username, and password are required' });
//         }

//         // Check if the user exists in the database by account number
//         const user = await User.findOne({ accountNumber });
//         if (!user) {
//             return res.status(400).json({ message: 'User not found with this account number' });
//         }

//         // Check if the username matches
//         if (user.username !== username) {
//             return res.status(400).json({ message: 'Invalid username' });
//         }

//         // Check if the account is approved
//         if (user.status !== 'approved') {
//             return res.status(400).json({ message: 'Your account is not approved by the admin yet' });
//         }

//         // Compare the provided password with the stored hashed password
//         const isPasswordCorrect = await bcrypt.compare(password, user.password);
//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: 'Invalid password' });
//         }

//         // Create a JWT token for the authenticated user
//         const token = jwt.sign(
//             { userId: user._id, username: user.username },
//             JWT_SECRET, // Replace with your secret key
//             { expiresIn: '1h' } // Token expiration time (optional)
//         );


//         // Send the token and user data as a response
//         res.status(200).json({
//             message: 'Login successful',
//             token,
//             user: {
//                 username: user.username,
//                 accountNumber: user.accountNumber,
//                 password: user.password
//             },
//         });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });

// // Admin Login Route
// router.post('/login/admin', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         console.log('Admin login attempt:', req.body);

//         // Find the admin by username and role
//         const admin = await Staff.findOne({ username, role: 'admin' });

//         if (!admin) {
//             console.log('Admin not found');
//             return res.status(404).json({ message: 'Admin Not Found' });
//         }

//         console.log('Admin found:', admin);

//         // Compare provided password with stored hashed password
//         const isPasswordCorrect = await bcrypt.compare(password, admin.password);

//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: 'Invalid Credentials' });
//         }

//         // Create a JWT token
//         const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });

//         res.status(200).json({ message: 'Admin login successful', token });
//     } catch (err) {
//         console.error('Error during admin login:', err);
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });


// // Staff Login Route
// router.post('/login/staff', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         console.log('Staff login attempt:', req.body);

//         // Find the staff by username and role
//         const staff = await Staff.findOne({ username, role: 'staff' });

//         if (!staff) {
//             console.log('Staff not found');
//             return res.status(404).json({ message: 'Staff Not Found' });
//         }

//         console.log('Staff found:', staff);

//         // Compare provided password with stored hashed password
//         const isPasswordCorrect = await bcrypt.compare(password, staff.password);

//         if (!isPasswordCorrect) {
//             return res.status(400).json({ message: 'Invalid Credentials' });
//         }

//         // Create a JWT token
//         const token = jwt.sign({ id: staff._id, role: staff.role }, JWT_SECRET, { expiresIn: '1h' });

//         res.status(200).json({ message: 'Staff login successful', token });
//     } catch (err) {
//         console.error('Error during staff login:', err);
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });

// // Logout Route
// router.post('/logout', (req, res) => {
//     try {
//         // This response tells the client that the logout action was successful
//         res.status(200).json({
//             message: 'Logout successful.',
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to process logout', error: error.message });
//     }
// });

// // Route to get all pending users for admin approval
// router.get('/admin/pending-users', async (req, res) => {
//     try {
//         // Fetch users with a status of 'pending'
//         const pendingUsers = await User.find({ status: 'pending' });

//         if (!pendingUsers || pendingUsers.length === 0) {
//             return res.status(404).json({ message: 'No pending users found.' });
//         }

//         res.status(200).json(pendingUsers);
//     } catch (err) {
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });


// // Route to approve a pending user
// router.post('/admin/approve-user/:userId', async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Find the user by their ID and ensure their status is pending
//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         if (user.status === 'approved') {
//             return res.status(400).json({ message: 'User is already approved.' });
//         }

    
//         // Update the user's status to 'approved'
//         user.status = 'approved';
//         await user.save();

//         res.status(200).json({ message: 'User successfully approved.' });
//     } catch (err) {
//         res.status(500).json({ message: 'Internal Server Error', error: err.message });
//     }
// });

// export default router;


// // This method was adapted from various discussions and tutorials on setting up authentication routes with Express
// // https://dev.to/aritik/setting-up-auth-routes-with-express-57oi
// // DEV Community
// // https://dev.to


import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import User from '../models/User.js';
import Staff from '../models/Staff.js';
import bruteForce from '../middleware/bruteForceProtectionMiddleware.js';
import loginAttemptLogger from '../middleware/loginAttemptMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Validation schema using Joi
const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    fullName: Joi.string().pattern(/^[a-zA-Z\s]{1,50}$/).required(),
    idNumber: Joi.string().length(13).pattern(/^\d+$/).required(),
    accountNumber: Joi.string().length(10).pattern(/^\d+$/).required(),
    password: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required()
});

// Joi schema for input validation
const registrationSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    fullName: Joi.string().pattern(/^[a-zA-Z\s]{1,50}$/).required(),
    password: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).required()
});

// Joi schema for validating login inputs
const loginSchema = Joi.object({
    accountNumber: Joi.string().length(10).pattern(/^\d+$/).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().required(),
});

// Registration Route for Users
router.post('/register', async (req, res) => {
    console.log('Register route hit');
    try {
        const { error, value } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, fullName, idNumber, accountNumber, password } = value;

        // Check if user already exists by account number
        const existingUser = await User.findOne({ accountNumber});
        if (existingUser) {
            return res.status(400).json({ message: 'User with this account number already exists' });
        }
       
   
        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a "pending approval" user object
        const pendingUser = new User({
            username,
            fullName,
            idNumber,
            accountNumber,
            password: hashedPassword,
            status: 'pending', // Add a status field to indicate pending approval
        });

        // Save pendingUser to the database
        await pendingUser.save();

        // Send success message
        res.status(201).json({ message: 'Registration successful. Your account is waiting for admin approval.' });

    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' + error, error: err.message });
    }
});


// Registration Route - Staff
router.post('/register/staff', async (req, res) => {
    console.log('Staff Register route hit');
    try {
        // Validate and sanitize the input using Joi
        const { username, fullName, password } = await registrationSchema.validateAsync(req.body);

        // Check if admin already exists by username (or you can use another field like `email` if applicable)
        const existingStaff = await Staff.findOne({ username });
        if (existingStaff) {
            return res.status(400).json({ message: 'Staff with this username already exists' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the admin object
        const newStaff = new Staff({
            username,
            fullName,
            password: hashedPassword,
            role: 'staff', // Explicitly set the role to admin
        });

        // Save the new admin to the database
        await newStaff.save();

        res.status(201).json({ message: 'Staff registration successful.' });

    } catch (err) {
        // Handle validation errors
        if (err.isJoi) {
            return res.status(400).json({ message: err.details[0].message });
        }
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Registration Route - Admin
router.post('/register/admin', async (req, res) => {
    console.log('Admin Register route hit');

    // Define Joi schema for validation
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        fullName: Joi.string().regex(/^[a-zA-Z\s]{1,50}$/).required().messages({
            'string.pattern.base': 'Full name must contain only letters and spaces and be up to 50 characters long.',
        }),
        password: Joi.string().min(8).max(128).pattern(/^(?=.*[A-Za-z])(?=.*\d)/).required()
            .messages({
                'string.pattern.base': 'Password must contain at least one letter and one number.'
            }),
    });

    try {
        // Validate the request body against the schema
        const { username, fullName, password } = await schema.validateAsync(req.body);

        // Check if admin already exists by username (or you can use another field like `email` if applicable)
        const existingAdmin = await Staff.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this username already exists' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the admin object
        const newAdmin = new Staff({
            username,
            fullName,
            password: hashedPassword,
            role: 'admin', // Explicitly set the role to admin
        });

        // Save the new admin to the database
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registration successful.' });

    } catch (err) {
        // Handle validation errors
        if (err.isJoi) {
            return res.status(400).json({ message: err.details[0].message });
        }
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Password - Staff
router.post('/staff/forget-password', async (req, res) => {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).json({ message: 'staff and new password are required.' });
    }

    try {
        // Find the staff member by username
        const staff = await Staff.findOne({ username });
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found.' });
        }

         // Validate the new password using regex (at least 8 characters, one letter, one number)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters long, include at least one letter and one number.' });
        }
 
         // Hash the new password
         const hashedPassword = await bcrypt.hash(newPassword, 10);
 
        // Update the password in the database
        staff.password = hashedPassword;
        await staff.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Update Password - Admin
router.post('/admin/forget-password', async (req, res) => {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).json({ message: 'Username and new password are required.' });
    }

    try {
        // Find the admin member by username
        const admin = await Staff.findOne({ username });
        if (!admin) {
            return res.status(404).json({ message: 'Admin member not found.' });
        }

        // Validate the new password using regex (at least 8 characters, one letter, one number)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters long, include at least one letter and one number.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


// Update Password - User
router.post('/user/forget-password', async (req, res) => {
    const { username, newPassword } = req.body;

    if (!username || !newPassword) {
        return res.status(400).json({ message: 'Username and new password are required.' });
    }

    try {
        // Find the staff member by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User member not found.' });
        }

        // Validate the new password using regex (at least 8 characters, one letter, one number)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'Invalid password. Must be at least 8 characters long, include at least one letter and one number.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


// // Update Password - Staff
// router.post('/staff/forget-password', async (req, res) => {
//     // Define Joi schema for input validation
//     const schema = Joi.object({
//         username: Joi.string().alphanum().min(3).max(30).required(),
//         newPassword: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)/).required()
//             .messages({
//                 'string.pattern.base': 'Password must contain at least one letter and one number.'
//             }),
//     });

//     if (!username || !newPassword) {
//         return res.status(400).json({ message: 'staff and new password are required.' });
//     }

//     try {
//         // Validate and sanitize the input data
//         const { username, newPassword } = await schema.validateAsync(req.body);

//         // Find the staff member by username
//         const staff = await Staff.findOne({ username });
//         if (!staff) {
//             return res.status(404).json({ message: 'Staff member not found.' });
//         }
 
//          // Hash the new password
//          const hashedPassword = await bcrypt.hash(newPassword, 10);
 
//         // Update the password in the database
//         staff.password = hashedPassword;
//         await staff.save();

//         res.status(200).json({ message: 'Password updated successfully.' });
//     } catch (err) {
//         // Handle validation errors and other errors
//         if (err.isJoi) {
//             return res.status(400).json({ message: err.details[0].message });
//         }
//         console.error(err);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// // Update Password - Admin
// router.post('/admin/forget-password', async (req, res) => {
//     // Define Joi schema for input validation
//     const schema = Joi.object({
//         username: Joi.string().alphanum().min(3).max(30).required(),
//         newPassword: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)/).required()
//             .messages({
//                 'string.pattern.base': 'Password must contain at least one letter and one number.'
//             }),
//     });

//     if (!username || !newPassword) {
//         return res.status(400).json({ message: 'Username and new password are required.' });
//     }

//     try {
//         // Validate and sanitize the input data
//         const { username, newPassword } = await schema.validateAsync(req.body);

//         // Find the admin member by sanitized username
//         const admin = await Staff.findOne({ username: username }).exec();
//         if (!admin) {
//             return res.status(404).json({ message: 'Admin member not found.' });
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Update the password in the database
//         admin.password = hashedPassword;
//         await admin.save();

//         res.status(200).json({ message: 'Password updated successfully.' });
//     } catch (err) {
//         // Handle validation errors and other errors
//         if (err.isJoi) {
//             return res.status(400).json({ message: err.details[0].message });
//         }
//         console.error(err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });


// // Update Password - User
// router.post('/user/forget-password', async (req, res) => {
//     // Define Joi schema for input validation
//     const schema = Joi.object({
//         username: Joi.string().alphanum().min(3).max(30).required(),
//         newPassword: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)/).required()
//             .messages({
//                 'string.pattern.base': 'Password must contain at least one letter and one number.'
//             }),
//     });

//     if (!username || !newPassword) {
//         return res.status(400).json({ message: 'Username and new password are required.' });
//     }

//     try {
//         // Validate and sanitize the input data
//         const { username, newPassword } = await schema.validateAsync(req.body);

//         // Find the staff member by username
//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(404).json({ message: 'User member not found.' });
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Update the password in the database
//         user.password = hashedPassword;
//         await user.save();

//         res.status(200).json({ message: 'Password updated successfully.' });
//     } catch (err) {
//          // Handle validation errors and other errors
//          if (err.isJoi) {
//             return res.status(400).json({ message: err.details[0].message });
//         }
//         console.error(err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// Login Route
router.post('/login/user', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
    console.log('Login route hit');
    try {
        // Validate and sanitize input data
        const { accountNumber, username, password } = await loginSchema.validateAsync(req.body);

        // Check if the user exists in the database by account number
        const user = await User.findOne({ accountNumber });
        if (!user) {
            return res.status(400).json({ message: 'User not found with this account number' });
        }

        // Check if the username matches
        if (user.username !== username) {
            return res.status(400).json({ message: 'Invalid username' });
        }

        // Check if the account is approved
        if (user.status !== 'approved') {
            return res.status(400).json({ message: 'Your account is not approved by the admin yet' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create a JWT token for the authenticated user
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET, // Replace with your secret key
            { expiresIn: '1h' } // Token expiration time (optional)
        );


        // Send the token and user data as a response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                accountNumber: user.accountNumber,
                password: user.password
            },
        });
    } catch (err) {
        if (err.isJoi) {
            return res.status(400).json({ message: err.details[0].message });
        }
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Admin Login Route
router.post('/login/admin', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
    // Define Joi schema for input validation
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().min(8).required(),
    });

    try {
        // Validate and sanitize the input data
        const { username, password } = await schema.validateAsync(req.body);

        console.log('Admin login attempt:', req.body);

        // Find the admin by username and role
        const admin = await Staff.findOne({ username, role: 'admin' }).exec();

        if (!admin) {
            console.log('Admin not found');
            return res.status(404).json({ message: 'Admin Not Found' });
        }

        console.log('Admin found:', admin);

        // Compare provided password with stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Admin login successful', token });
    } catch (err) {
        // Handle validation errors and other errors
        if (err.isJoi) {
            return res.status(400).json({ message: err.details[0].message });
        }
        console.error('Error during admin login:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Staff Login Route
router.post('/login/staff', bruteForce.prevent, loginAttemptLogger, async (req, res) => {
    // Define Joi schema for input validation
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().min(8).required(),
    });

    try {
        // Validate and sanitize the input data
        const { username, password } = await schema.validateAsync(req.body);

        console.log('Staff login attempt:', req.body);

        // Find the staff by username and role
        const staff = await Staff.findOne({ username, role: 'staff' }).exec();

        if (!staff) {
            console.log('Staff not found');
            return res.status(404).json({ message: 'Staff Not Found' });
        }

        console.log('Staff found:', staff);

        // Compare provided password with stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, staff.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: staff._id, role: staff.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Staff login successful', token });
    } catch (err) {
        // Handle validation errors and other errors
        if (err.isJoi) {
            return res.status(400).json({ message: err.details[0].message });
        }
        console.error('Error during staff login:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    try {
        // This response tells the client that the logout action was successful
        res.status(200).json({
            message: 'Logout successful.',
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to process logout', error: error.message });
    }
});

// Route to get all pending users for admin approval
router.get('/admin/pending-users', async (req, res) => {
    try {
        // Fetch users with a status of 'pending'
        const pendingUsers = await User.find({ status: 'pending' });

        if (!pendingUsers || pendingUsers.length === 0) {
            return res.status(404).json({ message: 'No pending users found.' });
        }

        res.status(200).json(pendingUsers);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});


// Route to approve a pending user
router.post('/admin/approve-user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by their ID and ensure their status is pending
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.status === 'approved') {
            return res.status(400).json({ message: 'User is already approved.' });
        }

    
        // Update the user's status to 'approved'
        user.status = 'approved';
        await user.save();

        res.status(200).json({ message: 'User successfully approved.' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

export default router;


// This method was adapted from various discussions and tutorials on setting up authentication routes with Express
// https://dev.to/aritik/setting-up-auth-routes-with-express-57oi
// DEV Community
// https://dev.to