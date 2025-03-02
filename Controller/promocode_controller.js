import { PromoCode } from "../Model/promocode_model.js";



const createpromocode = async(req, res) => {
    try {
        const { code, discountValue, expirationDate } = req.body;

        const existingCode = await PromoCode.findOne({ code });
        if (existingCode) return res.status(400).json({ message: "Promo code already exists" });

        const newPromo = new PromoCode({ code, discountValue, expirationDate });
        await newPromo.save();

        res.status(201).json({ message: "Promo code created", promo: newPromo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deletepromocode = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedpromo = await PromoCode.findById(id);
        if (!deletedpromo) return res.status(404).json({ message: "Promo code not found" });
        await deletedpromo.remove();
        res.json({ message: "Promo code deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export { createpromocode, deletepromocode };