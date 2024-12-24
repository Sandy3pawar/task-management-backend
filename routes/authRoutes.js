const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const auth = require('../controllers/authorize')

// router.post('/register', authController.register);
// router.post('/login', authController.login);

router.post('/register', async function (req, res) {
    try {
        const result = await authController.register(req.body);
        if (result && result.success) {
            console.log(result);
            // res.cookie('userToken', result.token, {httpOnly: true});
            return res.json(result);
        }
        console.log(result);
        return res.json({ sucess: false, message: result.error });
    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.post('/login', async function (req, res) {
    try {
        const result = await authController.login(req.body);
        if (result && result.success) {
            console.log(result);
            // res.cookie('userToken', result.token, {httpOnly: true});
            return res.json({ success: true, message: "User logged in successfully", token: result.token });
        }
        console.log(result);
        return res.json({ error: result.error });
    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.put('/update', async function (req, res) {
    const authorization = await auth.auth(req.headers);
    console.log(authorization);
    if(!authorization.success) return res.json(authorization);

    const result = await authController.update(req.body, authorization.data);
    try {
        if (result && result.success) {
            return res.json(result);
        }
        else
            return res.json(result);
    } catch (error) {
        return res.json(error);
    }
}
)

router.post('/logout', async function (req, res) {
    // res.clearCookie('userToken');
    // const authorization = auth.auth(req.headers);
    // if(!authorization.success) return res.json(authorization);
    const result = await  authController.logout(req.headers);
    if(result.success === false) return res.json(result);
    return res.json({ success: true, message: "User logged out successfully" });
})

module.exports = router;