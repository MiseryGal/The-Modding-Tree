addLayer("energy", {
    name: "Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(1),  // Start with 1 Energy
        }
    },
    color: "#ebcc34",
    resource: "Energy",
    type: "none", // no prestige mechanic
    row: 0, // Row the layer is in on the tree (0 is the first row)
    
    // Define the upgrades
    upgrades: {
        11: {
            title: "Energy",
            description: "Begin Energy production.",
            cost: new Decimal(1),         // Costs 1 Energy
            unlocked() { return true; },  // Always visible
            canAfford() {
                return player.energy.points.gte(this.cost);  // Allows exact cost purchases
            },
            pay() {
                player.energy.points = player.energy.points.minus(this.cost);  // Deduct cost manually
            },
        }
    },

    // Make sure the layer is shown
    layerShown() { 
        return true; 
    },
});