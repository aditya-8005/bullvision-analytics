const { supabase } = require("../config/supabase");
const { throwIfSupabaseError } = require("../utils/supabaseError");

function toPortfolioRow(holding) {
    return {
        user_id: holding.user,
        symbol: holding.symbol.trim().toUpperCase(),
        exchange: holding.exchange,
        quantity: holding.quantity,
        average_buy_price: holding.averageBuyPrice,
        purchase_date: holding.purchaseDate,
        notes: holding.notes || "",
    };
}

function toHolding(row) {
    if (!row) return null;
    return {
        id: row.id,
        user: row.user_id,
        symbol: row.symbol,
        exchange: row.exchange,
        quantity: Number(row.quantity),
        averageBuyPrice: Number(row.average_buy_price),
        purchaseDate: row.purchase_date,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

const addHolding = async (holdingData) => {
    const { data, error } = await supabase
        .from("portfolios")
        .insert(toPortfolioRow(holdingData))
        .select()
        .single();
    throwIfSupabaseError(error, "Could not add holding");
    return toHolding(data);
};

const getHoldings = async (userId) => {
    const { data, error } = await supabase
        .from("portfolios")
        .select()
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
    throwIfSupabaseError(error, "Could not load holdings");
    return data.map(toHolding);
};

const updateHolding = async (holdingId, userId, updateData) => {

    const payload = {};
    if (updateData.quantity !== undefined) payload.quantity = updateData.quantity;
    if (updateData.averageBuyPrice !== undefined) payload.average_buy_price = updateData.averageBuyPrice;
    if (updateData.purchaseDate !== undefined) payload.purchase_date = updateData.purchaseDate;
    if (updateData.notes !== undefined) payload.notes = updateData.notes || "";

    const { data, error } = await supabase
        .from("portfolios")
        .update(payload)
        .eq("id", holdingId)
        .eq("user_id", userId)
        .select()
        .maybeSingle();
    throwIfSupabaseError(error, "Could not update holding");
    return toHolding(data);
};

const deleteHolding = async (holdingId, userId) => {

    const { data, error } = await supabase
        .from("portfolios")
        .delete()
        .eq("id", holdingId)
        .eq("user_id", userId)
        .select()
        .maybeSingle();
    throwIfSupabaseError(error, "Could not delete holding");
    return toHolding(data);
};

module.exports = {
    addHolding,
    getHoldings,
    updateHolding,
    deleteHolding,
};
