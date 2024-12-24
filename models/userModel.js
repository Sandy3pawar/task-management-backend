const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "Manager", "employee"], default: "employee" },
    createdAt: { type: Date, default: Date.now },
});

// Define the UserToken Schema
const userTokenSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // Custom _id field for UserToken
    userId: { type: String, ref: 'User', required: true },  // C
    // _id: { type: String, required: true },
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // User reference
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },  // Expiry date for the token
}, { timestamps: true });

// Create Mongoose models
const User = mongoose.model('User', userSchema);
const UserToken = mongoose.model('UserToken', userTokenSchema);

module.exports = { User, UserToken };













// const mongoose = require('mongoose');



// const userSchema = new mongoose.Schema({
//     _id: { type: String, required: true },
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: {type: String, required: true, enum: ["Admin", "Manager", "Employee"], default: "Employee"},
//     createdAt: { type: Date, default: Date.now },
// });




// const userTokenSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     token: { type: String, required: true },
//     expiresAt: { type: Date, required: true },  // Expiry date for the token
// }, { timestamps: true });

// const UserToken = mongoose.model('UserToken', userTokenSchema);



// module.exports = mongoose.model('User', userSchema);