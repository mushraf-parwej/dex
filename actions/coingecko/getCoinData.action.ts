export const getCoinData = async () => {
    try {
        const res = await fetch('/api/coingecko');
        
        // Check if the response is OK (status code 200-299)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Parse the JSON data
        const data = await res.json();
        console.log(data);
        // Return the parsed data
        return data;
    } catch (error) {
        console.error('Error fetching coin data:', error);
        throw new Error(error);
    }
};