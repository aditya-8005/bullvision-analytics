const portfolioService = require("../services/portfolioService");

const addHolding = async(req,res)=>{
const { symbol,
   exchange,
   quantity,
   averageBuyPrice,
   purchaseDate,
   notes}=req.body;


     if (!symbol) {
        return res.status(400).json({
            success: false,
            message: "Stock symbol is required.",
        });
    }

    if (!exchange) {
    return res.status(400).json({
        success: false,
        message: "Exchange is required.",
    });
}

if (!quantity || quantity < 1) {
    return res.status(400).json({
        success: false,
        message: "Minimum 1 stock is required.",
    });
}

if (!averageBuyPrice) {
    return res.status(400).json({
        success: false,
        message: "Average Buy Price is required.",
    });
}

if (!purchaseDate) {
    return res.status(400).json({
        success: false,
        message: "Purchase Date is required.",
    });
}




 try{
 const holding = await portfolioService.addHolding({
      user: req.user.id,
    exchange,
   quantity,
   symbol,
   averageBuyPrice,
   purchaseDate,
   notes,
 })
 return res.status(201).json({
            success: true,
            message: "Holding added successfully.",
            holding,
        });
 }
 catch(error){
     return res.status(500).json({
     success:false,
     message:error.message}
    )};
 
};

const getHoldings = async (req, res) => {

    try {

        const holdings = await portfolioService.getHoldings(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            holdings,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const updateHolding = async (req, res) => {

    const { id } = req.params;

    const {
        quantity,
        averageBuyPrice,
        purchaseDate,
        notes,
    } = req.body;

    try {

        const updatedHolding =
            await portfolioService.updateHolding(
                id,
                req.user.id,
                {
                    quantity,
                    averageBuyPrice,
                    purchaseDate,
                    notes,
                }
            );

        if (!updatedHolding) {
            return res.status(404).json({
                success: false,
                message: "Holding not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Holding updated successfully.",
            holding: updatedHolding,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};


const deleteHolding = async (req, res) => {

    const { id } = req.params;

    try {

        const deletedHolding =
            await portfolioService.deleteHolding(
                id,
                req.user.id
            );

        if (!deletedHolding) {
            return res.status(404).json({
                success: false,
                message: "Holding not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Holding deleted successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    addHolding,
    getHoldings,
    updateHolding,
    deleteHolding,
};