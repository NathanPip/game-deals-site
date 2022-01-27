//an object containing helper functions for making api calls


import useFetch from './useFetch.js'

//takes an object of filter options as its parameter and formats them into a string 
//that can be concatenated to the end of an api call url
const optionsToString = (options) => {
    if(!options) return '';
    let string = "";
    for(let i=0; i<options.length; i++) {
        string += `?${options[i].key}=${options[i]}`;
    }
    return string;
}


const ApiMethods = {
    //returns a list of game deals based on the options specified in the parameters
    GetGameDeals: async (options) => {
        const optionsUrl = optionsToString(options);
        const list = useFetch(`https://www.cheapshark.com/api/1.0/deals${optionsUrl}`);
        return list;
    },
    //returns a list of games based on the search term provided in the value parameter, 
    //search term must correspond with title of game
    GameLookUp: async (value) => {
        return useFetch(`https://www.cheapshark.com/api/1.0/games?title=${value}`)
    },
    //returns a single game based on the games id specified in the parameters
    GetGame: async (id) => {
        return useFetch(`https://www.cheapshark.com/api/1.0/games?id=${id}`);
    }
}

export default ApiMethods;