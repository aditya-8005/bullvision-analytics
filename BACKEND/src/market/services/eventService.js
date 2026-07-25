const AppError = require("../../errors/AppError");
const { supabase } = require("../../config/supabase");
const { throwIfSupabaseError } = require("../../utils/supabaseError");

function toEvent(row) {
    return {
        id: row.id,
        name: row.name,
        category: row.category,
        country: row.country,
        startDate: row.start_date,
        endDate: row.end_date,
        description: row.description,
        ...row.details,
    };
}

async function getAllEvents() {
    const { data, error } = await supabase
        .from("historical_events")
        .select("*")
        .order("start_date", { ascending: false });
    throwIfSupabaseError(error, "Could not load historical events");
    return data.map(toEvent);
}

async function getEventById(id) {
    const { data, error } = await supabase
        .from("historical_events")
        .select("*")
        .eq("id", id)
        .maybeSingle();
    throwIfSupabaseError(error, "Could not load historical event");

    if (!data) {

        throw new AppError(
            `Event '${id}' not found.`,
            404
        );

    }

    return toEvent(data);

}

async function getEventsByCategory(category) {
    const { data, error } = await supabase
        .from("historical_events")
        .select("*")
        .eq("category", category)
        .order("start_date", { ascending: false });
    throwIfSupabaseError(error, "Could not load historical events");
    return data.map(toEvent);

}

module.exports = {
    getAllEvents,
    getEventById,
    getEventsByCategory
};
