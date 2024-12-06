// Energy Layer

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
    doReset(layer) {
        if (layer !== this.layer) {
            layerDataReset(this.layer, ["upgrades"]);
            player[this.layer].upgrades = player[this.layer].upgrades.filter(upg => upg === 24);
        }
    },
    passiveGeneration() {
        let passive = new Decimal(0);
        let passivebase = new Decimal(10)

        // passive base

        if (hasUpgrade('energy', 12)) passivebase = new Decimal(20);

        if (hasUpgrade('battery', 12)) {
            passivebase = passivebase.add(player.points.pow(0.3)); // Override
        } else if (hasUpgrade('energy', 13)) {
            passivebase = passivebase.add(player.points.pow(0.2)); // Only apply if battery upgrade is not active
        }
        
        let buyableEffect = layers.energy.buyables[11].effect(getBuyableAmount("energy", 11));
        passivebase = passivebase.add(buyableEffect); 

        if (hasUpgrade('energy', 22)) passivebase = passivebase.add(10);
        if (hasUpgrade('energy', 23)) passivebase = passivebase.times(1.2)

        if (player.battery.points.gte(1)) passivebase = passivebase.times(new Decimal(player.battery.points));
        if (hasUpgrade('battery', 11)) passivebase = passivebase.times(1.5)

        // decay

        let decay = new Decimal(0.10);
        if (hasUpgrade('energy', 21)) decay = new Decimal(0.08);

        // passive

        if (hasUpgrade('energy', 11)) passive = passive.add(passivebase).sub(player.energy.points.times(decay));

        this.passivebase = passivebase;
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
            cost: new Decimal(500),
            unlocked() {
                return hasUpgrade('energy', 21);
            },
        },
        23: {
            title: "Bored?",
            description: "1.2x Energy Base",
            cost: new Decimal(690),
            unlocked() {
                return hasUpgrade('energy', 22);
            },
        },
        24: {
            title: "The Beginning",
            description: "Unlocks Batteries",
            cost: new Decimal(910),
            unlocked() {
                if (hasUpgrade('battery', 11)) return (hasUpgrade('battery', 11))
                return (hasUpgrade('energy', 23))
            },
        },
    },
    buyables: {
        11: {
            title: "Enhanced Energy",
            cost(x) {
                let amt = getBuyableAmount("energy", 11);
                let cost1 = (new Decimal(20).times(new Decimal(x)))
                let tenfactor = Math.floor(new Decimal(amt).divide(new Decimal(10)))
                let cost2 = new Decimal(0.5).times(new Decimal(tenfactor)) 
                let fiftyfactor = Math.floor(new Decimal(amt).divide(new Decimal(50)))
                let cost3 = new Decimal(2).pow(new Decimal(fiftyfactor)) 
                return new Decimal(250).add(new Decimal(cost1)).times(new Decimal(1).add(new Decimal(cost2))).times(new Decimal(cost3))

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
                let tenfactor = Math.floor(new Decimal(amt).divide(new Decimal(10)))
                let cost2 = new Decimal(0.5).times(new Decimal(tenfactor))
                if (amt.gte(50)) { 
                    return `Adds +1.00 to Energy base.\n<span style="font-size: 15px;">Current Effect: +${new Decimal(amt).toFixed(2)} to Energy base.\nCost: ${this.cost(amt).toString()}</span>\nBought: ${amt}\n\n<span style="font-size: 10px;">Buyable scaling starts at 10!\nSuperscaling starts at 50!</span>\nCurrent scaling: x${new Decimal(1).add(new Decimal(cost2)).times(new Decimal(cost3)).toFixed(2)}`;
                } else if (amt.gte(10)) {
                    return `Adds +1.00 to Energy base.\n<span style="font-size: 15px;">Current Effect: +${new Decimal(amt).toFixed(2)} to Energy base.\nCost: ${this.cost(amt).toString()}</span>\nBought: ${amt}\n\n<span style="font-size: 15px;">Buyable scaling starts at 10!</span>\nCurrent scaling: x${new Decimal(1).add(new Decimal(cost2)).toFixed(2)}`;
                } return `Adds +1.00 to Energy base.\n<span style="font-size: 15px;">Current Effect: +${new Decimal(amt).toFixed(2)} to Energy base.\nCost: ${this.cost(amt).toString()}</span>\nBought: ${amt}`; 
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
        ["display-text", function() {
            return "Your Energy Base is " + format(layers.energy.passivebase.sub(1));
        }],
        "blank",
        "buyables",
        "upgrades",
    ],
});

// Battery Layer

addLayer("battery", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked() {
            return hasUpgrade('energy', 24);
        },                 // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    symbol: "B",
    color: "#a3a19b",                       // The color for this layer, which affects many elements.
    resource: "Batteries",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    baseResource: "Energy",                 // The name of the resource your prestige gain is based on.
    baseAmount() {return player.energy.points},  // A function to return the current amount of baseResource.
    onPrestige() {
        doReset("energy");
    },
    requires: new Decimal(1000),              // The amount of the base needed to  gain 1 of the prestige currency. // Also the amount required to unlock the layer.
    type: "static",                        // Determines the formula used for calculating prestige currency.
    getNextAt() {
        let x = player.energy.points; 
        return new Decimal(1000).add(new Decimal(800).times(new Decimal(player.battery.points).pow(2))); 
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11: {
            title: "Welcome Home",
            description: "Welcome to the next stage! Batteries are never spent on Upgrades. Also x1.5 Energy Base.",
            cost: new Decimal(1),
            canAfford() {
                // The player can afford the upgrade if they have enough battery points
                return player.battery.points.gte(this.cost);
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(1)
            },
        },
        12: {
            title: "Oh yeah, these",
            description: "10x boost to Energy Points, slightly boost Energy Upgrade 13's effect.",
            tooltip: "New Formula: Energy Points^0.3",
            cost: new Decimal(2),
            canAfford() {
                return player.battery.points.gte(this.cost);
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(2)
            },
            unlocked() {
                return hasUpgrade('battery', 11);
            },
        },
    },
    tabFormat: [
        "main-display",
        ["display-text", function() {
            return "Your Batteries are boosting Energy Base by x" + format(new Decimal(player.battery.points).pow(0.4).toFixed(2));
        }],
        "resource-display",
        "prestige-button",
        "blank",
        "buyables",
        "upgrades",
    ],
})