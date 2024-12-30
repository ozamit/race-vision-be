
const savePredictions = async (req, res) => {
    console.log("savePredictions");
    console.log("req: ", req.body);
    res.status(200).json({ message: "savePredictions Run successfully" });

};

module.exports = { savePredictions };