addLayer("energy", {
    name: "Energy", // The name of the layer
    symbol: "EN", // The symbol for the layer's node
    position: 0, // Position of the layer in the tree
    startData() { return {
        unlocked: true,
        points: new Decimal(1), // Starting energy points
    }},
    color: "#ebcc34",
    type: "static", // No prestige based on this layer
    resource: "Energy", // The resource produced by this layer
    baseResource: "Energy Points", // What this is based on (could be points or any other resource)
    baseAmount() { return player.points }, // Uses player's points as base amount
    row: 0, // Row of the layer in the tree
    passiveGeneration() {
        if (!player.energy) return new Decimal(0); // Handle undefined case
        let passive = new Decimal(0);
        if (hasUpgrade('energy', 11)) passive = passive.add(10).sub(player.energy.points.times(0.10));
        if (hasUpgrade('energy', 12)) passive = passive.add(10);
        if (hasUpgrade('energy', 13)) passive = passive.add(player.points.pow(0.2));
        return passive;
    },
    
        
    buyables: {
        11: {
            title: "Enhanced Energy",
            cost(x) { return new Decimal(250).add(15 * x); },
            effect(x) { return new Decimal(x).add(1); },
            display() {
                return `Boosts energy by ${this.effect(player.energy.buyables[11] || 0).format()}`;
            },
            unlocked() { return hasUpgrade('energy', 14); },
            },
        },
    layerShown() {return true},
    tabFormat: [
        "main-display",
        "blank",
        "buyables",
        "upgrades",
    ],
});