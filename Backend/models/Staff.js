// import mongoose from 'mongoose';

// // Define the Staff schema
// const StaffSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//         trim: true,
//         match: /^[a-zA-Z0-9_]{3,30}$/, // Allows only alphanumeric characters and underscores, length 3-30
//     },
//     fullName: {
//         type: String,
//         required: true,
//         trim: true,
//         match: /^[a-zA-Z\s]{2,50}$/, // Allows letters and spaces only, length 2-50
//     },
//     password: {
//         type: String,
//         required: true,
//         // Stronger password regex (8 characters minimum, including at least one uppercase letter, one number, and one special character)
//     },
//     role: {
//         type: String,
//         required: true,
//         enum: ['admin', 'staff'], // Role can either be 'admin' or 'staff'
//         default: 'staff',
//     },
// });

// // Export the Staff model
// export default mongoose.model('Staff', StaffSchema);

// // This method was adapted from the Mongoose documentation on defining schemas
// // https://mongoosejs.com/docs/guide.html





import mongoose from 'mongoose';

// Define the Staff schema
const StaffSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^\w{3,30}$/, // Allows only alphanumeric characters and underscores, length 3-30
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        match: /^[a-zA-Z\s]{2,50}$/, // Allows letters and spaces only, length 2-50
    },
    password: {
        type: String,
        required: true,
        // Stronger password regex (8 characters minimum, including at least one uppercase letter, one number, and one special character)
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'staff'], // Role can either be 'admin' or 'staff'
        default: 'staff',
    },
});

// Export the Staff model
export default mongoose.model('Staff', StaffSchema);

// This method was adapted from the Mongoose documentation on defining schemas
// https://mongoosejs.com/docs/guide.html