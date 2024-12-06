
const getsessionsforyear = async (req, res) => {

    console.log("Received sessionKey:");
    return res.status(400).json({ message: 'Session key is required' });

};

module.exports = { getsessionsforyear };
