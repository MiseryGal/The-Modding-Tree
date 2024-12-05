addLayer("energy", {
    name: "Energy",  
    symbol: "EN",      
    position: 0,     
    startData() { 
        return {
            unlocked: true,               // Layer is available from the start
            points: new Decimal(1),       // Starts with 1 Energy
        }
    },
    color: "#FFD700", 
    resource: "Energy", 
    type: "none",   // No prestige mechanic
    upgrades: {
        11: {
            title: "Energy",
            description: "Begin Energy production.",
            cost: new Decimal(1),         // Costs 1 Energy
            }
        }
});
