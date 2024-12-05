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
        
        if (hasUpgrade('energy', 11)) passive = passive.add(10).sub(player.energy.points.times(0.10))
       
        if (hasUpgrade('energy', 12)) passive = passive.add(10);

        if (hasUpgrade('energy', 13)) passive = passive.add(player.points.pow(0.2))
        
        return passive;
    },
    buyables: {
        11: {
            title: "Enhanced Energy",
            cost(x) { return new Decimal(250).add(Decimal(15),times(x))},
            display() { return "Adds +1.00 to Energy base per level." },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }

        }
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
            unlocked() {
                hasUpgrade('energy', 11)
            }
        },
        13: {
            title: "These are useful now",
            description: "Energy Points boost Energy Rate at a reduced rate.",
            tooltip: "Rate at which Energy Points boost Energy is Energy Points ^ 0.2.",
            cost: new Decimal(199),
            unlocked() {
                hasUpgrade('energy', 12)
            }
        },
        14: {
            title: "Something new",
            description: "Unlocks an Energy buyable.",
            cost: new Decimal(260),
            unlocked() {
                hasUpgrade('energy', 13)
            }
        }
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