const { supabase } = require("../../config/supabase");
const { throwIfSupabaseError } = require("../../utils/supabaseError");

function toCompany(row) {
    return {
        id: row.id,
        name: row.name,
        listings: row.listings,
        ...row.metadata,
    };
}

async function getAllCompanies() {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name");
    throwIfSupabaseError(error, "Could not load companies");
    return data.map(toCompany);
}

async function getCompanyById(id) {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    throwIfSupabaseError(error, "Could not load company");
    return data ? toCompany(data) : null;

}

async function getCompanyByName(name) {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .ilike("name", name)
        .maybeSingle();
    throwIfSupabaseError(error, "Could not load company");
    return data ? toCompany(data) : null;

}

async function getCompanyBySymbol(symbol) {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .contains("listings", [{ symbol }])
        .maybeSingle();
    throwIfSupabaseError(error, "Could not load company");
    return data ? toCompany(data) : null;

}

module.exports = {
    getAllCompanies,
    getCompanyById,
    getCompanyByName,
    getCompanyBySymbol
};
