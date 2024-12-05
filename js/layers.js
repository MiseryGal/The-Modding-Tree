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
        let passive = new Decimal(0);
        let passivebase = new Decimal(10)

        // passive base

        if (hasUpgrade('energy', 12)) passivebase = new Decimal(20);
        if (hasUpgrade('energy', 13)) passivebase = passivebase.add(player.points.pow(0.2));
        let buyableEffect = layers.energy.buyables[11].effect(getBuyableAmount("energy", 11));
        passivebase = passivebase.add(buyableEffect); 
        if (hasUpgrade('energy', 22)) passivebase = new Decimal(30);
        if (hasUpgrade('energy', 23)) passivebase = passivebase.times(1.2)

        // decay

        let decay = new Decimal(0.10);
        if (hasUpgrade('energy', 21)) decay = new Decimal(0.08);

        // passive

        if (hasUpgrade('energy', 11)) passive = passive.add(passivebase).sub(player.energy.points.times(decay));
        return passive;
    },
    upgrades: {
        11: {
            title: "Energy",
            description: "Begin Energy production.",
            tooltip: "Formula: 10-(Energy*0.1)",
            cost: new Decimal(1),
        },
        12: {
            title: "More Energy",
            description: "Adds 10 to the Energy base, Energy boosts Energy Points at a reduced rate.",
            tooltip: "Formula: Energy^0.9",
            cost: new Decimal(95),
            unlocked() {
                return hasUpgrade('energy', 11);
            },
        },
        13: {
            title: "These are useful now",
            description: "Energy Points boost Energy Base at a reduced rate.",
            tooltip: "Formula: Energy Points^0.2",
            cost: new Decimal(195),
            unlocked() {
                return hasUpgrade('energy', 12);
            },
        },
        14: {
            title: "Something new",
            description: "Unlocks an Energy buyable.",
            cost: new Decimal(250),
            unlocked() {
                return hasUpgrade('energy', 13);
            },
        },
        21: {
            title: "Power Saving",
            description: "Lowers the Energy Decay by 0.02.",
            tooltip: "New Formula: 10-(Energy*0.08)",
            cost: new Decimal(320),
            unlocked() {
                return hasUpgrade('energy', 14);
            },
        },
        22: {
            title: "Optimizations",
            description: "Multiplies Energy Points by 10 and adds a further 10 to the Energy base.",
            cost: new Decimal(357),
            unlocked() {
                return hasUpgrade('energy', 21);
            },
        },
        23: {
            title: "Bored?",
            description: "1.2x Energy Base",
            cost: new Decimal(357),
            unlocked() {
                return hasUpgrade('energy', 22);
            },
        },
    },
    buyables: {
        11: {
            title: "Enhanced Energy",
            cost(x) {
                let amt = getBuyableAmount("energy", 11);
                let baseCost = new Decimal(250).add(new Decimal(20).times(new Decimal(x)));
                let extraScalingFactor = Math.floor(Decimal(amt).divide(10)); // Calculate how many times the extra cost should be added
                let adjustedCost = baseCost.add(new Decimal(extraScalingFactor).times(10)); // Add the scaling increment of 10 every 10 levels
                return adjustedCost;
            },
            effect(x) {
                return new Decimal(x).add(1);
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
            display() { 
                let amt = getBuyableAmount("energy", 11);
                return `Adds +1.00 to Energy base.\n<span style="font-size: 15px;">Current Effect: +${new Decimal(amt).toFixed(2)} to Energy base.\nCost: ${this.cost(amt).toString()}</span>\nBought: ${amt}`; 
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
        "resource-display",
        "blank",
        "buyables",
        "upgrades",
    ],
});
