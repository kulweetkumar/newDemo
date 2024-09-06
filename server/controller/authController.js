


module.exports = {
    login: async(req, res) => {
        try {
            return res.send({msg: 'login done'})
        } catch (error) {
            console.log("Error ================================ ",error);
        }
    }
}