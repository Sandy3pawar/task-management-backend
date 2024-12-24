const {User, UserToken} = require('../models/userModel');

class Authorize {
 static async auth(authHeaders) {
    console.log(authHeaders)
    const authToken = authHeaders.authorization;
     const token = authToken.split(' ')[1];
const userTokenResult = await UserToken.findOne({token:token});
if(!userTokenResult){
    return {message: 'Invalid Token Provided. Please Login Again To Continue', success: false}
}
if(userTokenResult.token !== token){
   return {message: 'Failed', success: false}
}
const user = await User.findOne({ _id: userTokenResult.userId });
if (!user) {
return {message: 'User not found', success: false}
}
userTokenResult['role'] = user.role;
return {message: 'Success', success: true, data: userTokenResult} 
 }
}
module.exports = Authorize;