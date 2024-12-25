// const User = require('../models/userModel');
// const User = require('../models/userModel')
const { User, UserToken } = require('../models/userModel');  // Correct import
const  config = require('../enum/filds');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
class AuthController {

    static async register(body) {
        try {
            const { username, email, password, role } = body;
            // Check if user already exists
            const existingUser = await User.findOne({ email });  // Add await to resolve the promise
            if (existingUser) {
                return { error: "User already exists" };
            }
            // check required fields
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            // Create a new user
            const user = new User({ _id: Math.random().toString(16).slice(2), username, email, password: hashedPassword, role });

            // Save the user to the database
            const result = await user.save();
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            // Return success message
             const userObject = user.toObject();  // Convert to plain JavaScript object
            const userToken = new UserToken({
                _id: userObject._id + Math.random().toString(16).slice(2),
                userId: userObject._id, token: token, expiresAt: new Date(Date.now() + 3600000)
            })
            await userToken.save();
            return { success: true, message: "User registered successfully", data: { id: result._id, username, email, role , token} };
        } catch (error) {
            if (error.code === 11000) {
                // Handle MongoDB duplicate key error
                return { error: "User with this email already exists" };
            }
            return { error: error.message };  // Handle other errors
        }
    }


    static async login(body) {
        try {
            const { email, password } = body;
            const user = await User.findOne({ email });

            // const user = await User.findOne({email});
            if (!user) {
                return { error: "User not found" };
            }
            // check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { error: "Invalid credentials" };
            }
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // Optionally, you can save the token to a UserToken collection, like this:
            // const userToken = new UserToken({
            //   userId: user._id,
            //   token,
            //   expiresAt: new Date(Date.now() + 3600000)  // 1 hour from now
            // });
            // await userToken.save();
            const userObject = user.toObject();  // Convert to plain JavaScript object
            const userToken = new UserToken({
                _id: userObject._id + Math.random().toString(16).slice(2),
                userId: userObject._id, token: token, expiresAt: new Date(Date.now() + 3600000)
            })
            await userToken.save();
            return { success: true, token };
        } catch (error) {
            return { error: error.message };

        }
        // try {
        //     const {email, password} = body;
        //     const user = await User.findOne({email});
        //     if(!user) {
        //         return {error: "User not found"};
        //     }
        //     const isMatch = await bcrypt.compare(password, user.password);
        //     if(!isMatch) {
        //         return {error: "Invalid credentials"};
        //     }
        //     const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        //     return {success: true, token};
        // } catch (error) {
        //     return {error: error.message}
        // }

    }
    static async update(body, context) {
        if(Object.keys(body).length === 0) {
            return { message: 'No data provided', success: false };
        }
        const invalidFields = [];
        Object.keys(body).forEach(key => {
            if(config.auditFields.includes(key)) {
                invalidFields.push(key);
               // return { message: `You are not allowed to update this field: ${key}`, success: false };
            }
        })
        if(invalidFields.length > 0) {
            return { message: `You are not allowed to update these fields: ${invalidFields.join(', ')}`, success: false };
        }
        if(context.role !== 'Admin') {
            return { message: 'You are not authorized to update this user Please contact the admin', success: false }
        }
        const userRecord = await User.find({ _id: body._id });
        if(userRecord.length === 0) {
            return { message: 'User not found', success: false }
        }
        if(userRecord[0].role !== 'Admin') {
            return { message: 'You are not authorized to update this user Please contact the admin', success: false }
        }
        const updatedRec = await User.updateOne({ _id: userRecord[0]._id }, { $set: body });
        return { message: 'User updated successfully', success: true };
        // return updatedRec;

    }
    static async logout(authHeaders) {
        const authToken = authHeaders.authorization;
        const token = authToken.split(' ')[1];
        const userTokenResult = await UserToken.findOne({ token: token });
        if (!userTokenResult) {
            return { message: 'Invalid Token Provided', success: false }
        }
        if (userTokenResult.token !== token) {
            return { message: 'Invalid Token Provided', success: false }
        }
        const result = await UserToken.deleteOne({ token: token });
        return { message: 'User logged out successfully', success: true };
    }
}
module.exports = AuthController
