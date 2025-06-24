// Helper function (makes easier for us to use the pokemon API)
// To acces the pokemon API

const POKEMON_API = "https://pokeapi.co/api/v2/";

// getPokemonList -> Get the first 151 pokemon names
export async function getPokemonList() {
    const request = await fetch(`${POKEMON_API}pokemon?limit=151&offset=0`);
    const data = await request.json(); 4
    return data.results;
}

// getPokemon -> Get pokemon data by name { ...... }
export async function getPokemon(name: string) {
    const request = await fetch(`${POKEMON_API}pokemon/${name}`);
    const data = await request.json();
    return data;
}