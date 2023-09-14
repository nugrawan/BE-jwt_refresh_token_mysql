const Users = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email']
        });
        res.json(users) 
    } catch (error) {
        console.log(error);
    }
}

const Register = async(req, res) => {
    const {name, email, password, confirmPassword } = req.body;
    if(password !== confirmPassword) return res.status(400).json({ msg: 'Password tidak sama'});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name,
            email,
            password: hashPassword,
        });
        res.json({msg: 'Register berhasil'});
    } catch (error) {
        console.log(error);
    }
}

const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({ msg: 'Wrong password'});
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({ userId, name, email}, process.env.SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({ userId, name, email}, process.env.REFRESH, {
            expiresIn: '1d'
        });
        
        // refresh token disimpan dalam refresh_token
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId,
            }
        });

        // refreshToken untuk mengatur cookie dengan nilai token refresh
        await res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // cookie hanya dapat diakses melalui http bukan js browser
            maxAge: 24 * 60 * 60 * 1000 // 1 hari
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: 'Email tidak terdaftar'});
    }
} 

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(204);
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({ refresh_token :null },{
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

module.exports = {
    getUsers,
    Register,
    Login,
    logout
};
