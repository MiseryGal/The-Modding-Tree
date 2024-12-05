addLayer("energy", {
    name: "Energy", // The name of the layer
    symbol: "EN", // The symbol for the layer's node
    position: 0, // Position of the layer in the tree
    row: 0, // Row of the layer in the tree
    startData() { return {
        unlocked: true,
        points: new Decimal(1), // Starting energy points
    }},
    color: "#ebcc34",
    type: "static", // No prestige based on this layer
    resource: "Energy", // The resource produced by this layer
    baseResource: "Energy Points", // What this is based on (could be points or any other resource)
    baseAmount() { return player.points }, // Uses player's points as base amount
    passiveGeneration() {
        if (!player.energy) return new Decimal(0); // Handle undefined case
        let passive = new Decimal(0);
        let decay = new Decimal(0.10);
        if (hasUpgrade('energy', 11)) passive = passive.add(10).sub(player.energy.points.times(decay));
        if (hasUpgrade('energy', 12)) passive = passive.add(10);
        if (hasUpgrade('energy', 13)) passive = passive.add(player.points.pow(0.2));
        let buyableEffect = layers.energy.buyables[11].effect(getBuyableAmount("energy", 11));
        passive = passive.mul(buyableEffect); 
        return passive;
    },
    upgrades: {
        11: {
            title: "Energy",
            description: "Begin Energy production.",
            tooltip: "Base rate of Energy is 10 - (Energy x 0.10).",
            cost: new Decimal(1),
        },
        12: {
            title: "More Energy",
            description: "Adds 10 to Energy rate, Energy boosts Energy Points at a reduced rate.",
            tooltip: "Rate at which Energy Points are boosted is Energy ^ 0.9.",
            cost: new Decimal(99),
        },
        13: {
            title: "These are useful now",
            description: "Energy Points boost Energy Rate at a reduced rate.",
            tooltip: "Rate at which Energy Points boost Energy is Energy Points ^ 0.2.",
            cost: new Decimal(199),
        },
        14: {
            title: "Something new",
            description: "Unlocks an Energy buyable.",
            cost: new Decimal(260),
        },
    },
    buyables: {
        11: {
            title: "Enhanced Energy",
            cost(x) { return new Decimal(250).add(new Decimal(15).times(new Decimal(x))) },
            display() { 
                let amt = getBuyableAmount("energy", 11);
                return `Adds +1.00 to Energy base.\n\nCost: ${this.cost(amt).toString()}\nBought: ${amt}`; 
            },
            canAfford() { 
                let amt = getBuyableAmount("energy", 11);
                return player["energy"].points.gte(this.cost(amt)); 
            },
            buy() {
                let amt = getBuyableAmount("energy", 11);
                player["energy"].points = player["energy"].points.sub(this.cost(amt));
                setBuyableAmount("energy", 11, amt.add(1));
            },
            effect(x) {
                return new Decimal(x).add(1); 
            },
            unlocked() {
                return hasUpgrade('energy', 14);
            },
        },
    },
    layerShown() {
return true; // Makes sure the layer is visible
    },
    tabFormat: [
        "main-display",
        "blank",
        "buyables",
        "upgrades",
    ],
});
