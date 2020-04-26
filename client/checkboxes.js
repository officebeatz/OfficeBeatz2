function generateGenreToCheckboxMappings() {
    let mappings = {}

    // Normal mappings
    const normalGenres = ['Rock', 'Reggae', 'Pop', 'Electronic', 'Alternative', 'Blues', 'Latin', 'Jazz', 'Country']
    for (let i = 0; i < normalGenres.length; i++) {
        let genreName = normalGenres[i];
        mappings[genreName] = genreName.toLowerCase() + "Box";
    }

    // Weird mappings
    mappings["Hip-Hop"] = "hipHopBox";
    mappings["Acoustic"] = "otherBox";

    // Omitted mappings
    // - Hip Hop, Rap, Gangsta (hipHopBox)
    // - Ska (otherBox)
    return mappings;
}

const genreToCheckboxId = generateGenreToCheckboxMappings();

module.exports = genreToCheckboxId;
