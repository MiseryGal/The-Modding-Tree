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
    syncResources() {
        // You could synchronize resources here if needed
    },
    row: 0, // Row of the layer in the tree
    passiveGeneration() {
        let passive = new Decimal(0);
        // Check if upgrade 11 is purchased and add passive generation
        if (hasUpgrade('energy', 11)) passive = passive.add(10).sub(player.energy.points.times(0.10))
        // Apply the multiplier from upgrade 12 if it's unlocked
        if (hasUpgrade('energy', 12)) passive = passive.times(2); // Apply 2x multiplier
        return passive;
    },
    upgrades: {
        11: {
            title: "Energy",
            description: "Begin Energy production.",
            cost: new Decimal(1),  // Cost for upgrading
        },
        12: {
            title: "More Energy",
            description: "2.00x Energy production",
            cost: new Decimal(100),  // Cost for the second upgrade
        },
    },
    layerShown() {
        return true; // Makes sure the layer is visible
    },
    tabFormat: [
        "main-display",
        "blanK",
        "buyables",
        "upgrades",
    ],
});