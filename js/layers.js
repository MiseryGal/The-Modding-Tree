addLayer("achievements", {
    name: "Achievements and Settings", // The name of the layer
    symbol() {return options.emojiSymbols ? "🏆" : "A"}, // The symbol for the layer's node
    position: 0, // Position of the layer in the tree
    row: "side", // Row of the layer in the tree
    color: "#ffe921",
    startData() { 
        return {
            unlocked: true, // Make sure the layer is always visible
            doomsday: new Decimal(0)
        };
    },
    unlocked() {return true},
    update(diff) {
        if (player.achievements.doomsday.eq(1) && !player.resetTriggered) {
            player.resetTriggered = true; // Prevent repeated resets
    
            // Reset player variables
            player.points = new Decimal(0);
            player.energy.points = new Decimal(0);
            player.battery.points = new Decimal(0);
            player.compactenergy.points = new Decimal(0);
    
            // Perform layer resets
            doReset('energy');
            doReset('battery');
            doReset('compactenergy');
            layerDataReset('energy')
            layerDataReset('battery')
            layerDataReset('compactenergy')
        }
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
        22: {
            name: "Compressor",
            tooltip: "Acquire 10 Compact Energy.",
            done() {
                return player.compactenergy.points.gte(10)
            },
            unlocked() {return true}
        },
        23: {
            name: "Boosted",
            tooltip: "Buy Energy Upgrade 34.",
            done() {
                return hasUpgrade('energy', 34)
            },
            unlocked() {return true}
        },
        24: {
            name: "The Fifth Row.",
            tooltip: "Buy Energy Upgrade 35...",
            done() {
                return hasUpgrade('energy', 35)
            },
            unlocked() {return true}
        },
        25: {
            name: "Time is a concept",
            tooltip: "Get Battery Milestone 11",
            done() {
                return hasMilestone('battery', 10)
            },
            unlocked() {return true}
        },
        26: {
            name: "Doomsday...",
            tooltip: "Erase everything.",
            done() {
                return player.achievements.doomsday.eq(1)
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
            display() { return "Set devSpeed to 0%"; },
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
        if (player.battery.overclocktimer.lte(0)) {
        if (player.energy.points.gt(new Decimal(layers.energy.passivebase).sub(1).times(10))) {
            player.energy.points = new Decimal(layers.energy.passivebase).sub(1).times(10) }

        }
    },
    automate() {
        if (player.energy.autobuy1 === true && hasMilestone('battery', 7)) {
            let amt = getBuyableAmount("energy", 11);
            let cost1 = (new Decimal(20).times(new Decimal(amt)))
            let tenfactor = Decimal.floor(new Decimal(amt).divide(new Decimal(10)))
            let cost2 = new Decimal(0.5).times(new Decimal(tenfactor)) 
            let cost3 = new Decimal(2).pow(Decimal.max(0,new Decimal(tenfactor).sub(4)))
            if (new Decimal(new Decimal(240).add(new Decimal(cost1)).times(new Decimal(1).add(new Decimal(cost2))).times(new Decimal(cost3))).lte(player.energy.points)) {
                setBuyableAmount("energy", 11, amt.add(1))
            }
        } else if (player.energy.autobuy1 === true && hasMilestone('battery', 3)) {
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
                upgradesToKeep.push(11, 12, 13, 14, 21, 22, 23, 31, 32, 33, 34, 35);
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
        if (hasUpgrade('energy', 21)) {
            passivebase = passivebase.times((new Decimal(0.1).times(new Decimal(player.energy.upgrades.length)).add(1))); 

        } else if (hasUpgrade('energy', 21)) {
            passivebase = passivebase.times((new Decimal(1).times(new Decimal(player.energy.upgrades.length)).add(1))); 
        }
        if (hasUpgrade('energy', 22)) passivebase = passivebase.add(10);
        if (hasUpgrade('energy', 24)) passivebase = passivebase.add(7);
        if (hasUpgrade('battery', 13)) passivebase = passivebase.times(new Decimal(1).times(Decimal.floor(Decimal.max(0,Decimal.log10(new Decimal(player.energy.points))))).div(2).add(1))
            let bonuscap = new Decimal(0.10).times(player.battery.points)
                if (hasUpgrade('energy', 32)) {bonuscap = new Decimal(0.50).times(player.battery.points)}
        if (hasMilestone('battery', 10)) {
            passivebase = passivebase.times(new Decimal(Decimal.max(0, bonuscap)));
        } else if (hasMilestone('battery', 9)) {
            passivebase = passivebase.times(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(bonuscap), new Decimal(player.energy.spentTime)))).add(1));
        } else if (hasMilestone('battery', 6)) {
            passivebase = passivebase.times(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(bonuscap), new Decimal(player.energy.spentTime).divide(30)))).add(1));
        } else if (hasUpgrade('battery', 22)) {
            passivebase = passivebase.times(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(bonuscap), new Decimal(player.energy.spentTime).divide(90)))).add(1));
        } else if (hasUpgrade('battery', 14)) {
            passivebase = passivebase.times(new Decimal(Decimal.max(0, Decimal.min(1, new Decimal(player.energy.spentTime).divide(180)))).add(1))
        }
        if (hasUpgrade('energy', 34) && (hasUpgrade('battery', 24))) {
            passivebase = passivebase.times(new Decimal(1.13).pow(Decimal.floor(Decimal.log10(Decimal.max(1,player.points)))))
        } else if (hasUpgrade('battery', 24)) {
            passivebase = passivebase.times(new Decimal(1.04).pow(Decimal.floor(Decimal.log10(Decimal.max(1,player.points)))))
        }
        
        passivebase = passivebase.add(layers.energy.buyables[11].effect(getBuyableAmount("energy", 11))); 

        if (player.battery.points.gte(1)) passivebase = passivebase.times(new Decimal(player.battery.points));
        if (hasUpgrade('battery', 11)) passivebase = passivebase.times(1.5);

        passivebase = passivebase.times(layers.compactenergy.buyables[11].effect(getBuyableAmount("compactenergy", 11))); 
        if (passivebase.gte(1.79e308)) passivebase = new Decimal(1.79e307)
        // decay

        let decay = new Decimal(0.10)
        this.decay = decay;
        if (player.battery.overclocktimer.gt(0))
            decay = new Decimal(0)

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
        31: {
            title: "Booster I",
            description: "Boosts Battery Upgrade 21",
            tooltip:function() {
                return "New Formula: Batteries ^ 2 <br> Effect: x" + format(new Decimal(player.battery.points).pow(2)) + " boost to Energy Points.";
            },
            cost: new Decimal(1e7),
            unlocked() {
                return (hasUpgrade('energy', 21) && hasMilestone('battery', 5))
            },
        },
        32: {
            title: "Booster II",
            description: "Boosts Battery Upgrade 22",
            tooltip:function() {
                return " New Formula: 0.5 * Batteries <br> Effect: +" + format(new Decimal(0.5).times(player.battery.points).toFixed(2)) + " to Battery Upgrade 14 cap.";
            },
            cost: new Decimal(2e8),
            unlocked() {
                return (hasUpgrade('energy', 21) && hasMilestone('battery', 5))
            },
        },
        33: {
            title: "Booster III",
            description: "Boosts Battery Upgrade 23",
            tooltip:function() {
                return "Formula: Batteries ^ 0.16 <br> Effect: +" + format(new Decimal(player.battery.points).pow(0.16).sub(1).toFixed(2)) + " to Enhanced Energy effect.";
            },
            cost: new Decimal(5e10),
            unlocked() {
                return (hasUpgrade('energy', 21) && hasMilestone('battery', 5))
            },
        },
        34: {
            title: "Booster IV",
            description: "Boosts Battery Upgrade 24",
            tooltip:function() {
                return "Formula: 1.13 ^ ⌊log10(Energy Points)⌋ Effect: x" + format(new Decimal(1.13).pow(new Decimal(Decimal.floor(Decimal.log10(Decimal.max(1,player.points))))).toFixed(2)) + " to Energy Base.";
            },
            cost: new Decimal(7.5e10),
            unlocked() {
                return (hasUpgrade('energy', 21) && hasMilestone('battery', 5))
            },
        },
        35: {
            title: "Booster V..?",
            description: "Boosts Energy Upgrade 21 and..?",
            tooltip:function() {
                return "Formula: 1 + 1 * Upgrades <br> Effect: x" + format(new Decimal(1).times(player.energy.upgrades.length).add(1).toFixed(2)) + " boost to Energy base.";
            },
            cost: new Decimal(2.5e12),
            unlocked() {
                return (hasUpgrade('energy', 34) && hasMilestone('battery', 5))
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
                if (hasUpgrade('energy', 33) && (hasUpgrade('battery', 23))) {return new Decimal(x).add(1).times(new Decimal(player.battery.points).pow(0.16));}
                else if (hasUpgrade('battery', 23)) {return new Decimal(x).add(1).times(new Decimal(player.battery.points).pow(0.1));}
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
                if (hasUpgrade('energy', 33) && hasUpgrade('battery', 23)) {amt2 = amt.times(new Decimal(player.battery.points).pow(0.16))}
                else if (hasUpgrade('battery', 23)) {amt2 = amt.times(new Decimal(player.battery.points).pow(0.1))}
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
        if (player.achievements.doomsday.eq(1)) {return false}
return true; // Makes sure the layer is visible
    },
    tabFormat: [
        "main-display",
        "resource-display",
        ["display-text", function() {
            return "Your Energy Base is " + format(new Decimal(layers.energy.passivebase).toFixed(2));
        }],
        ["display-text", function() 
            { if (player.battery.overclocktimer.gt(0))
                return "Currently at " + format(new Decimal(player.energy.points.div(layers.energy.passivebase).times(10)).toFixed(2)) + "% of your Energy cap. Energy is Overclocked! " + format(player.battery.overclocktimer) + " seconds left."
            else return "Currently at " + format(new Decimal(player.energy.points.div(layers.energy.passivebase).times(10)).toFixed(2)) + "% of your Energy cap, losing " + format(new Decimal(player.energy.points.times(new Decimal(layers.energy.decay))).toFixed(2)) + " Energy per second";
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
        auto: false,
        rgb1: new Decimal(0),
        rgb2: new Decimal(255),
        overclocktimer: new Decimal(0),
        overclockcooldown: new Decimal(10)
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
    update(diff) {
        // If direction doesn't exist yet, initialize it
        if (!player.battery.rgb1Direction) player.battery.rgb1Direction = 1; // 1 for increasing, -1 for decreasing
        if (!player.battery.rgb2Direction) player.battery.rgb2Direction = 1;
    
        // Update rgb1
        player.battery.rgb1 = player.battery.rgb1.add(diff * 50 * player.battery.rgb1Direction);
        if (player.battery.rgb1.gt(255)) {
            player.battery.rgb1 = new Decimal(255); // Cap at 255
            player.battery.rgb1Direction = -1; // Reverse direction
        }
        if (player.battery.rgb1.lt(0)) {
            player.battery.rgb1 = new Decimal(0); // Cap at 0
            player.battery.rgb1Direction = 1; // Reverse direction
        }
    
        // Update rgb2
        player.battery.rgb2 = player.battery.rgb2.add(diff * 50 * player.battery.rgb2Direction);
        if (player.battery.rgb2.gt(255)) {
            player.battery.rgb2 = new Decimal(255); // Cap at 255
            player.battery.rgb2Direction = -1; // Reverse direction
        }
        if (player.battery.rgb2.lt(0)) {
            player.battery.rgb2 = new Decimal(0); // Cap at 0
            player.battery.rgb2Direction = 1; // Reverse direction
        }

        player.battery.overclockcooldown = player.battery.overclockcooldown.sub(diff)
        player.battery.overclocktimer = player.battery.overclocktimer.sub(diff)

        if (this.autoPrestige()) {
            let energy = player.energy.points;
            let amt = getBuyableAmount('compactenergy', 12);
            let b = player.battery.points
            let cost = new Decimal(1000).add(new Decimal(800).times(new Decimal(b).sub(amt).max(0).pow(new Decimal(2).add(Decimal.floor(new Decimal(b.sub(amt).max()).divide(20))))
                )
            );
            if (player.battery.points.lt(amt)) {player.battery.points = amt}
            if (player.energy.points.gte(cost)) player.battery.points = player.battery.points.add(1)
        }
    },
    autoPrestige() {
        if (player.battery.auto === true && hasMilestone('battery', 1))
            return true
    },
    canBuyMax() {if (hasMilestone('battery', 8))
        return true},
    resetsNothing(){if (hasMilestone('battery', 8))
        return true},
    baseAmount() {return player.energy.points},  
    unlocked() {
        return hasUpgrade('energy', 24) && player.energy.points.gte(1000);
    },
    onPrestige() {
    },

    requires: new Decimal(1000),              // The amount of the base needed to  gain 1 of the prestige currency. // Also the amount required to unlock the layer.
    type: "static",                        // Determines the formula used for calculating prestige currency.
    getNextAt() {
        let amt = getBuyableAmount('compactenergy', 12);
        let b = player.battery.points
        return new Decimal(1000).add(new Decimal(800).times(new Decimal(b).sub(amt).max(0).pow(new Decimal(2).add(Decimal.floor(new Decimal(b.sub(amt).max()).divide(20)))))); 
    },

    layerShown() {if (player.achievements.doomsday.eq(1)) {return false}
        else return hasUpgrade('energy', 24) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {
            key: "o", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "O: Use Overclock", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() {if (player.battery.overclockcooldown.lte(0) && (player.battery.overclocktimer.lte(0)))
                player.battery.overclocktimer = new Decimal(10)
                player.battery.overclockcooldown = player.battery.overclocktimer.times(2)
            },
            unlocked() {return hasUpgrade('energy', 35)} // Determines if you can use the hotkey, optional
        }
    ],
    clickables: {
        11: {
            display() {if (layers.energy.passivebase.gte(1.79e307)) return '<span style="font-size: 20px;">Overclock</span><br><span style="font-size: 13px;">Break Infinity.</span>'
                else return '<span style="font-size: 20px;">Overclock</span><br><span style="font-size: 13px;">Temporarily gets rid of decay and Energy hardcap.</span>'},
            canClick() { if (layers.energy.passivebase.gte(1.79e307)) return player.energy.points.gte(1.79e308)
                else return player.battery.overclockcooldown.lte(0)},
            onClick() {if (layers.energy.passivebase.gte(1.79e307)) {
                player.achievements.doomsday = new Decimal(1)
            }
                else {player.battery.overclocktimer = new Decimal(10)
                player.battery.overclockcooldown = player.battery.overclocktimer.times(2)}
            },
            unlocked() {return hasUpgrade('energy', 35)},
            style() {
                let rgb1 = player.battery.rgb1; // Example: fluctuating value
                let rgb2 = player.battery.rgb2; // Example: fluctuating value
                if (layers.energy.passivebase.gte(1.79e307)) return {
                    "height": "120px !important",
                    "width": "120px !important",
                    "background-image": `radial-gradient(rgb(255, ${rgb1}, ${rgb1}), rgb(255, ${rgb2}, ${rgb2}))`,
                    "color": "#751d19",
                    "font-weight": "bold",
                    "class": "upgBig",
                };
                else return {
                    "height": "120px !important",
                    "width": "120px !important",
                    "background-image": `radial-gradient(rgb(${rgb1}, ${rgb1}, ${rgb1}), rgb(${rgb2}, ${rgb2}, ${rgb2}))`,
                    "color": "#ffffff",
                    "font-weight": "bold",
                    "class": "upgBig",
                };
            },
            
        },
    },
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
                return "Formula: ⌊log10(energy)⌋/2 <br> Effect: x" + format(new Decimal(new Decimal(1).times(Decimal.max(0,Decimal.floor(Decimal.log10(new Decimal(player.energy.points)))).div(2)))) + " boost to Energy base.";
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
                let bonuscap = new Decimal(0.10).times(player.battery.points)
                if (hasUpgrade('energy', 32)) {bonuscap = new Decimal(0.50).times(player.battery.points)}
                if (hasMilestone('battery', 10)) {
                    return "Formula: Time <br> Effect: x" + format(new Decimal(Decimal.max(0, bonuscap))) + " boost to Energy base.";
                    }
                else if (hasMilestone('battery', 9)) {
                return "Formula: (1 + Time) <br> Effect: x" + format(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(bonuscap), new Decimal(player.energy.spentTime)))).add(1)) + " boost to Energy base.";
                } else if (hasMilestone('battery', 6)) {
                return "Formula: (1 + Time / 30) <br> Effect: x" + format(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(bonuscap), new Decimal(player.energy.spentTime).divide(30)))).add(1)) + " boost to Energy base.";
                } else if (hasUpgrade("battery", 22)) {
                return "Formula: (1 + Time / 90) <br> Effect: x" + format(new Decimal(Decimal.max(0, Decimal.min(new Decimal(1).add(bonuscap), new Decimal(player.energy.spentTime).divide(90)))).add(1)) + " boost to Energy base.";
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
            requirementDescription: "21 Batteries",
            effectDescription: "Unlock more Energy Upgrades.",
            done() {
                return player.battery.points.gte(21)
            },
            unlocked() {
                return hasMilestone('battery', 4)
            },
        },
        6: {
            requirementDescription: "30 Batteries",
            effectDescription: "Battery Upgrade 14's formula is improved again.",
            done() {
                return player.battery.points.gte(30)
            },
            unlocked() {
                return hasMilestone('battery', 5)
            },
        },
        7: {
            requirementDescription: "140 Batteries",
            effectDescription: "Enhanced Energy autobuyer now doesn't spend, works at 100%",
            done() {
                return player.battery.points.gte(140)
            },
            unlocked() {
                return hasMilestone('battery', 6)
            },
        },
        8: {
            requirementDescription: "200 Batteries",
            effectDescription: "Battery autobuyer now doesn't spend",
            done() {
                return player.battery.points.gte(200)
            },
            unlocked() {
                return hasMilestone('battery', 7)
            },
        },
        9: {
            requirementDescription: "550 Batteries",
            effectDescription: "Battery Upgrade 14's formula is no longer divided",
            done() {
                return player.battery.points.gte(550)
            },
            unlocked() {
                return hasMilestone('battery', 8)
            },
        },
        10: {
            requirementDescription: "1e6 Batteries",
            effectDescription: "Battery Upgrade 14 is instantaneous.",
            done() {
                return player.battery.points.gte(1e6)
            },
            unlocked() {
                return hasMilestone('battery', 9)
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
        "clickables",
        ["display-text", function() {
            if (hasUpgrade('energy', 35)) {
            if (player.battery.overclocktimer.gt(0))
            return format(player.battery.overclocktimer) + '<br> Active'
            else return format(Decimal.max(0,player.battery.overclockcooldown)) + '<br> Inactive'
        }
        }],
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
            player.compactenergy.points = player.compactenergy.total
            setBuyableAmount("compactenergy", 11, new Decimal(0));
            setBuyableAmount("compactenergy", 12, new Decimal(0));
            doReset("energy");
    },
    requires() {return new Decimal(500000)},
    getResetGain() {
        let totalResetGain = Decimal.max(0,Decimal.floor(new Decimal(player.energy.points).div(500000))).sub(player.compactenergy.total)
        let softcapGain = Decimal.floor(Decimal.log10(new Decimal(totalResetGain)).div(2))
        let segmentedGain = Decimal.max(1,new Decimal(10).times(new Decimal(10).pow(softcapGain)))
        let finalGain = Decimal.max(0,totalResetGain).divide(Decimal.max(1,new Decimal(10).pow(softcapGain)))
        if (segmentedGain.eq(10)) {return finalGain}
        else if (segmentedGain.eq(1)) {return finalGain}
        return new Decimal(finalGain).add(segmentedGain)
    },  
    getNextAt(x) {
        let totalResetGain = Decimal.max(0,Decimal.floor(new Decimal(player.energy.points).div(500000)))
        let cap = Decimal.floor(new Decimal(player.compactenergy.total))
        let softcapGain = Decimal.floor(Decimal.log10(new Decimal(player.compactenergy.total).add(totalResetGain)).div(2))
        return new Decimal(500000).times(new Decimal(1).add(Decimal.max(cap,totalResetGain).sub(x)))
    },
    
    type: "custom",
    prestigeButtonText() {
        return '<span style="font-size: 13px;"> Convert </span><span style="font-size: 15px;">' + format(new Decimal(this.getNextAt(1))) + '</span><span style="font-size: 13px;"> Energy into </span><span style="font-size: 15px;">' + format(this.getResetGain()) + '</span><span style="font-size: 13px;"> Compact Energy </span><br><span style="font-size: 13px;"> Next: </span><span style="font-size: 15px;">' + format(new Decimal(this.getNextAt())) + '</span><span style="font-size: 13px;"> Energy'
    },
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
                let amt = getBuyableAmount('compactenergy', 11);
                let scaling = (Decimal.max(0, Decimal.floor(Decimal.log10(amt).div(2))))
                return new Decimal(1).times(new Decimal(100).pow(scaling))

            },
            effect() {
                let amt = getBuyableAmount('compactenergy', 11);
                return new Decimal(0.10).times(amt).add(1)
            },
            buyMax() { // i didnt indent the rest cuz im lazy
                let cost = this.cost()
                do {
                    let x = getBuyableAmount("compactenergy", 11)
                
                    let digits = x.lte(99) ? decimalZero : x.log10().div(2).floor()
                    let nextPower100 = digits.pow_base(100).mul(100)
                
                    let amtToBuy = player.compactenergy.points.div(cost).floor()
                    amtToBuy = amtToBuy.min(nextPower100.sub(x))
                    
                    player.compactenergy.points = player.compactenergy.points.sub(amtToBuy.mul(cost))
                    addBuyables("compactenergy", 11, amtToBuy)
                
                    cost = layers.compactenergy.buyables[11].cost(getBuyableAmount("compactenergy", 11))
                } while (player.compactenergy.points.gte(cost))
                },
            canAfford() { 
                let cost = this.cost();
                return player.compactenergy.points.gte(cost);
            },
            buy() {
                let amt = getBuyableAmount('compactenergy', 11);
                let cost = this.cost();
                player.compactenergy.points = player.compactenergy.points.sub(cost);
                setBuyableAmount("compactenergy", 11, amt.add(1));
            },
            display(x) { 
                let amt = getBuyableAmount("compactenergy", 11);
                    return 'Boosts Energy Base and Energy Points by +0.10x.<br><span style="font-size: 15px;">Current Effect: x' + format(new Decimal(0.10).times(amt).add(1).toFixed(2)) + ' to Energy base and Energy Points. <br>Cost: ' + format(this.cost()) + ' Compact Energy </span><br>Bought: ' + format(amt);
            },
            unlocked() {
                return true
            },
        },
        12: {
            title: "Compacted Batteries",
            cost() {
                let amt = getBuyableAmount('compactenergy', 12);
                let scaling = (Decimal.max(0, Decimal.floor(Decimal.log10(amt).div(2))))
                return new Decimal(10).times(new Decimal(100).pow(scaling))

            },
            buyMax() { // i didnt indent the rest cuz im lazy
                let cost = this.cost()
                do {
                    let x = getBuyableAmount("compactenergy", 12)
                
                    let digits = x.lte(99) ? decimalZero : x.log10().div(2).floor()
                    let nextPower100 = digits.pow_base(100).mul(100)
                
                    let amtToBuy = player.compactenergy.points.div(cost).floor()
                    amtToBuy = amtToBuy.min(nextPower100.sub(x))
                    
                    player.compactenergy.points = player.compactenergy.points.sub(amtToBuy.mul(cost))
                    addBuyables("compactenergy", 12, amtToBuy)
                
                    cost = layers.compactenergy.buyables[12].cost(getBuyableAmount("compactenergy", 12))
                } while (player.compactenergy.points.gte(cost))
                },
            effect() {
                let amt = getBuyableAmount('compactenergy', 12);
                return new Decimal(amt).add(1);
            },
            canAfford() { 
                let cost = this.cost();
                return player.compactenergy.points.gte(cost);
            },
            buy() {
                let amt = getBuyableAmount('compactenergy', 12);
                let cost = this.cost();
                player.compactenergy.points = player.compactenergy.points.sub(cost);
                setBuyableAmount("compactenergy", 12, amt.add(1));
            },
            display() { 
                let amt = getBuyableAmount("compactenergy", 12);
                    return 'Batteries scale +1.00 later.,br.<span style="font-size: 15px;">Current Effect: Batteries scale ' + format(new Decimal(1).times(amt).toFixed(2)) + ' later. <br>Cost: ' + format(this.cost()) + ' Compact Energy </span><br>Bought: ' + format(amt);
            },
            unlocked() {
                return true
            },
        },
    },

    clickables: {
        11: {
            display() {return '<span style="font-size: 20px;">Buy Max</span>'},
        
            canClick() 
            {let amt = getBuyableAmount('compactenergy', 11);
                let scaling = (Decimal.max(0, Decimal.floor(Decimal.log10(amt).div(2))))
                return player.compactenergy.points.gte(new Decimal(1).times(new Decimal(100).pow(scaling)))}, 
            onClick() {buyMaxBuyable('compactenergy', 11)},
            unlocked() {return true}
        },
        12: {
            display() {return '<span style="font-size: 20px;">Buy Max</span>'},
            canClick() 
            {let amt = getBuyableAmount('compactenergy', 12);
                let scaling = (Decimal.max(0, Decimal.floor(Decimal.log10(amt).div(2))))
                return player.compactenergy.points.gte(new Decimal(10).times(new Decimal(100).pow(scaling)))}, 
            onClick() {buyMaxBuyable('compactenergy', 12)},
            unlocked() {return true}
        }

    },

    tabFormat: [
        "main-display",
        "prestige-button",
        ["display-text", function() {
            return 'You have ' + format(player.compactenergy.total) + ' total Compact Energy.'}],
        "resource-display",
        "blank",
        "buyables",
        "clickables",
        "upgrades",
    ],

    layerShown() {
        if (player.achievements.doomsday.eq(1)) {return false}
        else return hasMilestone('battery', 4)},          // Returns a bool for if this layer's node should be visible in the tree.
}
)   

