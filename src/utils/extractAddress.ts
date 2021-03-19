 
export const extractAddress = (address: string) => {
    return address.substring(0, 6) +
        '...' +
        address.substring(address.length - 4, address.length); 
}

export const extractText = (text: string) => {
    return text.substring(0, 20) +
        '...' 
       
}
// label que diga si esta en emergencia 
// porcetaje 
// total asset es toke, 
// governance es primero