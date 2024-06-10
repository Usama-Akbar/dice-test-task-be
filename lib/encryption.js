const bycrypt = require('bcryptjs');

const encryptPassword = async (password) => {
    return await bycrypt.hash(password, 10);
}
const comparePassword = async (password, hash) => {
    return await bycrypt.compare(password, hash);
}

module.exports = {encryptPassword, comparePassword};