// dark energy

addLayer("darkenergy", {
    startData() { return {                  // startData is a function that returns default data for a layer.               // You can add more variables here to add them to your layer.
        points: new Decimal(1),
        darkenergyexpo: new Decimal(1),
        timemult: new Decimal(1),
        outofrun: new Decimal(1)
    }},
    symbol() {return options.emojiSymbols ? "⚫" : "dEN"},
    color: "#424242",                       // The color for this layer, which affects many elements.
    resource: "Dark Energy",            // The name of this layer's main prestige resource.
    row: 0,
    position: 1,                                 // The row this layer is on (0 is the first row).
    baseResource: "Energy Points",
    branches: ["energy"],
    type: "static",
    style() {
        return {
            "background-color": "#000000",
            "background-size": "cover"
        };
    },
    update(diff){

        // time stuff

        if (hasUpgrade('darkenergy', 11)) {player.darkenergy.timemult = new Decimal(1.5)}
        player.darkenergy.darkenergyexpo = player.darkenergy.darkenergyexpo.sub(new Decimal(diff).div(new Decimal(120).div(player.darkenergy.timemult)))
        if (player.darkenergy.darkenergyexpo.lt(0)) player.darkenergy.darkenergyexpo = new Decimal(0)
        
        if (new Decimal(player.darkenergy.darkenergyexpo).lte(0)) {player.darkenergy.outofrun = new Decimal(1)}
    },
    passiveGeneration() {
        let passive = new Decimal(0);
        let passivebase = new Decimal(11);
        let darkpower = getBuyableAmount('darkcore', 11).pow(0.5)
        darkenergyexpo = Decimal.min(darkpower.add(1),player.darkenergy.darkenergyexpo)
        let outofrun = new Decimal(1)


        // passivebase

        if (hasUpgrade('darkenergy', 11)) {passivebase = passivebase.times(3)}
        if (hasUpgrade('darkenergy', 12)) {passivebase = passivebase.times(2)}
        if (hasUpgrade('darkenergy', 13)) {passivebase = passivebase.times(player.points.pow(0.1))}
        if (hasUpgrade('darkenergy', 14)) {passivebase = passivebase.times(new Decimal(0.2).times(Decimal.floor(Decimal.log10(player.darkenergy.points))).add(1))}
        if (hasUpgrade('darkenergy', 21)) {passivebase = passivebase.times(100)}
        if (hasUpgrade('darkenergy', 22)) {passivebase = passivebase.div(10)}
        if (hasUpgrade('darkenergy', 24)) {passivebase = passivebase.div(5)}

        passivebase = passivebase.times(Decimal.max(1,new Decimal(player.darkcore.points).pow(0.2)))
    
        passive = passivebase.pow(darkenergyexpo)
        return Decimal.max(0,passive).sub(outofrun)
    },
    clickables: {
        11: {
            display() {if (new Decimal(player.darkenergy.darkenergyexpo).lte(0)) {
                return '<span style="font-size: 20px;">Begin Dark Run</span>'}
                else if (new Decimal(player.darkenergy.darkenergyexpo).gt(0)) {
                    return '<span style="font-size: 20px;">End Dark Run</span>'}},
            canClick() {return true},
            onClick() {if (new Decimal(player.darkenergy.darkenergyexpo).gt(0)) {player.darkenergy.darkenergyexpo = new Decimal(0)
                player.darkenergy.outofrun = new Decimal(1)}
                else if (new Decimal(player.darkenergy.darkenergyexpo).lte(0)) {layerDataReset('darkenergy')
                    player.darkenergy.outofrun = new Decimal(0)
                }
            },
            unlocked() {return true},
            style() {
                return {
                    "background-color": `#000000`,
                    "color": "#ffffff",
                    "border": "2px solid",
	                "border-color": "#ffffff",
                    "font-weight": "bold",
                };
            },
            
        },
    },
    buyables: {
        11: {
            title: "Dark Time",
            cost() {let amt = getBuyableAmount('darkenergy', 11)
                return new Decimal(10).pow(amt.times(2))               
            },
            style() {
                return {
                    "background-color": `#000000`,
                    "color": "#ffffff",
                    "border": "2px solid",
	                "border-color": "#ffffff",
                    "font-weight": "bold",
                };
            },
            canAfford(){if (new Decimal(player.darkenergy.outofrun).eq(1)){return false}
                let cost = this.cost()
                return player.darkenergy.points.gte(cost)
            },
            buy(){let cost = this.cost()
                let amt = getBuyableAmount('darkenergy', 11)
                player.darkenergy.points = player.darkenergy.points.sub(cost)
                setBuyableAmount('darkenergy', 11, amt.add(1))
                player.darkenergy.darkenergyexpo = player.darkenergy.darkenergyexpo.add(0.5)
            },
            display(){let cost = this.cost()
                return '<span style="font-size: 13px">Adds 60 seconds to Dark Run time.</span><br><span style="font-size: 20px">Bought: ' + format(getBuyableAmount('darkenergy', 11)) + '<br>Cost: ' + format(cost)}
        }
    },
    upgrades: {
        11: {
            title: "Darkness",
            description: "Triples Dark Energy, but Dark Run time ticks faster.",
            tooltip:function(){
                return "Buying this upgrade will make Upgrade 12 1e4x more expensive."
            },
            cost() {if (hasUpgrade('darkenergy', 12)) {return new Decimal(1e6)}
                else return new Decimal(100)},
            canAfford() {
                let cost = this.cost();
                if (new Decimal(player.darkenergy.outofrun).eq(1)) {
                    return false; 
                }
                else new Decimal(player.darkenergy.points).gte(cost);

        }
    },
        12: {
            title: "Purity",
            description: "Doubles Dark Energy.",
            tooltip:function(){
             return "Buying this upgrade will make Upgrade 11 1e4x more expensive."
            },
            cost() {if (hasUpgrade('darkenergy', 11)) {return new Decimal(1e6)}
                else return new Decimal(100)},
            canAfford() {
                let cost = this.cost();
                if (new Decimal(player.darkenergy.outofrun).eq(1)) {
                    return false; 
                }
                else new Decimal(player.darkenergy.points).gte(cost);

    }
},13: {
    title: "Synergy",
    description: "Energy Points boost Dark Energy Gain at a reduced rate.",
    tooltip:function(){
     return "Formula: Energy Points ^ 0.1 <br> Effect: " + format(player.points.pow(0.1)) + "x boost to Dark Energy. <br>Buying this upgrade will make Upgrade 14 1e5x more expensive."
    },
    cost() {if (hasUpgrade('darkenergy', 14)) {return new Decimal(2e10)}
        else return new Decimal(2000)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},14: {
    title: "Basking",
    description: "Dark Energy boosts itself by it's magnitude.",
    tooltip:function(){
     return "Formula: 0.20 x ⌊log10(Dark Energy)⌋ <br> Effect: " + format(new Decimal(0.2).times(Decimal.floor(Decimal.log10(player.darkenergy.points))).add(1)) + "x boost to Dark Energy. <br>Buying this upgrade will make Upgrade 13 1e5x more expensive."
    },
    cost() {if (hasUpgrade('darkenergy', 13)) {return new Decimal(2e10)}
        else return new Decimal(2000)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},21: {
    title: "Narcissism",
    description: "100x Dark Energy.",
    tooltip:function(){
     return "Buying this upgrade will make Upgrade 22 1e7x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(1)},
    cost() {if (hasUpgrade('darkenergy', 22)) {return new Decimal(1.5e14)}
        else return new Decimal(1.5e7)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);
}
},22: {
    title: "Self-Sacrificing",
    description: "10x Less Dark Energy, in exchange for a great boost to Dark Cores and 100x Energy Points.",
    tooltip:function(){
     return "Formula [Dark Cores]: Dark Cores ^ 0.13 <br>Effect: x" + format (new Decimal(player.darkcore.points).pow(0.13))+ " Boost to Dark Cores. <br>Buying this upgrade will make Upgrade 21 1e7x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(1)},
    cost() {if (hasUpgrade('darkenergy', 21)) {return new Decimal(1.5e14)}
        else return new Decimal(1.5e7)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},23: {
    title: "Blessing",
    description: "5x more Dark Cores.",
    tooltip:function(){
     return "Buying this upgrade will make Upgrade 24 1e8x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(2)},
    cost() {if (hasUpgrade('darkenergy', 24)) {return new Decimal(2.5e21)}
        else return new Decimal(2.5e13)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},24: {
    title: "Curse",
    description: "5x less Dark Energy, but Dark Cores are multiplied by 6.66x",
    tooltip:function(){
     return "Buying this upgrade will make Upgrade 23 1e8x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(2)},
    cost() {if (hasUpgrade('darkenergy', 23)) {return new Decimal(2.5e21)}
        else return new Decimal(2.5e13)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},
    
},
    baseAmount() {return player.points},  
    unlocked() {
        return (player.achievements.doomsday.eq(1))
    },
    layerShown() {return (player.achievements.doomsday.eq(1))},

    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "clickables",
                "blank",
                ["display-text", function() {
                    if (new Decimal(player.darkenergy.outofrun).eq(1))
                        return 'Starting a Dark Run will reset Dark Energy and everything before itself. <br> You cannot buy Dark Energy Upgrades, Buyables, or anything else, outside of Dark Run.';
                }],
                "resource-display",
                ["display-text", function() {
                    let darkpower = new Decimal(1).add(getBuyableAmount('darkcore', 11).pow(0.5))
                    let darkenergyexpo = Decimal.min(darkpower, player.darkenergy.darkenergyexpo);
                    return 'Dark Energy Exponent is currently ^' + format(darkenergyexpo) + ', capped at ' + format(darkpower);
                }],
                ["display-text", function() {
                    let timeLeft = new Decimal(120).div(player.darkenergy.timemult);
                    let darkenergyexpo = player.darkenergy.darkenergyexpo;
                    let darkpower = getBuyableAmount('darkcore', 11).pow(0.5)
                    if (new Decimal(player.darkenergy.outofrun).eq(0)) {
                        return 'You have ' + format(darkenergyexpo.times(timeLeft)) + ' seconds left in this Dark Run. ' + format(Decimal.max(0, darkenergyexpo.times(timeLeft).sub(new Decimal(1).add(darkpower).times(timeLeft)))) + ' seconds until Dark Energy Exponent ticks down.';
                    }
                }],
                "blank",
                "buyables",
                "upgrades"
            ]
        
        },
        "Dark Cores": {
            embedLayer: 'darkcore',
            unlocked() {if (new Decimal(player.darkenergy.outofrun).eq(0)) {return false}
                return (player.achievements.doomsday.eq(1))},
        },
    }})

addLayer("darkcore", {
    startData() { return {                  // startData is a function that returns default data for a layer.               // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        rgb1: new Decimal(0),
        rgb2: new Decimal(255)
    }},
    symbol() {return options.emojiSymbols ? "⬛" : "DC"},
    color() {
        let rgb1 = player.darkcore.rgb1;
        return `rgb(${rgb1}, ${rgb1}, ${rgb1})`;
    },                       // The color for this layer, which affects many elements.
    resource: "Dark Cores",            // The name of this layer's main prestige resource.
    row: 0,
    position: 1,                                 // The row this layer is on (0 is the first row).
    baseResource: "Dark Energy",
    type: "custom",
    requires: new Decimal(10),
    style() {
        return {
            "background-color": "#000000",
            "background-size": "cover"
        };
     },
     buyables: {
        11: {
            title: "Dark Power",
            cost() {let amt = getBuyableAmount('darkcore', 11)
                return new Decimal(100).pow(Decimal.max(1,amt.add(1)))               
            },
            canAfford(){if (new Decimal(player.darkenergy.outofrun).eq(0)){return false}
                let cost = this.cost()
                return player.darkcore.points.gte(cost)
            },
            buy(){let cost = this.cost()
                let amt = getBuyableAmount('darkcore', 11)
                setBuyableAmount('darkcore', 11, amt.add(1))
                player.darkcore.points = new Decimal(0)
                layerDataReset('darkenergy')
                player.darkenergy.outofrun = new Decimal(1)
            },
            display(){let cost = this.cost()
                return '<span style="font-size: 13px">Resets Dark Cores and everything prior.<br> Each level of Dark Power increases Dark Energy exponent cap by √amt.<br>Also tends to unlock new upgrades or features.</span><br><span style="font-size: 20px">Bought: ' + format(getBuyableAmount('darkcore', 11)) + '<br>Cost: ' + format(cost)},
                style() {if (player.darkcore.points.lt(this.cost()))
                    return {
                        "background-color": `#000000`,
                        "color": "#ffffff",
                        "border": "2px solid",
                        "border-color": "#ffffff",
                        "font-weight": "bold",
                    };
                },
        }
    },
    baseAmount() {return player.darkenergy.points},  
    unlocked() {if (new Decimal(player.darkenergy.outofrun).eq(0)) {return false}
        return (player.achievements.doomsday.eq(1))
    },
    layerShown() {return false},
    update(diff){
        if (!player.darkcore.rgb1Direction) player.darkcore.rgb1Direction = 1; // 1 for increasing, -1 for decreasing
        if (!player.darkcore.rgb2Direction) player.darkcore.rgb2Direction = 1
        // Update rgb1
        player.darkcore.rgb1 = player.darkcore.rgb1.add(diff * 50 * player.darkcore.rgb1Direction);
        if (player.darkcore.rgb1.gt(255)) {
            player.darkcore.rgb1 = new Decimal(255); // Cap at 255
            player.darkcore.rgb1Direction = -1; // Reverse direction
        }
        if (player.darkcore.rgb1.lt(0)) {
            player.darkcore.rgb1 = new Decimal(0); // Cap at 0
            player.darkcore.rgb1Direction = 1; // Reverse direction
        }
        player.darkcore.rgb2 = player.darkcore.rgb2.add(diff * 50 * player.darkcore.rgb2Direction);
        if (player.darkcore.rgb2.gt(255)) {
            player.darkcore.rgb2 = new Decimal(255); // Cap at 255
            player.darkcore.rgb2Direction = -1; // Reverse direction
        }
        if (player.darkcore.rgb2.lt(0)) {
            player.darkcore.rgb2 = new Decimal(0); // Cap at 0
            player.darkcore.rgb2Direction = 1; // Reverse direction
        }
    },

    onPrestige(){player.darkenergy.points = new Decimal(0)},
    canReset(){
        return this.getResetGain().gte(1)
    },
    getResetGain(){
        resetGain = Decimal.max(0,Decimal.floor(Decimal.log10(player.darkenergy.points).pow(3)))
        if (hasUpgrade('darkenergy', 22)) {resetGain = resetGain.times(Decimal.max(1,resetGain.pow(0.13)))}
        if (hasUpgrade('darkenergy', 23)) {resetGain = resetGain.times(5)}
        if (hasUpgrade('darkenergy', 24)) {resetGain = resetGain.times(6.66)}
        return resetGain
    },
    getNextAt(){
        return new Decimal(10)
    },
    prestigeButtonText() {
        return '<span style="font-size: 13px;"> Convert </span><span style="font-size: 15px;">' + format(Decimal.max(10,new Decimal(player.darkenergy.points))) + '</span><span style="font-size: 13px;"> Dark Energy into </span><span style="font-size: 15px;">' + format(this.getResetGain()) + '</span><span style="font-size: 13px;"> Dark Cores'},

    tabFormat:[
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", function() {
                        return 'You have ' + format(player.darkcore.points) + ' Dark Cores, boosting Dark Energy by x' + format(new Decimal(player.darkcore.points).pow(0.2)) + '.';
                }],
                "resource-display",
                "blank",
                "upgrades",
                "buyables",
                "clickables"
    ]
    })