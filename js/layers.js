addLayer("achievements", {
    name: "Achievements and Settings", // The name of the layer
    symbol() {return options.emojiSymbols ? "🏆" : "A"}, // The symbol for the layer's node
    position: 0, // Position of the layer in the tree
    row: "side", // Row of the layer in the tree
    color: "#ffe921",
    startData() { 
        return {
            unlocked: true, // Make sure the layer is always visible
        };
    },
    tooltip() {
        return "Achievements and Settings"; // Custom text when you hover over the layer
    },
    layerShown() { return true; }, // Ensures the layer is always visible
    achievements: {
        11: {
            name: "Dawn",
            tooltip: "Buy the second upgrade.",
            done() {return hasUpgrade("energy", 12)},
            unlocked() {return true}
        },
        12: {
            name: "Enhancer",
            tooltip: "Get 10 levels of Enhanced Energy.",
            done() {return getBuyableAmount("energy", 11).gte(10)},
            unlocked() {return true}
        },
        13: {
            name: "Your true start",
            tooltip: "Buy Energy Upgrade 24.",
            done() {return hasUpgrade("energy", 24)},
            unlocked() {return true}
        },
        14: {
            name: "Scaling starter",
            tooltip: "Buy Battery Upgrade 13.",
            done() {return hasUpgrade("battery", 13)},
            unlocked() {return true}
        },
        15: {
            name: "Good luck affording that...",
            tooltip: "Have Enhanced Energy start superscaling.",
            done() {return getBuyableAmount("energy", 11).gte(50)},
            unlocked() {return true}
        },
        16: {
            name: "(softcapped)",
            tooltip: "Have Energy Upgrade 13 softcap.",
            done() {
                if (hasUpgrade('battery', 21)) {
                    return player.points.pow(0.28).gte(250);
                } else if (hasUpgrade('battery', 12)) {
                    return player.points.pow(0.24).gte(250);
                } else {
                    return player.points.pow(0.2).gte(250);
                }
            },
            unlocked() {return true}
        },
        21: {
            name: "Holy s-",
            tooltip: "Bear witness to the great scaling of 20 Batteries.",
            done() {
                return player.battery.points.gte(20)
            },
            unlocked() {return true}
        },
    },
    tabFormat: {
        "Achievements": {
            content: [
                ["display-text", "Achievements won't boost anything, they serve mainly as milestones more-or-less."],
                "blank",
                "achievements",
            ],
        },
        "Time Control": {
            content: [
                ["display-text", '<span style="font-size: 20px;"> DISCLAIMER! </span> <br> These tools are very powerful and should be used only for save recovery!'],
                "blank",
                "clickables"
            ],
        },
    },
    clickables: {
        11: {
            display() { return "Set devSpeed to 100%"; },
            title: "1x",
            canClick() { return true; },
            onClick() { player.devSpeed = new Decimal(1); },
        },
        12: {
            display() { return "Set devSpeed to 1000%"; },
            title: "10x",
            canClick() { return true; },
            onClick() { player.devSpeed = new Decimal(10); },
        },
        13: {
            display() { return "Set devSpeed to 10000%"; },
            title: "100x",
            canClick() { return true; },
            onClick() { player.devSpeed = new Decimal(100); },
        },
        14: {
            display() { return "Set devSpeed to 10000%"; },
            title: "0x",
            canClick() { return true; },
            onClick() { player.devSpeed = new Decimal(0); },
        },
    },
    },
    
);

// Energy Layer

addLayer("energy", {
    name: "Energy", // The name of the layer
    symbol() {return options.emojiSymbols ? "⚡" : "EN"}, // The symbol for the layer's node
    position: 0, // Position of the layer in the tree
    row: 0, // Row of the layer in the tree
    branches: ["battery", "compactenergy"],
    style() {
        return {
            "background-image": "linear-gradient(to top,rgb(117, 84, 21),rgb(138, 130, 20))",
            "background-size": "cover"
        };
    },
    startData() { return {
        unlocked: true,
        points: new Decimal(1), // Starting energy points
        
    }},
    update(diff){
        player.energy.spentTime=new Decimal(player.energy.spentTime).add(diff)
        if (player.energy.points.gt(new Decimal(layers.energy.passivebase).sub(1).times(10))) {
            player.energy.points = new Decimal(layers.energy.passivebase).sub(1).times(10)
        }
      },
    automate() {
        if (player.energy.autobuy1 === true && hasMilestone('battery', 3)) {
            let amt = getBuyableAmount("energy", 11);
            let cost1 = (new Decimal(20).times(new Decimal(amt)))
            let tenfactor = Decimal.floor(new Decimal(amt).divide(new Decimal(10)))
            let cost2 = new Decimal(0.5).times(new Decimal(tenfactor)) 
            let cost3 = new Decimal(2).pow(Decimal.max(0,new Decimal(tenfactor).sub(4)))
            if (new Decimal(new Decimal(240).add(new Decimal(cost1)).times(new Decimal(1).add(new Decimal(cost2))).times(new Decimal(cost3))).lt(layers.energy.passivebase.times(5))) {
                buyBuyable('energy', 11)
            }
        }
        },
    color: "#ebcc34",
    type: "static", // No prestige based on this layer
    resource: "Energy", // The resource produced by this layer
    baseResource: "Energy Points", // What this is based on (could be points or any other resource)
    baseAmount() { return player.points }, // Uses player's points as base amount
    doReset(layer) {
        if (layer !== this.layer) {
            player.energy.spentTime = new Decimal(0)
            layerDataReset(this.layer, ["upgrades", "buyables"]);
            let upgradesToKeep = [24];
            if (hasMilestone('battery', 0)) {
                upgradesToKeep.push(11, 12, 13, 14, 21, 22, 23);
            }
            player[this.layer].upgrades = player[this.layer].upgrades.filter(upg => upgradesToKeep.includes(upg));

            const buyableID = 11;
        if (hasMilestone('battery', 1)) {
            if (player[this.layer].buyables[buyableID]) {
                let currentAmount = new Decimal(player[this.layer].buyables[buyableID]);
                let reducedAmount = currentAmount.sub(10).max(0);
                player[this.layer].buyables[buyableID] = reducedAmount;
            } else {
                player[this.layer].buyables[buyableID] = new Decimal(0);
            }
        } else {
            player[this.layer].buyables[buyableID] = new Decimal(0);
        }
        }  
    },
    passiveGeneration() {
        let passive = new Decimal(0);
        let passivebase = new Decimal(10);

        // passive base

        if (hasUpgrade('energy', 12)) passivebase = passivebase.add(10);
        if (hasUpgrade('energy', 13)) {
            if(player.points.pow(0.2).gte(250)) {
                passivebase = passivebase.add(Decimal.min(250,player.points.pow(0.2))).add(player.points.pow(0.16));
            };
            passivebase = passivebase.add(player.points.pow(0.2));
        } else if (hasUpgrade('battery', 21)) {
            if(player.points.pow(0.28).gte(250)) {
                passivebase = passivebase.add(Decimal.min(250,player.points.pow(0.28))).add(player.points.pow(0.16));
            };
            passivebase = passivebase.add(player.points.pow(0.28));
        } else if (hasUpgrade('battery', 12)) {
            if(player.points.pow(0.24).gte(250)) {
                passivebase = passivebase.add(Decimal.min(250,player.points.pow(0.24))).add(player.points.pow(0.16));
            };
            passivebase = passivebase.add(player.points.pow(0.24));
        }
        if (hasUpgrade('energy', 21)) passivebase = passivebase.times((new Decimal(0.1).times(new Decimal(player.energy.upgrades.length)).add(1)));
        if (hasUpgrade('energy', 22)) passivebase = passivebase.add(10);
        if (hasUpgrade('energy', 24)) passivebase = passivebase.add(7);
        if (hasUpgrade('battery', 13)) passivebase = passivebase.times(new Decimal((Decimal.floor(Decimal.max(2,Decimal.log10(new Decimal(player.energy.points)))))).div(2))
        if (hasMilestone('battery', 5)) {
            passivebase = passivebase.times(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(new Decimal(0.10).times(player.battery.points)), new Decimal(player.energy.spentTime).divide(30)))).add(1));
        } else if (hasUpgrade('battery', 22)) {
            passivebase = passivebase.times(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(new Decimal(0.10).times(player.battery.points)), new Decimal(player.energy.spentTime).divide(90)))).add(1));
        } else if (hasUpgrade('battery', 14)) {
            passivebase = passivebase.times(new Decimal(Decimal.max(0, Decimal.min(1, new Decimal(player.energy.spentTime).divide(180)))).add(1))
        }
        if (hasUpgrade('battery', 24)) {
            passivebase = passivebase.times(new Decimal(1.04).pow(Decimal.floor(Decimal.log10(Decimal.max(1,player.points)))))
        }
        
        passivebase = passivebase.add(layers.energy.buyables[11].effect(getBuyableAmount("energy", 11))); 

        if (player.battery.points.gte(1)) passivebase = passivebase.times(new Decimal(player.battery.points));
        if (hasUpgrade('battery', 11)) passivebase = passivebase.times(1.5);

        passivebase = passivebase.times(layers.compactenergy.buyables[11].effect(getBuyableAmount("compactenergy", 11))); 

        // decay

        let decay = new Decimal(0.10)
        this.decay = decay;

        // passive

        if (hasUpgrade('energy', 11)) passive = new Decimal(passive.add(passivebase.sub(new Decimal(Decimal.max(0,player.energy.points.times(decay))))).sub(1));

        this.passivebase = passivebase;
        return passive;
    },
    upgrades: {
        11: {
            title: "Energy",
            description: "Begin Energy production.",
            tooltip: "Formula: 10 - (Energy * 0.1)",
            cost: new Decimal(1),
        },
        12: {
            title: "More Energy",
            description: "Adds 10 to the Energy base, Energy boosts Energy Points at a reduced rate.",
            tooltip: function() {
                return "Formula: Energy ^ 0.9 <br> Effect: x" + format(new Decimal(player.energy.points).pow(0.9).toFixed(2)) + " boost to Energy Points.";
            },
            cost: new Decimal(90),
            unlocked() {
                return hasUpgrade('energy', 11);
            },
        },
        13: {
            title: "These are useful now",
            description: "Energy Points boost Energy base at a reduced rate. \n Softcaps at 250.",
            tooltip:function() {
                if (hasUpgrade('battery', 21)) {
                    if(player.points.pow(0.28).gte(250)) {
                    return "Formula: 250 [capped] + (EP - 3.665e8 ^ 0.16  <br> Effect: +" + format(new Decimal(250).add(new Decimal(player.points.sub(new Decimal(366500000))).pow(0.16)).toFixed(2)) + " [Softcapped] boost to Energy base."
                    }
                return "Formula: Energy Points ^ 0.28 <br> Effect: +" + format(new Decimal(player.points).pow(0.28).toFixed(2)) + " boost to Energy base.";
                } else if (hasUpgrade('battery', 12)) {
                    if(player.points.pow(0.24).gte(250)) {
                        return "Formula: 250 [capped] + (EP - 9.85e9 ^ 0.16  <br> Effect: +" + format(new Decimal(250).add(new Decimal(player.points.sub(new Decimal(9850000000))).pow(0.16)).toFixed(2)) + " [Softcapped] boost to Energy base."
                    }
                return "Formula: Energy Points ^ 0.24 <br> Effect: +" + format(new Decimal(player.points).pow(0.24).toFixed(2)) + " boost to Energy base.";
                }
                if(player.points.pow(0.2).gte(250)) {
                    return "Formula: 250 [capped] + (EP - 9.85e11 ^ 0.16  <br> Effect: +" + format(new Decimal(250).add(new Decimal(player.points.sub(new Decimal(985000000000))).pow(0.16)).toFixed(2)) + " [Softcapped] boost to Energy base."
                }
                return "Formula: Energy Points ^ 0.2 <br> Effect: +" + format(new Decimal(player.points).pow(0.2).toFixed(2)) + " boost to Energy base.";
                

            },
            cost: new Decimal(190),
            unlocked() {
                return hasUpgrade('energy', 11);
            },
        },
        14: {
            title: "Something new",
            description: "Unlocks an Energy buyable.",
            cost: new Decimal(240),
            unlocked() {
                return hasUpgrade('energy', 11);
            },
        },
        21: {
            title: "Self-Powered",
            description: "Energy Upgrades boost Energy base.",
            tooltip:function() {
                return "Formula: 1 + 0.10 * Upgrades <br> Effect: x" + format(new Decimal(0.1).times(player.energy.upgrades.length).add(1).toFixed(2)) + " boost to Energy base.";
            },
            cost: new Decimal(325),
            unlocked() {
                return hasUpgrade('energy', 14);
            },
        },
        22: {
            title: "Optimizations",
            description: "Multiplies Energy Points by 10 and adds a further 10 to the Energy base.",
            cost: new Decimal(500),
            unlocked() {
                return hasUpgrade('energy', 14);
            },
        },
        23: {
            title: "Back-to-back",
            description: "Doubles Energy Points.",
            cost: new Decimal(600),
            unlocked() {
                return hasUpgrade('energy', 14);
            },
        },
        24: {
            title: "The Beginning",
            description: "Adds 7 to Energy base, reveals a new feature.",
            cost: new Decimal(920),
            unlocked() {
                if (hasUpgrade('battery', 11)) return (hasUpgrade('battery', 11))
                return (hasUpgrade('energy', 14))
            },
        },
    },
    buyables: {
        11: {
            title: "Enhanced Energy",
            cost(x) {
                let amt = getBuyableAmount("energy", 11);
                let cost1 = (new Decimal(20).times(new Decimal(x)))
                let tenfactor = Decimal.floor(new Decimal(amt).divide(new Decimal(10)))
                let cost2 = new Decimal(0.5).times(new Decimal(tenfactor)) 
                let cost3 = new Decimal(2).pow(Decimal.max(0,new Decimal(tenfactor).sub(4)))
                return new Decimal(240).add(new Decimal(cost1)).times(new Decimal(1).add(new Decimal(cost2))).times(new Decimal(cost3)).toFixed(2)

            },
            effect(x) {
                if (hasUpgrade('battery', 23)) {return new Decimal(x).add(1).times(new Decimal(player.battery.points).pow(0.1));}
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
            display(x) { 
                let amt = getBuyableAmount("energy", 11);
                let amt2 = amt
                if (hasUpgrade('battery', 23)) {amt2 = amt.times(new Decimal(player.battery.points).pow(0.1))}
                let tenfactor = Decimal.floor(new Decimal(amt).divide(new Decimal(10)))
                let cost2 = new Decimal(0.5).times(new Decimal(tenfactor))
                let cost3 = new Decimal(2).pow(Decimal.max(0,new Decimal(tenfactor).sub(4)))
                if (amt.gte(50)) { 
                    return 'Adds +1.00 to Energy base.<br><span style="font-size: 15px;">Current Effect: +' + format(new Decimal(amt2).toFixed(2)) + ' to Energy base.<br>Cost: ' + format(this.cost(amt)) + '</span><br>Bought: ' + format(amt) + '<br><br><span style="font-size: 10px;">Buyable scaling starts at 10!<br>Superscaling starts at 50!</span><br>Current scaling: ' + format(new Decimal(1).add(new Decimal(cost2)).times(new Decimal(cost3)).toFixed(2));
                } else if (amt.gte(10)) {
                    return 'Adds +1.00 to Energy base.<br><span style="font-size: 15px;">Current Effect: +' + format(new Decimal(amt2).toFixed(2)) + ' to Energy base.<br>Cost: ' + format(this.cost(amt)) + '</span><br>Bought: ' + format(amt) + '<br><br><span style="font-size: 15px;">Buyable scaling starts at 10!</span><br>Current scaling: ' + format(new Decimal(1).add(new Decimal(cost2)).toFixed(2));
                } return 'Adds +1.00 to Energy base.<br><span style="font-size: 15px;">Current Effect: +' + format(new Decimal(amt2).toFixed(2)) + ' to Energy base.<br>Cost: ' + format(this.cost(amt)) + '</span><br>Bought: ' + format(amt)
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
            return "Your Energy Base is " + format(new Decimal(layers.energy.passivebase).toFixed(2));
        }],
        ["display-text", function() {
            return "Currently at " + format(new Decimal(player.energy.points.div(layers.energy.passivebase).times(10)).toFixed(2)) + "% of your Energy cap, losing " + format(new Decimal(player.energy.points.times(new Decimal(layers.energy.decay))).toFixed(2)) + " Energy per second";
        }],
        "blank",
        "buyables",
        "upgrades",
    ],
});

// Battery Layer

addLayer("battery", {
    startData() { return {                  // startData is a function that returns default data for a layer.               // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        autobuy1: false,
        auto: false 
    }},
    symbol() {return options.emojiSymbols ? "🔋" : "B"},
    color: "#727180",                       // The color for this layer, which affects many elements.
    resource: "Batteries",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    baseResource: "Energy",
    branches: ["energy"],
    style() {
        return {
            "background-image": "linear-gradient(to top,rgb(33, 33, 36),rgb(63, 59, 73))",
            "background-size": "cover"
        };
    },
    autoPrestige() {
        if (player.battery.auto === true && hasMilestone('battery', 1))
            return true
    },
    baseAmount() {return player.energy.points},  
    unlocked() {
        return hasUpgrade('energy', 24) && player.energy.points.gte(1000);
    },
    onPrestige() {
        
        doReset("energy");
    },

    requires: new Decimal(1000),              // The amount of the base needed to  gain 1 of the prestige currency. // Also the amount required to unlock the layer.
    type: "static",                        // Determines the formula used for calculating prestige currency.
    getNextAt() {
        let amt = getBuyableAmount('compactenergy', 12);
        let b = player.battery.points
        return new Decimal(1000).add(new Decimal(800).times(new Decimal(b).sub(amt).max(1).pow(new Decimal(2).add(Decimal.floor(new Decimal(b.sub(amt).max()).divide(20)))))); 
    },

    layerShown() { return hasUpgrade('energy', 24) },          // Returns a bool for if this layer's node should be visible in the tree.

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
                return player.battery.points = player.battery.points.add(this.cost)
            },
        },
        12: {
            title: "Musn't forget EP",
            description: "Triple Energy Points, slightly boost Energy Upgrade 13's effect.",
            tooltip: "New Formula: Energy Points^0.24",
            cost: new Decimal(2),
            canAfford() {
                return player.battery.points.gte(this.cost);
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
            unlocked() {
                return hasUpgrade('battery', 11);
            },
        },
        13: {
            title: "A Small Volt",
            description: "Energy is boosted by Energy's magnitude.",
            tooltip:function() {
                return "Formula: ⌊log10(energy)⌋/2 <br> Effect: x" + format(new Decimal((Decimal.floor(Decimal.max(2,Decimal.log10(new Decimal(player.energy.points)))))).div(2)) + " boost to Energy base.";
            },
            cost: new Decimal(3),
            canAfford() {
                return player.battery.points.gte(this.cost);
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
            unlocked() {
                return hasUpgrade('battery', 12);
            },
        },
        14: {
            title: "Timed Charge",
            description: "Energy base is boosted by time spent in this Battery reset. [Capped at x2.00]",
            tooltip:function() {
                if (hasMilestone('battery', 5)) {
                return "Formula: (1 + Time / 30) <br> Effect: x" + format(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(new Decimal(0.10).times(player.battery.points)), new Decimal(player.energy.spentTime).divide(30)))).add(1)) + " boost to Energy base.";
                } else if (hasUpgrade("battery", 22)) {
                return "Formula: (1 + Time / 90) <br> Effect: x" + format(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(new Decimal(0.10).times(player.battery.points)), new Decimal(player.energy.spentTime).divide(90)))).add(1)) + " boost to Energy base.";
            }
                return "Formula: (1 + Time / 180) <br> Effect: x" + format(new Decimal(Decimal.max(0, Decimal.min(1, new Decimal(player.energy.spentTime).divide(180)))).add(1)) + " boost to Energy base.";
        },
            cost: new Decimal(4),
            canAfford() {
                return player.battery.points.gte(this.cost);
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
            unlocked() {
                return hasUpgrade('battery', 13);
            },
        },
        21: {
            title: "Battery-powered EP",
            description: "Batteries now directly boost Energy Points. Improves Energy Upgrade 13 again.",
            tooltip:function() {
                return "New Formula [13]: Energy Points ^ 0.28 <br> Effect [EP]: x" + format(new Decimal(player.battery.points)) + " boost to Energy Points.";
            },
            cost: new Decimal(6),
            canAfford() {
                return player.battery.points.gte(this.cost);
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
            unlocked() {
                return hasUpgrade('battery', 14);
            },
        },
        22: {
            title: "Self-powered Time",
            description: "Batteries raise the cap of Battery Upgrade 14, improves it's formula, and unlocks Battery Milestones.",
            tooltip:function() {
                return "Formula: 0.10 * Batteries <br> Effect: +" + format(new Decimal(0.1).times(player.battery.points).toFixed(2)) + " to Battery Upgrade 14 cap.";
            },
            cost: new Decimal(9),
            canAfford() {
                return player.battery.points.gte(this.cost);
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
            unlocked() {
                return hasUpgrade('battery', 21);
            },
        },
        23: {
            title: "Further Enhanced",
            description: "Batteries increase the effect of Enhanced Energy at a reduced rate.",
            tooltip:function() {
                return "Formula: Batteries ^ 0.1 <br> Effect: +" + format(new Decimal(player.battery.points).pow(0.1).sub(1).toFixed(2)) + " to Enhanced Energy effect.";
            },
            cost: new Decimal(13),
            canAfford() {
                return player.battery.points.gte(this.cost);
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
            unlocked() {
                return hasUpgrade('battery', 22);
            },
        },
        24: {
            title: "Pointy",
            description: "Energy Points boost Energy Base by magnitude.",
            tooltip:function() {
                return "Formula: 1.04 ^ ⌊log10(Energy Points)⌋ Effect: x" + format(new Decimal(1.04).pow(new Decimal(Decimal.floor(Decimal.log10(Decimal.max(1,player.points))))).toFixed(2)) + " to Energy Base.";
            },
            cost: new Decimal(16),
            canAfford() {
                return player.battery.points.gte(this.cost);
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
            unlocked() {
                return hasUpgrade('battery', 23);
            },
        },
    },
    milestones: {
        0: {
            requirementDescription: "11 Batteries",
            effectDescription: "Energy Upgrades are no longer reset on Battery.",
            done() {
                return player.battery.points.gte(11)
            },
            unlocked() {
                return hasUpgrade('battery', 22)
            },
        },
        1: {
            requirementDescription: "12 Batteries",
            effectDescription: "Only lose 10 levels of Enhanced Energy on Battery.",
            done() {
                return player.battery.points.gte(12)
            },
            unlocked() {
                return hasUpgrade('battery', 22)
            },
        },
        2: {
            requirementDescription: "15 Batteries",
            effectDescription: "Unlock Auto Battery. [Your Energy will still be reset!]",
            toggles: [["battery", "auto"]],
            done() {
                return player.battery.points.gte(15)
            },
            unlocked() {
                return hasUpgrade('battery', 22)
            },
        },
        3: {
            requirementDescription: "18 Batteries",
            effectDescription: "Autobuys Enhanced Energy to a threshold of 50% of Energy cap.",
            toggles: [["energy", "autobuy1"]],
            done() {
                return player.battery.points.gte(18)
            },
            unlocked() {
                return hasUpgrade('battery', 22)
            },
        },
        4: {
            requirementDescription: "20 Batteries",
            effectDescription: "Unlock Compact Energy.",
            done() {
                return player.battery.points.gte(20)
            },
            unlocked() {
                return hasMilestone('battery', 3)
            },
        },
        5: {
            requirementDescription: "30 Batteries",
            effectDescription: "Battery Upgrade 14's formula is improved again.",
            done() {
                return player.battery.points.gte(30)
            },
            unlocked() {
                return hasMilestone('battery', 4)
            },
        },
    },
    tabFormat: [
        "main-display",
        ["display-text", function() {
            return "Your Batteries are boosting Energy Base by x" + format(new Decimal(player.battery.points).pow(0.4).toFixed(2));
        }],
        ["display-text", function() {
            let amt = getBuyableAmount('compactenergy', 12);
            return "Battery cost scales by +^1 per 20 Batteries you have! They are currently ^" + format(new Decimal(2).add(Decimal.floor(new Decimal(new Decimal(player.battery.points.max(1)).sub(amt)).divide(20))));
        }],
        "resource-display",
        "prestige-button",
        "blank",
        "buyables",
        "upgrades",
        ["display-text", function() {
            if (hasUpgrade('battery', 22)) {
                return '<span style="font-size: 30px;"> Battery Milestones </span>'
            }
            return '';
        }],
        "blank",
        "milestones",
    ],
})

// compact energy

addLayer("compactenergy", {
    startData() { return {                  // startData is a function that returns default data for a layer.               // You can add more variables here to add them to your layer.
        points: new Decimal(0),
    }},
    symbol() {return options.emojiSymbols ? "📦" : "cEN"},
    color: "#e8a22a",                       // The color for this layer, which affects many elements.
    resource: "Compact Energy",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    baseResource: "Energy",
    branches: ["energy"],
    style() {
        return {
            "background-image": "linear-gradient(to top,rgb(93, 54, 19),rgb(150, 89, 25))",
            "background-size": "cover"
        };
    },
    update(diff){
        let amt1 = getBuyableAmount('compactenergy', 11);
        let amt2 = getBuyableAmount('compactenergy', 12);
        let truecompactenergy = player.compactenergy.total
        player.compactenergy.truecompactenergy = truecompactenergy
    },
    canBuyMax() {
        return true
    },
    baseAmount() {return player.energy.points},  
    unlocked() {
        return hasMilestone('battery', 4);
    },
    canReset(){return this.getResetGain().gte(1)},
    onPrestige() {
            let amt1 = getBuyableAmount('compactenergy', 11);
            let amt2 = getBuyableAmount('compactenergy', 12);
            player.compactenergy.points = player.compactenergy.points.add(amt1).add(amt2)
            setBuyableAmount("compactenergy", 11, new Decimal(0));
            setBuyableAmount("compactenergy", 12, new Decimal(0));
            doReset("energy");
    },
    requires() {return new Decimal(500000)},
    getResetGain() {
        totalResetGain = Decimal.max(player.compactenergy.truecompactenergy,Decimal.floor(new Decimal(player.energy.points).div(500000)))
        hundredfactor = Decimal.floor(Decimal.log10(Decimal.max(0,totalResetGain.sub(player.compactenergy.truecompactenergy))).div(2))
        return Decimal.max(0,totalResetGain.sub(player.compactenergy.truecompactenergy)).divide(Decimal.max(1,new Decimal(10).pow(hundredfactor)))
    },  
    getNextAt() {
        totalResetGain = Decimal.max(player.compactenergy.truecompactenergy,Decimal.floor(new Decimal(player.energy.points).div(500000)))
        hundredfactor = Decimal.floor(Decimal.log10(Decimal.max(0,totalResetGain.sub(player.compactenergy.truecompactenergy))).div(2))
        return new Decimal(500000).times(new Decimal(1).add(totalResetGain)).times(Decimal.max(1,new Decimal(10).pow(hundredfactor)))
    },
    
    type: "static",

    buyables: {
        respec() {
            let amt1 = getBuyableAmount('compactenergy', 11);
            let amt2 = getBuyableAmount('compactenergy', 12);
            player.compactenergy.points = player.compactenergy.points.add(amt1).add(amt2)
            setBuyableAmount("compactenergy", 11, new Decimal(0));
            setBuyableAmount("compactenergy", 12, new Decimal(0));
            doReset("energy");
            player.compactenergy.points = player.compactenergy.total
        },
        respecText() {
            return 'Respec Compact Energy buyables. \n This forces a Compact Energy reset!'
        },
        showRespec() {
            return true
            
        },
        respecMessage: ".",
        11: {
            title: "Compacted Energy",
            cost() {
                return new Decimal(1)

            },
            effect() {
                let amt = getBuyableAmount('compactenergy', 11);
                return new Decimal(0.10).times(amt).add(1)
            },
            canAfford() { 
                return player.compactenergy.points.gte(1);
            },
            buy() {
                let amt = getBuyableAmount('compactenergy', 11);
                player.compactenergy.points = player.compactenergy.points.sub(1);
                setBuyableAmount("compactenergy", 11, amt.add(1));
            },
            display(x) { 
                let amt = getBuyableAmount("compactenergy", 11);
                    return 'Boosts Energy Base and Energy Points by +0.10x.<br><span style="font-size: 15px;">Current Effect: x' + format(new Decimal(0.10).times(amt).add(1).toFixed(2)) + ' to Energy base and Energy Points. <br>Cost: 1 Compact Energy </span><br>Bought: ' + format(amt);
            },
            unlocked() {
                return true
            },
        },
        12: {
            title: "Compacted Batteries",
            cost() {
                return new Decimal(1)

            },
            effect() {
                let amt = getBuyableAmount('compactenergy', 12);
                return new Decimal(amt).add(1);
            },
            canAfford() { 
                return player.compactenergy.points.gte(1);
            },
            buy() {
                let amt = getBuyableAmount('compactenergy', 12);
                player.compactenergy.points = player.compactenergy.points.sub(1);
                setBuyableAmount("compactenergy", 12, amt.add(1));
            },
            display() { 
                let amt = getBuyableAmount("compactenergy", 12);
                    return 'Batteries scale +1.00 later.,br.<span style="font-size: 15px;">Current Effect: Batteries scale ' + format(new Decimal(1).times(amt).toFixed(2)) + ' later. <br>Cost: 1 Compact Energy </span><br>Bought: ' + format(amt);
            },
            unlocked() {
                return true
            },
        },
    },

    clickables: {
        11: {
            display() {return '<span style="font-size: 20px;">Buy 25%</span>'},
            canClick() {return true}, 
            onClick() {let amt = getBuyableAmount('compactenergy', 11);
                player.compactenergy.points = new Decimal(player.compactenergy.points).sub(player.compactenergy.total.div(4));
                setBuyableAmount("compactenergy", 11, amt.add(new Decimal(player.compactenergy.total).times(0.25)));},
                unlocked() {return true}
        },
        12: {
            display() {return '<span style="font-size: 20px;">Buy 25%</span>'},
            canClick() {return true}, 
            onClick() {let amt = getBuyableAmount('compactenergy', 12);
                player.compactenergy.points = new Decimal(player.compactenergy.points).sub(player.compactenergy.total.div(4));
                setBuyableAmount("compactenergy", 12, amt.add(new Decimal(player.compactenergy.total).times(0.25)));},
            unlocked() {return true}
        }

    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        "buyables",
        "clickables",
        "upgrades",
    ],

    layerShown() {return hasMilestone('battery', 4)},          // Returns a bool for if this layer's node should be visible in the tree.
}
)   