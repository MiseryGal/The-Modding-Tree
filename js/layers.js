addLayer("achievements", {
    name: "Achievements and Other Stuff", // The name of the layer
    symbol() {
        return options.imageSymbols ? '<img src="resources/achievements.png" alt="EN" style="width: 40px; height: 40px;">' : "A";
    }, // The symbol for the layer's node
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
        return "Achievements and Other Stuff"; // Custom text when you hover over the layer
    },
    layerShown() { return true; }, // Ensures the layer is always visible
    achievements: {
        11: {
            name: "Dawn",
            tooltip: "Buy the second upgrade.",
            image: "energy.png",
            done() {return hasUpgrade("energy", 12)},
            unlocked() {return true}
        },
        12: {
            name: "Enhancer",
            tooltip: "Get 10 levels of Enhanced Energy.",
            image: "energy.png",
            done() {return getBuyableAmount("energy", 11).gte(10)},
            unlocked() {return true}
        },
        13: {
            name: "Your true start",
            tooltip: "Buy Energy Upgrade 24.",
            image: "energy.png",
            done() {return hasUpgrade("energy", 24)},
            unlocked() {return true}
        },
        14: {
            name: "Scaling starter",
            tooltip: "Buy Battery Upgrade 13.",
            image: "battery.png",
            done() {return hasUpgrade("battery", 13)},
            unlocked() {return true}
        },
        15: {
            name: "Good luck affording that...",
            image: "energy.png",
            tooltip: "Have Enhanced Energy start superscaling.",
            done() {return getBuyableAmount("energy", 11).gte(50)},
            unlocked() {return true}
        },
        16: {
            name: "(softcapped)",
            image: "energy.png",
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
            image: "battery.png",
            tooltip: "Bear witness to the great scaling of 20 Batteries.",
            done() {
                return player.battery.points.gte(20)
            },
            unlocked() {return true}
        },
        22: {
            name: "Compressor",
            image: "compactenergy.png",
            tooltip: "Acquire 10 Compact Energy.",
            done() {
                return player.compactenergy.points.gte(10)
            },
            unlocked() {return true}
        },
        23: {
            name: "Boosted",
            image: "energy.png",
            tooltip: "Buy Energy Upgrade 34.",
            done() {
                return hasUpgrade('energy', 34)
            },
            unlocked() {return true}
        },
        24: {
            name: "The Fifth Row.",
            image: "energy.png",
            tooltip: "Buy Energy Upgrade 35...",
            done() {
                return hasUpgrade('energy', 35)
            },
            unlocked() {return true}
        },
        25: {
            name: "Time is a concept",
            image: "battery.png",
            tooltip: "Get Battery Milestone 10",
            done() {
                return hasMilestone('battery', 10)
            },
            unlocked() {return true}
        },
        26: {
            name: "Doomsday.",
            image: "darkenergy.png",
            tooltip: "Erase everything.",
            done() {
                return player.achievements.doomsday.eq(1)
            },
            unlocked() {return true}
        },
        31: {
            name: "Building in darkness",
            image: "darkcore.png",
            tooltip: "Buy your first Dark Power",
            done() {
                return new Decimal(getBuyableAmount('darkcore', 11)).gte(1)
            },
            unlocked() {return true}
        },
        32: {
            name: "See the light",
            image: "darkcore.png",
            tooltip: "Re-unlock Energy",
            done() {
                return hasUpgrade('darkcore', 11)
            },
            unlocked() {return true}
        },
        33: {
            name: "Rebuilding",
            image: "darkcore.png",
            tooltip: "Re-unlock Batteries",
            done() {
                return hasUpgrade('darkcore', 21)
            },
            unlocked() {return true}
        },
        34: {
            name: "Scaling Diminisher",
            image: "battery.png",
            tooltip: "Buy Battery Upgrade 13... again.",
            done() {
                return hasUpgrade('darkcore', 21) && hasUpgrade('battery', 13)
            },
            unlocked() {return true}
        },
        35: {
            name: "Corroding Batteries",
            image: "battery.png",
            tooltip: "Acquire 10 Batteries within Doomsday.",
            done() {
                return hasUpgrade('darkcore', 21) && player.battery.points.gte(10)
            },
            unlocked() {return true}
        },
        36: {
            name:function() {if (hasUpgrade('battery', 33)) return "TROLLED"
                else return "???"
            },
            image:function() {if (hasUpgrade('battery', 33)) return "troll.png"
                 return "battery.png"
                            },
                            tooltip:function() {
                                if (hasUpgrade('battery', 33)) return "bro thought they were getting a new feature <img src='resources/etodadskull.png' alt='skull' style='width: 20px; height: 20px; position: relative; top: 5px;'>"
                else return "ooo this one is dark and mysterious ooo"
            },
            done() {
                return hasUpgrade('darkcore', 21) && player.battery.points.gte(14)
            },
            unlocked() {return true}
        },
        41: {
            name: "Reflourish",
            image: "darkcore.png",
            tooltip: "Re-unlock Compact Energy.",
            done() {
                return hasUpgrade('darkcore', 22)
            },
            unlocked() {return true}
        },
        42: {
            name: "Short Lived",
            image: "compactenergy.png",
            tooltip: "Get over 100 Compact Energy within Doomsday.",
            done() {
                return player.achievements.doomsday.eq(1) && player.compactenergy.total.gte(100)
            },
            unlocked() {return true}
        },
        43: {
            name: "Encroaching Darkness",
            image: "darkenergy.png",
            tooltip: "Amass over 1e100 Dark Energy...",
            done() {
                return player.darkenergy.points.gte(1e100)
            },
            unlocked() {return true}
        },
        44: {
            name: "Long Life",
            image: "compactenergy.png",
            tooltip: "Get over 1e7 Compact Energy within Doomsday.",
            done() {
                return player.achievements.doomsday.eq(1) && player.compactenergy.total.gte(1e7)
            },
            unlocked() {return true}
        },
        45: {
            name: "An Epiphany..?",
            image: "light.png",
            tooltip: "Unlock new content, finally.",
            done() {
                return hasUpgrade('darkenergy', 51)
            },
            unlocked() {return true}
        },
        46: {
            name: "The Divines Above",
            image: "light.png",
            tooltip: "Max out one Blessing.",
            done() {
                return (getBuyableAmount('light', 11).eq(30) || getBuyableAmount('light', 12).eq(30) || getBuyableAmount('light', 13).eq(30) || getBuyableAmount('light', 14).eq(30))
            },
            unlocked() {return true}
        },
        51: {
            name: "Softcap^2",
            image: "darkenergy.png",
            tooltip: "Discover another only mildly impeding softcap.",
            done() {
                return (player.darkenergy.points.gte(new Decimal("1e3202")))
            },
            unlocked() {return true}
        },
        52: {
            name: "Infinity^2",
            image: "energy.png",
            tooltip: "Reach infinite Energy again.",
            done() {
                return (player.energy.points.gte(new Decimal("1.79e308")) && player.achievements.doomsday.eq(1))
            },
            unlocked() {return true}
        },
        53: {
            name: "Wasn't once enough?",
            image: "bomb.png",
            tooltip: "You've really gotta stop destroying the world.",
            done() {
                return (player.bomb.points.gte(1))
            },
            unlocked() {return true}
        },
        54: {
            name: "Baby's first Warhead",
            image: "bomb.png",
            tooltip: "Have a bomb with a radius over 10km².",
            done() {
                return (layers.bomb.topradius.gte(10))
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
        "Save Editing": {
            content: [
                ["display-text", '<span style="font-size: 20px;"> DISCLAIMER! </span> <br> These tools are very powerful and should be used only for save recovery!'],
                "blank",
                "clickables",
                "blank",
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
        21: {
            display() { return "Start of Battery Layer"; },
            title: "Battery",
            canClick() { return true; },
            onClick() {
                const layersToReset = ['energy', 'battery', 'achievements', 'darkenergy', 'darkcore', 'compactenergy', 'light', 'bomb'];
                layersToReset.forEach(layer => layerDataReset(layer));
                player.energy.upgrades.push(...[11, 12, 13, 14, 21, 22, 23, 24]);
                player.points = new Decimal(0)
                setBuyableAmount('energy', 11, new Decimal(30));
            },
            style() {
                return {
                    "background-color": "#727180"
                }
            }
        },
        22: {
            display() { return "Start of Compact Energy Layer"; },
            title: "Compact Energy",
            canClick() { return true; },
            onClick() {
                const layersToReset = ['energy', 'battery', 'achievements', 'darkenergy', 'darkcore', 'compactenergy', 'light', 'bomb'];
                layersToReset.forEach(layer => layerDataReset(layer));
                player.energy.upgrades.push(...[11, 12, 13, 14, 21, 22, 23, 24]);
                player.battery.upgrades.push(...[11, 12, 13, 14, 21, 22, 23, 24])
                player.battery.milestones.push(...[0, 1, 2, 3, 4])
                player.battery.points = new Decimal(20)
                player.points = new Decimal(0);
                setBuyableAmount('energy', 11, new Decimal(70))
            },
            style() {
                return {
                    "background-color": "#e8a22a"
                }
            }
        },
        23: {
            display() { return "Start of Dark Energy Layer"; },
            title: "Dark Energy",
            canClick() { return true; },
            onClick() {
                const layersToReset = ['energy', 'battery', 'achievements', 'darkenergy', 'darkcore', 'compactenergy', 'light', 'bomb'];
                layersToReset.forEach(layer => layerDataReset(layer));
                player.achievements.doomsday = new Decimal(1)
                player.points = new Decimal(0);
            },
            style() {
                return {
                    "background-color": "#000000",  // Black background
                    "color": "#ffffff",             // White text
                    "border": "2px solid #ffffff"   // White border
                };
            }
            
        },
        24: {
            display() { return "When you acquire Dark Power level 5"; },
            title: "Dark Power 5",
            canClick() { return true; },
            onClick() {
                const layersToReset = ['energy', 'battery', 'achievements', 'darkenergy', 'darkcore', 'compactenergy', 'light', 'bomb'];
                layersToReset.forEach(layer => layerDataReset(layer));
                player.darkcore.upgrades.push(...[11, 21, 22])
                player.energy.upgrades.push(...[11, 12, 13, 14, 21, 22, 23, 24, 41, 42, 43]);
                player.battery.upgrades.push(...[11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34])
                player.battery.milestones.push(...[0, 1, 2, 3, 4])
                player.battery.points = new Decimal(20)
                player.achievements.doomsday = new Decimal(1)
                player.points = new Decimal(0);
                setBuyableAmount('darkcore', 11, new Decimal(5))
                setBuyableAmount('darkcore', 12, new Decimal(50))
                player.darkenergy.outofrun = new Decimal(1)
                player.darkenergy.darkenergyexpo = new Decimal(0)
            },
            style() {
                return {
                    "background-color": "#000000",  // Black background
                    "color": "#ffffff",             // White text
                    "border": "2px solid #ffffff"   // White border
                };
            }
            
        },
        31: {
            display() { return "Start of Light Layer"; },
            title: "Light",
            canClick() { return true; },
            onClick() {
                const layersToReset = ['energy', 'battery', 'achievements', 'darkenergy', 'darkcore', 'compactenergy', 'light', 'bomb'];
                layersToReset.forEach(layer => layerDataReset(layer));
                player.achievements.doomsday = new Decimal(1)
                player.energy.upgrades.push(...[11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 35, 41, 42, 43, 44]);
                player.battery.upgrades.push(...[11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 35])
                player.battery.milestones.push(...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
                player.darkcore.upgrades.push(...[11, 21, 22])
                player.darkenergy.upgrades.push(...[51])
                player.battery.points = new Decimal(10000)
                player.compactenergy.points = new Decimal(1e7)
                player.compactenergy.total = new Decimal(1e7)
                player.points = new Decimal(0);
                player.battery.auto = true
                player.battery.autobuy1 = true
                setBuyableAmount('darkcore', 11, new Decimal(10))
                setBuyableAmount('darkcore', 12, new Decimal(200))
                player.darkenergy.outofrun = new Decimal(1)
                player.darkenergy.darkenergyexpo = new Decimal(0)
            },
            style() {
                return {
                    "background-color": "#80d9ed"
                }
            }
        },
        32: {
            display() { return "Start of Bomb Layer"; },
            title: "Bomb",
            canClick() { return true; },
            onClick() {
                const layersToReset = ['energy', 'battery', 'achievements', 'darkenergy', 'darkcore', 'compactenergy', 'light', 'bomb'];
                layersToReset.forEach(layer => layerDataReset(layer));
                player.achievements.doomsday = new Decimal(1)
                player.energy.upgrades.push(...[11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 35, 41, 42, 43, 44]);
                player.battery.upgrades.push(...[11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 35, 41])
                player.battery.milestones.push(...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                player.darkcore.upgrades.push(...[11, 21, 22])
                player.darkenergy.upgrades.push(...[51])
                player.battery.points = new Decimal(1e126)
                player.compactenergy.points = new Decimal(1e260)
                player.compactenergy.total = new Decimal(1e260)
                player.darkcore.points = new Decimal("1e430")
                player.light.points = new Decimal(1e50)
                player.darkenergy.points = new Decimal("1e6380")
                player.points = new Decimal(0);
                player.battery.auto = true
                player.battery.autobuy1 = true
                setBuyableAmount('darkcore', 11, new Decimal(81))
                setBuyableAmount('darkcore', 12, new Decimal(1000))
                player.darkenergy.outofrun = new Decimal(1)
                player.darkenergy.darkenergyexpo = new Decimal(0)
            },
            style() {
                return {
                    "background-image": "radial-gradient(rgb(227, 199, 16), rgb(227, 54, 20)) !important",
                    "background-size": "100% 100%",
                    "border-color":"rgb(227, 54, 20) !important",
                }
            }
        },
    },
},
    
);

// Energy Layer

addLayer("energy", {
    name: "Energy", // The name of the layer
    symbol() {
        return options.imageSymbols ? '<img src="resources/energyfull.png" alt="EN" style="width: 80px; height: 80px;">' : "EN";
    }, // The symbol for the layer's node
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
    type: "custom", // No prestige based on this layer
    resource: "Energy", // The resource produced by this layer
    baseResource: "Energy Points", // What this is based on (could be points or any other resource)
    baseAmount() { return player.points }, // Uses player's points as base amount
    doReset(layer) {
        if (layer !== this.layer) {
            player.energy.spentTime = new Decimal(0)
            layerDataReset(this.layer, ["upgrades", "buyables"]);
            let upgradesToKeep = [24, 41, 42, 43, 44];
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
    prestigeButtonText(){return "You are getting " + format(layers.energy.getResetGain()) + " Energy."},
    canReset(){return this.getResetGain().gt(0)},
    getResetGain() {let passive = new Decimal(0);
        let passivebase = new Decimal(10);

        // passive base

        if (hasUpgrade('energy', 12)) passivebase = passivebase.add(10);
if (hasUpgrade('energy', 13)) {
    if(player.points.pow(0.2).gte(250)) {
        passivebase = passivebase.add(Decimal.min(250, player.points.pow(0.2))).add(player.points.pow(0.16));
    };
    passivebase = passivebase.add(player.points.pow(0.2));
} else if (hasUpgrade('battery', 21)) {
    if(player.points.pow(0.28).gte(250)) {
        passivebase = passivebase.add(Decimal.min(250, player.points.pow(0.28))).add(player.points.pow(0.16));
    };
    passivebase = passivebase.add(player.points.pow(0.28));
} else if (hasUpgrade('battery', 12)) {
    if(player.points.pow(0.24).gte(250)) {
        passivebase = passivebase.add(Decimal.min(250, player.points.pow(0.24))).add(player.points.pow(0.16));
    };
    passivebase = passivebase.add(player.points.pow(0.24));
}
if (hasUpgrade('energy', 21)) {
    passivebase = passivebase.times(new Decimal(0.1).times(new Decimal(player.energy.upgrades.length)).add(1)); 
} else if (hasUpgrade('energy', 21)) {
    passivebase = passivebase.times(new Decimal(1).times(new Decimal(player.energy.upgrades.length)).add(1)); 
}
if (hasUpgrade('energy', 22)) passivebase = passivebase.add(10);
if (hasUpgrade('energy', 24)) passivebase = passivebase.add(7);
if (hasUpgrade('battery', 13)) passivebase = passivebase.times(new Decimal(1).times(Decimal.floor(Decimal.max(0, Decimal.log10(Decimal.max(1, player.energy.points))))).div(2).add(1));

let bonuscap = new Decimal(0.10).times(player.battery.points);
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
    passivebase = passivebase.times(new Decimal(Decimal.max(0, Decimal.min(1, new Decimal(player.energy.spentTime).divide(180)))).add(1));
}

if (hasUpgrade('energy', 34) && hasUpgrade('battery', 24)) {
    passivebase = passivebase.times(new Decimal(1.13).pow(Decimal.floor(Decimal.max(1, Decimal.log10(Decimal.max(1, player.points))))));
} else if (hasUpgrade('battery', 24)) {
    passivebase = passivebase.times(new Decimal(1.04).pow(Decimal.floor(Decimal.max(1, Decimal.log10(Decimal.max(1, player.points))))));
}

if (player.achievements.doomsday.eq(0)){
    passivebase = passivebase.add(layers.energy.buyables[11].effect(getBuyableAmount("energy", 11)));
}

if (hasUpgrade('battery', 32)) {
    passivebase = passivebase.times(player.battery.points.times(Decimal.max(1, player.battery.points.div(5))));
} else if (player.battery.points.gte(1)) {
    passivebase = passivebase.times(new Decimal(player.battery.points));
}

if (hasUpgrade('battery', 11)) passivebase = passivebase.times(1.5);

if (player.achievements.doomsday.eq(0)){
    passivebase = passivebase.times(layers.compactenergy.buyables[11].effect(getBuyableAmount("compactenergy", 11)));
}

if (player.achievements.doomsday.eq(0) && passivebase.gte(1.79e307)) {
    passivebase = new Decimal(1.79e307);
}

// post nerf passivebase

if (player.achievements.doomsday.eq(1)){
    passivebase = Decimal.max(1, Decimal.log10(passivebase.add(1))).pow(2);
}

if (player.achievements.doomsday.eq(1)){
    passivebase = passivebase.times(Decimal.max(1, Decimal.log10(Decimal.max(1, player.darkenergy.points))));
}

if (player.achievements.doomsday.eq(1)){
    passivebase = passivebase.add(layers.energy.buyables[11].effect(getBuyableAmount("energy", 11)));
}

if (hasUpgrade('darkenergy', 32)) {
    passivebase = passivebase.times(1.5);
}
if (hasUpgrade('battery', 31)) {
    passivebase = passivebase.times(new Decimal(0.05).times(player.darkenergy.upgrades.length).add(1));
}
if (hasUpgrade('darkenergy', 41)) {
    passivebase = passivebase.times(1.5);
}
if (hasUpgrade('darkenergy', 42)) {
    passivebase = passivebase.times(1.35);
}

if (player.achievements.doomsday.eq(1)){
    passivebase = passivebase.times(layers.compactenergy.buyables[11].effect(getBuyableAmount("compactenergy", 11)));
}

if (hasUpgrade('battery', 34)) {
    passivebase = passivebase.times(new Decimal(1).add(player.compactenergy.total.div(100)));
}
if (hasUpgrade('energy', 44)) {
    passivebase = passivebase.times(10);
}

passivebase = passivebase.times(Decimal.max(1, player.light.points.pow(0.25)));
passivebase = passivebase.times(new Decimal(2).pow(getBuyableAmount('light', 11)));
passivebase = passivebase.times(new Decimal(1.5).pow(getBuyableAmount('bomb', 11)));

// decay

let decay = new Decimal(0.10);
this.decay = decay;
if (player.battery.overclocktimer.gt(0)) {
    decay = new Decimal(0);
}
if (player.achievements.doomsday.eq(0) && passivebase.gte(1.79e307)) {
    decay = new Decimal(0);
}

// passive

if (hasUpgrade('energy', 11)) {
    passive = new Decimal(passive.add(passivebase.sub(new Decimal(Decimal.max(0, player.energy.points.times(decay))))).sub(1));
}

this.passivebase = passivebase;
return passive.div(10);

},
    autoPrestige() {return true},
    getNextAt() {return new Decimal(0)},
    resetsNothing(){return true},
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
        },41: {
            title: "Dark Energy",
            description: "Dark Energy is boosted by Energy in the same way Energy Base is boosted by Dark Energy.",
            tooltip:function() {
                return "Formula: Dark Energy * log10(Energy) <br> Effect: x" + format(Decimal.max(1,Decimal.log10(player.energy.points)).toFixed(2)) + " to Dark Energy.";
            },
            cost: new Decimal(750),
            unlocked() {
                return (hasUpgrade('darkcore', 11))
            },
           style() {
            if (player[this.layer].upgrades.includes(41)) {return {"background-color": "#ffffff !important",
                "border": "2px solid !important",
                "border-color": "#000000 !important",
                "color": "#000000 !important",
                "cursor": "default"}}
                else return {"background-color": "#000000 !important",
                "border": "2px solid !important",
                "border-color": "#ffffff !important",
                "color": "#ffffff !important",
                "cursor": "default"}
            }
        },42: {
            title: "More Cores",
            description: "Doubles your Dark Cores.",
            cost: new Decimal(2150),
            unlocked() {
                return (hasUpgrade('darkcore', 11))
            },
           style() {
            if (player[this.layer].upgrades.includes(42)) {return {"background-color": "#ffffff !important",
                "border": "2px solid !important",
                "border-color": "#000000 !important",
                "color": "#000000 !important",
                "cursor": "default"}}
                else return {"background-color": "#000000 !important",
                "border": "2px solid !important",
                "border-color": "#ffffff !important",
                "color": "#ffffff !important",
                "cursor": "default"}
            }
        },43: {
            title: "Energized Darkness",
            description: "Battery's Energy Base boost also boosts Dark Energy.",
            cost: new Decimal(12500),
            unlocked() {
                return (hasUpgrade('darkcore', 11)) && getBuyableAmount(`darkcore`,11).gte(4)
            },
           style() {
            if (player[this.layer].upgrades.includes(43)) {return {"background-color": "#ffffff !important",
                "border": "2px solid !important",
                "border-color": "#000000 !important",
                "color": "#000000 !important",
                "cursor": "default"}}
                else return {"background-color": "#000000 !important",
                "border": "2px solid !important",
                "border-color": "#ffffff !important",
                "color": "#ffffff !important",
                "cursor": "default"}
            }
        },44: {
            title: "Overpower",
            description: "10x Energy Base.",
            cost: new Decimal(2.1e6),
            unlocked() {
                return (hasUpgrade('darkcore', 11)) && getBuyableAmount(`darkcore`,11).gte(5)
            },
           style() {
            if (player[this.layer].upgrades.includes(44)) {return {"background-color": "#ffffff !important",
                "border": "2px solid !important",
                "border-color": "#000000 !important",
                "color": "#000000 !important",
                "cursor": "default"}}
                else return {"background-color": "#000000 !important",
                "border": "2px solid !important",
                "border-color": "#ffffff !important",
                "color": "#ffffff !important",
                "cursor": "default"}
            }
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
        if (player.achievements.doomsday.eq(1)) {return hasUpgrade('darkcore', 11) || player.bomb.total.gte(1)}
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
                return "Currently at " + format(new Decimal(player.energy.points.div(layers.energy.passivebase).times(10)).toFixed(2)) + "% of your potential Energy cap. Energy is Overclocked! " + format(player.battery.overclocktimer) + " seconds left."
            else return "Currently at " + format(new Decimal(player.energy.points.div(layers.energy.passivebase).times(10)).toFixed(2)) + "% of your potential Energy cap, losing " + format(new Decimal(player.energy.points.times(new Decimal(layers.energy.decay))).toFixed(2)) + " Energy per second";
        }],
        "blank",
        ["display-text", function() 
            { if (player.achievements.doomsday.eq(1))
                return "Due to Doomsday, Energy Base is nerfed to log10(energybase+1)^2. <br>Thankfully, Energy Base is now boosted by x" + format(Decimal.max(1,Decimal.log10(player.darkenergy.points))) + " due to Dark Energy."
            else return "";
        }],
        "blank",
        "buyables",
        "upgrades",
    ],
});

// Battery Layer

addLayer("battery", {
    startData() { 
        return {                  
            points: new Decimal(0),
            autobuy1: (player?.bomb?.upgrades?.includes(21)) || false, 
            auto: (player?.bomb?.upgrades?.includes(42)) || false,
            rgb1: new Decimal(0),
            rgb2: new Decimal(255),
            overclocktimer: new Decimal(0),
            overclockcooldown: new Decimal(10)
        };
    },
    symbol() {
        return options.imageSymbols ? '<img src="resources/batteryfull.png" alt="EN" style="width: 80px; height: 80px;">' : "B";
    },
    color: "#727180",                       // The color for this layer, which affects many elements.
    resource: "Batteries",            // The name of this layer's main prestige resource.
    row: 1,
    position: 0,                                 // The row this layer is on (0 is the first row).
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
    unlocked() {if (player.achievements.doomsday.eq(1)) {return hasUpgrade('darkcore', 21) && hasUpgrade('energy', 24) && player.energy.points.gte(1000)}
        else return hasUpgrade('energy', 24) && player.energy.points.gte(1000);
    },
    onPrestige() {
    },

    requires: new Decimal(1000),              // The amount of the base needed to  gain 1 of the prestige currency. // Also the amount required to unlock the layer.
    type: "static",                        // Determines the formula used for calculating prestige currency.
    getNextAt() {
        let amt = getBuyableAmount('compactenergy', 12);
        let b;
        if (player.achievements.doomsday.eq(1)) {
            b = Decimal.floor(player.battery.points.times(1.5));
        } else {
            b = player.battery.points;
        }
        let effectivelevels = new Decimal(0)
                if (hasUpgrade('darkenergy', 33)) {effectivelevels = effectivelevels.add(7)}
                if (hasUpgrade('darkenergy', 42)) {effectivelevels = effectivelevels.add(4)}
        let darkscaling = new Decimal(0.94).pow(getBuyableAmount('darkcore', 12).add(effectivelevels))
        let bombscaling = new Decimal(1.3).pow(getBuyableAmount('bomb', 21))
        return new Decimal(1000).add(new Decimal(800).times(new Decimal(b).sub(amt).max(0).pow(new Decimal(2).add(Decimal.floor(new Decimal(b.sub(amt).max()).divide(20)))))).times(darkscaling).div(bombscaling); 
    },

    layerShown() {if (player.achievements.doomsday.eq(1)) {return hasUpgrade('darkcore', 21)}
        else return hasUpgrade('energy', 24) },          // Returns a bool for if this layer's node should be visible in the tree.
    hotkeys: [
        {
            key: "o", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
            description: "O: Use Overclock", // The description of the hotkey that is displayed in the game's How To Play tab
            onPress() {if (player.battery.overclockcooldown.lte(0) && (player.battery.overclocktimer.lte(0)))
                player.battery.overclocktimer = new Decimal(20)
                player.battery.overclockcooldown = player.battery.overclocktimer.times(1.5)
            },
            unlocked() {return hasUpgrade('energy', 35)} // Determines if you can use the hotkey, optional
        }
    ],
    clickables: {
        11: {
            display() {if (layers.energy.passivebase.gte(1.79e307) && player.achievements.doomsday.eq(0)) return '<span style="font-size: 20px;">Overclock</span><br><span style="font-size: 13px;">Overclocking now may prove dangerous. Beware.</span>'
                else return '<span style="font-size: 20px;">Overclock</span><br><span style="font-size: 13px;">Temporarily gets rid of decay and Energy hardcap.</span>'},
            canClick() { if (layers.energy.passivebase.gte(1.79e307) && player.achievements.doomsday.eq(0)) return player.energy.points.gte(1.79e308)
                else return player.battery.overclockcooldown.lte(0)},
            onClick() {if (layers.energy.passivebase.gte(1.79e307) && player.achievements.doomsday.eq(0)) {
                player.achievements.doomsday = new Decimal(1)
            }
                else {player.battery.overclocktimer = new Decimal(20)
                player.battery.overclockcooldown = player.battery.overclocktimer.times(1.5)}
            },
            unlocked() {return hasUpgrade('energy', 35)},
            style() {
                let rgb1 = player.battery.rgb1; // Example: fluctuating value
                let rgb2 = player.battery.rgb2; // Example: fluctuating value
                if (layers.energy.passivebase.gte(1.79e307) && player.achievements.doomsday.eq(0)) return {
                    "height": "120px !important",
                    "width": "120px !important",
                    "background-image": `radial-gradient(rgb(255, ${rgb1}, ${rgb1}), rgb(255, ${rgb2}, ${rgb2}))`,
                    "color": "#751d19",
                    "font-weight": "bold",
                    "class": "upgBig",
                    "background-size": "cover"
                };
                else return {
                    "height": "120px !important",
                    "width": "120px !important",
                    "background-image": `radial-gradient(rgb(${rgb1}, ${rgb1}, ${rgb1}), rgb(${rgb2}, ${rgb2}, ${rgb2}))`,
                    "color": "#ffffff",
                    "font-weight": "bold",
                    "class": "upgBig",
                    "background-size": "cover"
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
            description: "Battery's Energy Base boost now boosts Energy Points. Improves Energy Upgrade 13 again.",
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
        },31: {
            title: "Never again",
            description: "Reduce Dark Scaling's scaling by 0.03. Dark Energy Upgrades boost both Energy and Dark Energy. Also doubles Dark Cores.",
            tooltip:function() {
                return "Formula: 0.05 x Dark Energy Upgrades <br> Effect: x" + format(new Decimal(0.05).times(player.darkenergy.upgrades.length).add(1).toFixed(2)) + " boost to Energy and Dark Energy.";
            },
            cost: new Decimal(3),
            unlocked() {
                return (hasUpgrade('darkcore', 21))
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
           style() {
            if (player[this.layer].upgrades.includes(31)) {return {"background-color": "#ffffff !important",
                "border": "2px solid !important",
                "border-color": "#000000 !important",
                "color": "#000000 !important",
                "cursor": "default"}}
                else return {"background-color": "#000000 !important",
                "border": "2px solid !important",
                "border-color": "#ffffff !important",
                "color": "#ffffff !important",
                "cursor": "default"}
            }
        },32: {
            title: "Scaled Batteries",
            description: "Batteries boost it's own boost multiplicatively. Only this boost applies to Dark Cores.",
            tooltip:function() {
                return "Formula: Batteries / 5 <br> Effect: x" + format(Decimal.max(1,new Decimal(player.battery.points).div(5).toFixed(2))) + " to Battery boost and Dark Cores. <br> <span style='font-size: 10px;'>GCI reference woah!</span>";
            },
            cost: new Decimal(10),
            unlocked() {
                return (hasUpgrade('darkcore', 21))
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
           style() {
            if (player[this.layer].upgrades.includes(32)) {return {"background-color": "#ffffff !important",
                "border": "2px solid !important",
                "border-color": "#000000 !important",
                "color": "#000000 !important",
                "cursor": "default"}}
                else return {"background-color": "#000000 !important",
                "border": "2px solid !important",
                "border-color": "#ffffff !important",
                "color": "#ffffff !important",
                "cursor": "default"}
            }
        },33: {
            title: "Token Upgrade",
            description:function() {if (hasUpgrade('battery', 33)) return "1.5x Dark Cores. :("
                else return "???"}
,            tooltip:function() {
                if (hasUpgrade('battery', 33)) return "You thought it was a new currency, didn't you? Maybe eventually it'll be useful. <span style='font-size: 10px;'>wink wink, nudge nudge</span>";
                else return ""
            },
            cost: new Decimal(14),
            unlocked() {
                return (hasUpgrade('darkcore', 21)) && getBuyableAmount(`darkcore`,11).gte(4)
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
           style() {
            if (player[this.layer].upgrades.includes(33)) {return {"background-color": "#ffffff !important",
                "border": "2px solid !important",
                "border-color": "#000000 !important",
                "color": "#000000 !important",
                "cursor": "default"}}
                else return {"background-color": "#000000 !important",
                "border": "2px solid !important",
                "border-color": "#ffffff !important",
                "color": "#ffffff !important",
                "cursor": "default"}
            }
        },34: {
            title: "Milestone 4 is useless",
            description: "Compact Emergy total boosts Energy Base, Energy Points, Dark Energy, and Dark Cores.",
            tooltip:function() {
                return "Formula: Compact Energy / 100 <br> Effect: x" + format(new Decimal(1).add(player.compactenergy.total.div(100)).toFixed(2)) + " to Energy Base, Energy Points, Dark Energy, and Dark Cores.";
            },
            cost: new Decimal(20),
            unlocked() {
                return (hasUpgrade('darkcore', 21)) && getBuyableAmount(`darkcore`,11).gte(5)
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
           style() {
            if (player[this.layer].upgrades.includes(34)) {return {"background-color": "#ffffff !important",
                "border": "2px solid !important",
                "border-color": "#000000 !important",
                "color": "#000000 !important",
                "cursor": "default"}}
                else return {"background-color": "#000000 !important",
                "border": "2px solid !important",
                "border-color": "#ffffff !important",
                "color": "#ffffff !important",
                "cursor": "default"}
            }
    },35: {
            title: "Meaning of life",
            description: "Compact Energy's price is divided based on Batteries.",
            tooltip:function() {
                return "Formula: Compact Energy Price / √Batteries <br> Effect: /" + format(Decimal.sqrt(player.battery.points).toFixed(2)) + " to Compact Energy price.";
            },
            cost: new Decimal(42),
            unlocked() {
                return (hasUpgrade('darkcore', 21)) && getBuyableAmount(`darkcore`,11).gte(5)
            },
            onPurchase() {
                return player.battery.points = player.battery.points.add(this.cost)
            },
           style() {
            if (player[this.layer].upgrades.includes(35)) {return {"background-color": "#ffffff !important",
                "border": "2px solid !important",
                "border-color": "#000000 !important",
                "color": "#000000 !important",
                "cursor": "default"}}
                else return {"background-color": "#000000 !important",
                "border": "2px solid !important",
                "border-color": "#ffffff !important",
                "color": "#ffffff !important",
                "cursor": "default"}
            }
    },
    41: {
        title: "The Plan",
        description: "???",
        unlocked(){return hasUpgrade('battery', 35)},
        style() {
            let rgb1 = player.battery.rgb1;
            let rgb2 = player.battery.rgb2;
            if (!player.battery.upgrades.includes(41)) {
            return {
                "height": "200px",
                "width": "200px",
                "background-color": `rgb(255, ${rgb1}, ${rgb1})`,
                "font-size": "15px"
            }
            }
            else return {
                "height": "200px",
                "width": "200px",
                "font-size": "15px"
            }
        },
        cost() {return new Decimal(1e126)},
        canAfford() {
            let cost = this.cost();
            return new Decimal(player.darkenergy.points).gte(cost);
        
    }
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
            effectDescription: "Battery Upgrade 14 is instantaneous. Now, you must get to infinite Energy.",
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
            let scaledbatteries = new Decimal(1)
            if (hasUpgrade('battery', 32)) {Decimal.max(1,scaledbatteries = player.battery.points.div(5))}
            return "Your Batteries are boosting Energy Base by x" + format(new Decimal(player.battery.points).times(scaledbatteries).toFixed(2));
        }],
        ["display-text", function() {
            let amt = getBuyableAmount('compactenergy', 12);
            let b;
        if (player.achievements.doomsday.eq(1)) {
            b = Decimal.floor(player.battery.points.times(1.5));
        } else {
            b = player.battery.points;
        }
            return "Battery cost scales by +^1 per 20 Batteries you have! They are currently ^" + format(new Decimal(2).add(Decimal.floor(new Decimal(new Decimal(b.max(1)).sub(amt)).divide(20))));
        }],
        "resource-display",
        ["display-text", function() 
            { if (player.achievements.doomsday.eq(1))
                return "Due to Doomsday, Batteries scale at x1.5 speed. Effective scaled Batteries is " + format(Decimal.floor(player.battery.points.times(1.5).toFixed(1))) + "."
            else return "";
        }],
        "blank",
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

// Compact Energy Layer

addLayer("compactenergy", {
    startData() { return {                  // startData is a function that returns default data for a layer.               // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        triggeredOnce: new Decimal(0)
    }},
    symbol() {
        return options.imageSymbols ? '<img src="resources/compactenergyfull.png" alt="EN" style="width: 80px; height: 80px;">' : "cEN";
    },
    color: "#e8a22a",                       // The color for this layer, which affects many elements.
    resource: "Compact Energy",            // The name of this layer's main prestige resource.
    row: 1,
    position: 1,                                 // The row this layer is on (0 is the first row).
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
        if (inChallenge('bomb', 11)) {return false}
        return hasMilestone('battery', 4);
    },
    canReset(){return this.getResetGain().gte(1)},
    onPrestige() {
            let amt1 = getBuyableAmount('compactenergy', 11);
            let amt2 = getBuyableAmount('compactenergy', 12);
            if (!hasUpgrade('bomb', 14)) {player.compactenergy.points = player.compactenergy.total
            setBuyableAmount("compactenergy", 11, new Decimal(0));
            setBuyableAmount("compactenergy", 12, new Decimal(0));
            doReset("energy")};
    },
    requires() {if (player.achievements.doomsday.eq(1)) return new Decimal(5000)
        else return new Decimal(500000)},
    getResetGain() {
        let b = player.battery.points
        let divisor = new Decimal(1)
        let blessingamt = Decimal.max(1,new Decimal(2).pow(getBuyableAmount('light', 13)))
        blessingamt = blessingamt.times(new Decimal(1.5).pow(getBuyableAmount('bomb', 13)))
        if (hasUpgrade('bomb', 24)) {blessingamt = blessingamt.times(5)}
        if (hasUpgrade('bomb', 34)) {blessingamt = blessingamt.times(5)}
        if (hasUpgrade('battery', 35)) {divisor = Decimal.sqrt(b)}
        if (player.achievements.doomsday.eq(1) && player.compactenergy.total.gte(100)) {totalResetGain = new Decimal(Decimal.max(0,Decimal.floor(new Decimal(player.energy.points).div(new Decimal(500000).divide(divisor)))).sub(player.compactenergy.total.sub(100)))}
        else if (player.achievements.doomsday.eq(1)) {totalResetGain = Decimal.max(0,Decimal.floor(new Decimal(player.energy.points).div(5000))).sub(player.compactenergy.total)}
        else totalResetGain = Decimal.max(0,Decimal.floor(new Decimal(player.energy.points).div(500000))).sub(player.compactenergy.total)
        let softcapGain = Decimal.floor(Decimal.log10(new Decimal(totalResetGain)).div(2))
        let segmentedGain = Decimal.max(1,new Decimal(10).times(new Decimal(10).pow(softcapGain)))
        let finalGain = Decimal.max(0,totalResetGain).divide(Decimal.max(1,new Decimal(10).pow(softcapGain)))
        if (segmentedGain.eq(10)) {return finalGain}
        else if (segmentedGain.eq(1)) {return finalGain}
        if (player.achievements.doomsday.eq(1) && new Decimal(finalGain).add(segmentedGain).add(player.compactenergy.total).gt(100)) {
            if (player.compactenergy.total.lt(100)) {
            return new Decimal(100).sub(player.compactenergy.total);
            }
        }
        return new Decimal(finalGain).add(segmentedGain).times(blessingamt)
    },  
    getNextAt(x) {
        let b = player.battery.points
        let divisor = new Decimal(1)
        let blessingamt = Decimal.max(1,new Decimal(2).pow(getBuyableAmount('light', 13)))
        if (hasUpgrade('battery', 35)) {divisor = Decimal.sqrt(b)}
        if (player.achievements.doomsday.eq(1) && player.compactenergy.total.gte(100)) {totalResetGain = Decimal.max(0,Decimal.floor(new Decimal(player.energy.points).div(500000)))}
        else if (player.achievements.doomsday.eq(1)) {totalResetGain = Decimal.max(0,Decimal.floor(new Decimal(player.energy.points).div(5000)))}
        else totalResetGain = Decimal.max(0,Decimal.floor(new Decimal(player.energy.points).div(500000)))
        if (player.achievements.doomsday.eq(1) && player.compactenergy.total.gte(100)) cap = Decimal.floor(new Decimal(player.compactenergy.total).sub(100))
        else cap = Decimal.floor(new Decimal(player.compactenergy.total))
        let softcapGain = Decimal.floor(Decimal.log10(new Decimal(player.compactenergy.total).add(totalResetGain)).div(2))
        if (player.achievements.doomsday.eq(1) && player.compactenergy.total.gte(100)) {return new Decimal(500000).divide(divisor).times(new Decimal(1).add(Decimal.max(cap,totalResetGain).sub(x)))}
        else if (player.achievements.doomsday.eq(1)) {return new Decimal(5000).times(new Decimal(1).add(Decimal.max(cap,totalResetGain).sub(x)))}
        return new Decimal(500000).times(new Decimal(1).add(Decimal.max(cap,totalResetGain).sub(x)))
    },
    resetsNothing() {return hasUpgrade('bomb', 14)},
    autoPrestige() {return hasUpgrade('bomb', 14)},
    type: "custom",
    prestigeButtonText() {
        return '<span style="font-size: 13px;"> Convert </span><span style="font-size: 15px;">' + format(player.energy.points) + '</span><span style="font-size: 13px;"> Energy into </span><span style="font-size: 15px;">' + format(this.getResetGain()) + '</span><span style="font-size: 13px;"> Compact Energy </span>';
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
                    return 'Batteries scale +1.00 later.<br><span style="font-size: 15px;">Current Effect: Batteries scale ' + format(new Decimal(1).times(amt).toFixed(2)) + ' later. <br>Cost: ' + format(this.cost()) + ' Compact Energy </span><br>Bought: ' + format(amt);
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
        ["display-text", function() {
            if (player.achievements.doomsday.eq(1))return 'Due to Doomsday, Compact Energy Requirement is /100 until you get 100.'
        else return ""}],
        "resource-display",
        "blank",
        "buyables",
        "clickables",
        "upgrades",
    ],

    layerShown() {
        if (inChallenge('bomb', 11)) {return false}
        if (player.achievements.doomsday.eq(1)) {return hasUpgrade('darkcore', 22)}
        else return hasMilestone('battery', 4)},          // Returns a bool for if this layer's node should be visible in the tree.
}
)   

// Dark Energy Layer

addLayer("darkenergy", {
    startData() { return {                  // startData is a function that returns default data for a layer.               // You can add more variables here to add them to your layer.
        points: new Decimal(1),
        darkenergyexpo: new Decimal(1),
        timemult: new Decimal(1),
        outofrun: new Decimal(1),
    }},
    symbol() {
        return options.imageSymbols ? '<img src="resources/darkenergyfull.png" alt="EN" style="width: 80px; height: 80px;">' : "dEN";
    },
    color: "#424242",                       // The color for this layer, which affects many elements.
    resource: "Dark Energy",            // The name of this layer's main prestige resource.
    row: 0,
    position: 1,                                 // The row this layer is on (0 is the first row).
    baseResource: "Energy Points",
    branches: ["energy", "battery", "compact energy", "light"],
    type: "custom",
    canBuyMax(){return true},
    style() {
        return {
            "background-color": "#000000",
            "background-size": "cover"
        };
    },
    doReset(layer) {
        if (layer !== this.layer) {
            let savedCurrency = player[this.layer].points; // Save the currency amount
            layerDataReset(this.layer, ["upgrades", "buyables", "points"]);
            player[this.layer].points = savedCurrency; // Restore the currency amount
    
            // Save all existing upgrades
            player[this.layer].upgrades = player[this.layer].upgrades.filter(upg => true);
    
            // Ensure upgrade 51 stays bought
            if (!player[this.layer].upgrades.includes(51) && hasUpgrade(this.layer, 51)) {
                player[this.layer].upgrades.push(51);
            }
    
            const buyableID = 11;
            if (player[this.layer].buyables[buyableID]) {
                let currentAmount = new Decimal(player[this.layer].buyables[buyableID]);
                player[this.layer].buyables[buyableID] = currentAmount;
            }
        }  
    },
    prestigeButtonText(){return "You are getting " + format(layers.darkenergy.getResetGain()) + " Dark Energy."},
    canReset(){return this.getResetGain().gt(0)},
    update(diff){
        // time stuff
        if (!hasUpgrade('bomb', 53)) {
        let timemult = new Decimal(1);
        if (hasUpgrade('darkenergy', 11)) {timemult = timemult.times(1.5);}
        if (hasUpgrade('darkenergy', 41)) {timemult = timemult.times(10);}
        player.darkenergy.timemult = timemult;
        player.darkenergy.darkenergyexpo = player.darkenergy.darkenergyexpo.sub(new Decimal(diff).div(new Decimal(120).div(player.darkenergy.timemult)))
        if (player.darkenergy.darkenergyexpo.lt(0)) player.darkenergy.darkenergyexpo = new Decimal(0) 
        
        if (new Decimal(player.darkenergy.darkenergyexpo).lte(0)) {player.darkenergy.outofrun = new Decimal(1)}}

    },
    getResetGain() {let passivebase = new Decimal(11);
        let darkpower = getBuyableAmount('darkcore', 11).pow(0.5)
        darkenergyexpo = Decimal.min(darkpower.add(1),player.darkenergy.darkenergyexpo)


        // passivebase

        if (hasUpgrade('darkenergy', 11)) {passivebase = passivebase.times(3)}
        if (hasUpgrade('darkenergy', 12)) {passivebase = passivebase.times(2)}
        if (hasUpgrade('darkenergy', 13)) {passivebase = passivebase.times(player.points.pow(0.1))}
        if (hasUpgrade('darkenergy', 14)) {passivebase = passivebase.times(new Decimal(0.2).times(Decimal.floor(Decimal.log10(Decimal.max(1, player.darkenergy.points)))).add(1))}
        if (hasUpgrade('darkenergy', 21)) {passivebase = passivebase.times(100)}
        if (hasUpgrade('bomb', 23)) {}
        else if (hasUpgrade('darkenergy', 22)) {passivebase = passivebase.div(10)}
        if (hasUpgrade('bomb', 23)) {}
        else if (hasUpgrade('darkenergy', 24)) {passivebase = passivebase.div(5)}
        if (hasUpgrade('energy', 41)) {passivebase = passivebase.times(Decimal.max(1,Decimal.log10(player.energy.points)))}
        if (hasUpgrade('darkenergy', 31)) {passivebase = passivebase.times(10)}
        if (hasUpgrade('battery', 31)) {passivebase = passivebase.times(new Decimal(0.05).times(player.darkenergy.upgrades.length).add(1))}

        if (hasUpgrade('battery', 32)) {passivebase = passivebase.times(player.battery.points.times(Decimal.max(1,player.battery.points.div(5))))}
        else if (hasUpgrade('energy', 43)) {if (player.battery.points.gte(1)) passivebase = passivebase.times(new Decimal(player.battery.points))};

        if (hasUpgrade('darkenergy', 41)) {passivebase = passivebase.times(4)}
        if (hasUpgrade('battery', 34)) {passivebase = passivebase.times(new Decimal(1).add(player.compactenergy.total.div(100)))}

        passivebase = passivebase.times(Decimal.max(1,new Decimal(player.darkcore.points).pow(0.2)))

        passivebase = passivebase.times(Decimal.max(1, player.light.points.pow(0.25)))
        passivebase = passivebase.times(new Decimal(10).pow(getBuyableAmount('light', 12)))
        passivebase = passivebase.times(new Decimal(1.5).pow(getBuyableAmount('bomb', 12)))

        passivebase = Decimal.max(0,passivebase.pow(darkenergyexpo))
        if (passivebase.gte(new Decimal("1e3200"))) {passivebase = new Decimal("1e3200").add(passivebase.sub(new Decimal("1e3200")).pow(0.85))}
        return passivebase.div(10)},
    autoPrestige() {if (player.darkenergy.outofrun.eq(1)) return false
        else return true
    },
    getNextAt() {return new Decimal(0)},
    resetsNothing(){return true},
    clickables: {
        11: {
            display() {if (new Decimal(player.darkenergy.darkenergyexpo).lte(0)) {
                return '<span style="font-size: 20px;">Begin Dark Run</span>'}
                else if (new Decimal(player.darkenergy.darkenergyexpo).gt(0)) {
                    return '<span style="font-size: 20px;">End Dark Run</span>'}},
            canClick() {return true},
            onClick() {if (new Decimal(player.darkenergy.darkenergyexpo).gt(0)) {player.darkenergy.darkenergyexpo = new Decimal(0)
                player.darkenergy.outofrun = new Decimal(1)}
                else if (new Decimal(player.darkenergy.darkenergyexpo).lte(0)) {player.darkenergy.upgrades = player.darkenergy.upgrades.filter(upgrade => upgrade === 51);
                    player.darkenergy.points = new Decimal(0)
                    player.darkenergy.outofrun = new Decimal(0)
                    player.darkenergy.darkenergyexpo = new Decimal(1)
                    player.darkenergy.timemult = new Decimal(1)
                    setBuyableAmount('darkenergy', 11, new Decimal(0))
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
    title: "Sacrifice",
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
},31: {
    title: "Void",
    description: "Stop generating Energy Points until reset, but receive 10x more Dark Energy, and improve Dark Core formula.",
    tooltip:function(){
     return "Buying this upgrade will make Upgrade 31 1e9x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(2)},
    cost() {if (hasUpgrade('darkenergy', 32)) {return new Decimal(1.5e26)}
        else return new Decimal(1.5e17)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},32: {
    title: "Calling",
    description: "You can't reset for Dark Cores until this upgrade is reset, but 1.5x Energy Base, and 10x Energy Points.",
    tooltip:function(){
     return "Buying this upgrade will make Upgrade 32 1e9x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(2)},
    cost() {if (hasUpgrade('darkenergy', 31)) {return new Decimal(1.5e26)}
        else return new Decimal(1.5e17)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},33: {
    title: "Poverty",
    description: "Adds 7 effective levels to Dark Scaling.",
    tooltip:function(){
     return "Buying this upgrade will make Upgrade 34 1e10x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(4)},
    cost() {if (hasUpgrade('darkenergy', 34)) {return new Decimal(3e38)}
        else return new Decimal(3e28)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},34: {
    title: "Capitalism",
    description: "Dark Core formula is boosted.",
    tooltip:function(){
     return "Buying this upgrade will make Upgrade 33 1e10x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(4)},
    cost() {if (hasUpgrade('darkenergy', 33)) {return new Decimal(3e38)}
        else return new Decimal(3e28)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},41: {
    title: "Insanity",
    description: "Triples Dark Cores, quadruples Dark Energy, and 1.5x Energy Base, but the timer goes 10x faster.",
    tooltip:function(){
     return "Buying this upgrade will make Upgrade 42 1e11x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(4) && hasUpgrade('battery', 32)},
    cost() {if (hasUpgrade('darkenergy', 42)) {return new Decimal(1e45)}
        else return new Decimal(1e34)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},42: {
    title: "Comprehend",
    description: "Adds 4 effective levels to Dark Scaling, 1.35x Energy Base, and 5x Energy Points.",
    tooltip:function(){
     return "Buying this upgrade will make Upgrade 41 1e11x more expensive."
    },
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(4) && hasUpgrade('battery', 32)},
    cost() {if (hasUpgrade('darkenergy', 41)) {return new Decimal(1e45)}
        else return new Decimal(1e34)},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);

}
},51: {
    title: "Revelation",
    description: "Unlocks something.",
    unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(10)},
    style() {return {
        "height": "200px",
        "width": "200px",
        "font-size": "15px"}},
    cost() {return new Decimal(1e136)},
    onPurchase() {player.darkenergy.persistentFlag = true},
    canAfford() {
        let cost = this.cost();
        if (new Decimal(player.darkenergy.outofrun).eq(1)) {
            return false; 
        }
        else new Decimal(player.darkenergy.points).gte(cost);
    
}
},
    
},
hotkeys: [
    {
        key: "d", // What the hotkey button is. Use uppercase if it's combined with shift, or "ctrl+x" for holding down ctrl.
        description: "D: Dark Core Reset", // The description of the hotkey that is displayed in the game's How To Play tab
        onPress() {if (player.darkenergy.outofrun.eq(1)) {
            doReset('darkcore')}
        },
        unlocked() {return player.achievements.doomsday.eq} // Determines if you can use the hotkey, optional
    }
],
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
                ["display-text", function() {
                    if (layers.darkenergy.getResetGain().gte(new Decimal("1e3200"))) {
                        return "Past 1e3200, Dark Energy is softcapped by ^0.85!"
                    }
                }],
                "blank",
                "buyables",
                "upgrades"
            ]
        
        },
        "Dark Cores": {
            embedLayer: 'darkcore',
        },
    }})


// Dark Core Layer //

addLayer("darkcore", {
    startData() { return {                  // startData is a function that returns default data for a layer.               // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        rgb1: new Decimal(0),
        rgb2: new Decimal(255),
    }},
    symbol() {
        return options.imageSymbols ? '<img src="resources/darkcorefull.png" alt="EN" style="width: 80px; height: 80px;">' : "DC";
    },
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
     doReset(layer) {
        if (layer !== this.layer) {
            let savedCurrency = player[this.layer].points; // Save the currency amount
            layerDataReset(this.layer, ["upgrades", "buyables", "points"]);
            player[this.layer].points = savedCurrency; // Restore the currency amount

            let upgradesToKeep = [11, 21, 22];
            player[this.layer].upgrades = player[this.layer].upgrades.filter(upg => upgradesToKeep.includes(upg));

            const buyableID = 11;
            if (player[this.layer].buyables[buyableID]) {
                let currentAmount = new Decimal(player[this.layer].buyables[buyableID]);
                player[this.layer].buyables[buyableID] = currentAmount;
            }
        }  
    },
     buyables: {
        11: {
            title: "Dark Power",
            purchaseLimit() {return new Decimal(81)},
            cost() {let amt = getBuyableAmount('darkcore', 11)
                return new Decimal(100).pow(Decimal.max(1,amt.add(1)))               
            },
            canAfford(){
                let cost = this.cost()
                if (getBuyableAmount('darkcore', 11).eq(3)) {return player.darkcore.points.gte(cost) && hasUpgrade('battery', 31)}
                return player.darkcore.points.gte(cost)
            },
            buy(){let cost = this.cost()
                let amt = getBuyableAmount('darkcore', 11)
                setBuyableAmount('darkcore', 11, amt.add(1))
                if (!player.bomb.total.gte(1)) {
                player.darkcore.points = new Decimal(0)
                player.darkenergy.upgrades = player.darkenergy.upgrades.filter(upgrade => upgrade === 51);
                player.darkenergy.points = new Decimal(0)
                player.darkenergy.outofrun = new Decimal(1)
                player.darkenergy.darkenergyexpo = new Decimal(0)
                player.darkenergy.timemult = new Decimal(1)
                setBuyableAmount('darkenergy', 11, new Decimal(0))}
                else player.darkcore.points = player.darkcore.points.sub(cost)
            },
            display(){let cost = this.cost()
                return '<span style="font-size: 13px">Resets Dark Cores, Dark Energy, and side nodes.<br> Each level of Dark Power increases Dark Energy exponent cap by √amt.<br>Also tends to unlock new upgrades or features.</span><br><span style="font-size: 20px">Bought: ' + format(getBuyableAmount('darkcore', 11)) + '<br>Cost: ' + format(cost)},
                style() {if (player.darkcore.points.lt(this.cost()))
                    return {
                        "background-color": `#000000`,
                        "color": "#ffffff",
                        "border": "2px solid",
                        "border-color": "#ffffff",
                        "font-weight": "bold",
                    };
                },
        },12: {
            title: "Dark Scaling",
            purchaseLimit() {return new Decimal(1000)},
            cost() {let amt = getBuyableAmount('darkcore', 12)
                if (hasUpgrade('battery', 31)) {return new Decimal(1e6).times(new Decimal(1.17).pow(amt))}
                return new Decimal(1e6).times(new Decimal(1.2).pow(amt))              
            },
            canAfford(){if (new Decimal(player.darkenergy.outofrun).eq(0)){return false}
                let cost = this.cost()
                return player.darkcore.points.gte(cost)
            },
            buy(){let cost = this.cost()
                let amt = getBuyableAmount('darkcore', 12)
                setBuyableAmount('darkcore', 12, amt.add(1))
                player.darkcore.points = player.darkcore.points.sub(cost)
            },
            tooltip() {
                let effectivelevels = new Decimal(0);
                if (hasUpgrade('darkenergy', 33)) {
                    effectivelevels = effectivelevels.add(7);
                }
                if (hasUpgrade('darkenergy', 42)) {
                    effectivelevels = effectivelevels.add(4);
                }
                return "True reduced amount is x" + new Decimal(0.94).pow(getBuyableAmount('darkcore', 12).add(effectivelevels)).toString() + "<br> to Battery cost.";
            },
            display(){let cost = this.cost()
                let effectivelevels = new Decimal(0)
                if (hasUpgrade('darkenergy', 33)) {effectivelevels = effectivelevels.add(7)}
                if (hasUpgrade('darkenergy', 42)) {effectivelevels = effectivelevels.add(4)}
                return '<span style="font-size: 13px">Multiplies the cost of Batteries by 0.94x per level.</span><br><span style="font-size: 20px">Bought: ' + format(getBuyableAmount('darkcore', 12)) + ' (+' + format(effectivelevels) + ')<br>Cost: ' + format(cost) + '<br>Effect: ' + format(new Decimal(0.94).pow(getBuyableAmount('darkcore', 12).add(effectivelevels))) + 'x to Battery cost.'},
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
    autoPrestige() {return hasUpgrade('bomb', 33)},
    resetsNothing() {return true},
    canReset(){
        return this.getResetGain().gte(1)
    },
    getResetGain(){let bonuspow = new Decimal(0)
        if (hasUpgrade('darkenergy', 31)) {bonuspow = bonuspow.add(0.5)}
        if (hasUpgrade('darkenergy', 34)) {bonuspow = bonuspow.add(0.2)}
        resetGain = Decimal.max(0,Decimal.floor(Decimal.log10(player.darkenergy.points).pow(new Decimal(3).add(bonuspow))))
        if (hasUpgrade('darkenergy', 22)) {resetGain = resetGain.times(Decimal.max(1,resetGain.pow(0.13)))}
        if (hasUpgrade('darkenergy', 23)) {resetGain = resetGain.times(5)}
        if (hasUpgrade('darkenergy', 24)) {resetGain = resetGain.times(6.66)}
        if (hasUpgrade('bomb', 43)) {}
        else if (hasUpgrade('darkenergy', 32)) {resetGain = new Decimal(0)}
        if (hasUpgrade('energy', 42)) {resetGain = resetGain.times(2)}
        if (hasUpgrade('battery', 31)) {resetGain = resetGain.times(2)}
        if (hasUpgrade('battery', 32)) {resetGain = resetGain.times(Decimal.max(1,player.battery.points.div(5)))}
        if (hasUpgrade('darkenergy', 41)) {resetGain = resetGain.times(3)}
        if (hasUpgrade('battery', 33)) {resetGain = resetGain.times(1.5)}
        if (hasUpgrade('battery', 34)) {resetGain = resetGain.times(new Decimal(1).add(player.compactenergy.total.div(100)))}
        resetGain = resetGain.times(new Decimal(10).pow(getBuyableAmount('light', 12)))
        resetGain = resetGain.times(new Decimal(1.5).pow(getBuyableAmount('bomb', 12)))

        return resetGain
    },
    upgrades: {
        11: {
            title: "Re-energized",
            description: "Re-unlocks Energy. Energy is now reduced.",
            cost(){return new Decimal(1.5e5)},
            canAfford() {
                let cost = this.cost();
                return new Decimal(player.darkcore.points).gte(cost);
            },
            unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(2)},
        }, 21: {
            title: "Revitalized Batteries",
            description: "Re-unlocks Batteries. Batteries scale faster.",
            cost(){return new Decimal(4e7)},
            canAfford() {
                let cost = this.cost();
                return new Decimal(player.darkcore.points).gte(cost);
            },
            unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(3)},
        }, 22: {
            title: "Recompressed Compact Energy",
            description: "Re-unlocks Compact Energy. It starts off a bit easier.",
            cost(){return new Decimal(7.5e9)},
            canAfford() {
                let cost = this.cost();
                return new Decimal(player.darkcore.points).gte(cost);
            },
            unlocked(){return new Decimal(getBuyableAmount('darkcore', 11)).gte(5)},
        }, 
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
                ["display-text", function() {
                        return 'Doing a Dark Core reset will reset same-row nodes.';
                }],
                "blank",
                "upgrades",
                "buyables",
                "clickables"
    ]
    })

    // Light Layer // 

    addLayer("light", {
        startData() { return {                  // startData is a function that returns default data for a layer.               // You can add more variables here to add them to your layer.
            points: new Decimal(0),
        }},
        symbol() {
            return options.imageSymbols ? '<img src="resources/lightfull.png" alt="EN" style="width: 80px; height: 80px;">' : "L";
        },
        color: "#80d9ed",
        branches: ["energy", "compactenergy", "darkenergy"],
        resource: "Light",            // The name of this layer's main prestige resource.
        row: 1,
        position: 2,                                 // The row this layer is on (0 is the first row).
        baseResource: "Energy",
        baseAmount() {return player.energy.points},
        type: "custom",
        requires: new Decimal(10),
        unlocked() {return hasUpgrade('darkenergy', 51)},
        layerShown() {return hasUpgrade('darkenergy', 51)},
        autoPrestige() {return hasUpgrade('darkenergy', 51)},
        resetsNothing() {return true},
        style() {
            return {
                "background-image": "linear-gradient(to top,rgb(71, 93, 110),rgb(99, 142, 159))",
                "background-size": "cover"
            };
        },
        getNextAt(){return new Decimal(10)},
        canReset(){return this.getResetGain().gt(0)},
        prestigeButtonText() {'blah'},
        getResetGain() {
            let passive = new Decimal(0);
            let passivebase = new Decimal(10);
    
            // passive base

            passivebase = Decimal.max(0,player.energy.points.pow(0.05)).add(Decimal.max(0,player.darkenergy.points.pow(0.008))).add(Decimal.max(0,player.compactenergy.total.pow(0.05)))
            passivebase = passivebase.times(new Decimal(3).pow(getBuyableAmount('light', 14)))
            passivebase = passivebase.times(new Decimal(1.7).pow(getBuyableAmount('bomb', 22)))
    
            // passive
            passive = passivebase
            return passive.div(10);
        },
        buyables: {
            respec() {
                setBuyableAmount("light", 11, new Decimal(0));
                setBuyableAmount("light", 12, new Decimal(0));
                setBuyableAmount("light", 13, new Decimal(0));
                setBuyableAmount("light", 14, new Decimal(0));
            },
            respecText() {
                return 'Respec Blessings for no return.'
            },
            showRespec() {
                return true
                
            },
            respecMessage: ".",
            11: {
                title: "Blessing of Life",
                cost() {let amt = getBuyableAmount('light', 11).add(getBuyableAmount('light', 12).add(getBuyableAmount('light', 13).add(getBuyableAmount('light', 14))))
                    if (!hasUpgrade('bomb', 44)) {return new Decimal(10).pow(Decimal.max(0,amt))}
                    return new Decimal(10).pow(Decimal.max(0,amt)).div(2)
                },
                canAfford(){
                    let cost = this.cost()
                    return player.light.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('light', 11)
                    setBuyableAmount('light', 11, amt.add(1))
                    if (!hasUpgrade('bomb', 44)) {player.light.points = player.light.points.sub(cost)}
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('light', 11)
                    return '<span style="font-size: 15px">Multiplies Energy by 2x compounding.</span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(2).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                purchaseLimit() {return new Decimal(30)}
                },
            12: {
                title: "Blessing of Death",
                cost() {let amt = getBuyableAmount('light', 11).add(getBuyableAmount('light', 12).add(getBuyableAmount('light', 13).add(getBuyableAmount('light', 14))))
                    if (!hasUpgrade('bomb', 44)) {return new Decimal(10).pow(Decimal.max(0,amt))}
                    return new Decimal(10).pow(Decimal.max(0,amt)).div(2)           
                },
                canAfford(){
                    let cost = this.cost()
                    return player.light.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('light', 12)
                    setBuyableAmount('light', 12, amt.add(1))
                    if (!hasUpgrade('bomb', 44)) {player.light.points = player.light.points.sub(cost)}
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('light', 12)
                    return '<span style="font-size: 15px">Multiplies Dark Energy and Dark Cores by 10x compounding. </span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(10).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                purchaseLimit() {return new Decimal(30)}
                },
            13: {
                title: "Blessing of Fortitude",
                cost() {let amt = getBuyableAmount('light', 11).add(getBuyableAmount('light', 12).add(getBuyableAmount('light', 13).add(getBuyableAmount('light', 14))))
                    if (!hasUpgrade('bomb', 44)) {return new Decimal(10).pow(Decimal.max(0,amt))}
                    return new Decimal(10).pow(Decimal.max(0,amt)).div(2)            
                },
                canAfford(){
                    let cost = this.cost()
                    return player.light.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('light', 13)
                    setBuyableAmount('light', 13, amt.add(1))
                    if (!hasUpgrade('bomb', 44)) {player.light.points = player.light.points.sub(cost)}
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('light', 13)
                    return '<span style="font-size: 15px">Multiplies Compact Energy by 2x compounding.</span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(2).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                purchaseLimit() {return new Decimal(30)}
                },
            14: {
                title: "Blessing of Purity",
                cost() {let amt = getBuyableAmount('light', 11).add(getBuyableAmount('light', 12).add(getBuyableAmount('light', 13).add(getBuyableAmount('light', 14))))
                    if (!hasUpgrade('bomb', 44)) {return new Decimal(10).pow(Decimal.max(0,amt))}
                    return new Decimal(10).pow(Decimal.max(0,amt)).div(2)             
                },
                canAfford(){
                    let cost = this.cost()
                    return player.light.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('light', 14)
                    setBuyableAmount('light', 14, amt.add(1))
                    if (!hasUpgrade('bomb', 44)) {player.light.points = player.light.points.sub(cost)}
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('light', 14)
                    return '<span style="font-size: 15px">Multiplies Light by 3x compounding.</span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(3).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                purchaseLimit() {return new Decimal(30)}
                },
            },
            
        tabFormat: [
            "main-display",
            "resource-display",
            ["display-text", function() {
                return 'Light formula is (energy^0.05) + (darkenergy^0.008) + (compactenergy^0.05)';}],
            ["display-text", function() {
                return 'Light is boosting Energy Base and Dark Energy by x' + format(player.light.points.pow(0.25));}], 
            "blank",
            "blank",
            "buyables",
            "upgrades",
            "blank",
        ],
    }),

    // Bomb Layer
    addLayer("bomb", {
        startData() { return {                  // startData is a function that returns default data for a layer.               // You can add more variables here to add them to your layer.
            points: new Decimal(0),
            radius: new Decimal(0),
            topradius: new Decimal(0)
        }},
        symbol() {
            return options.imageSymbols ? '<img src="resources/bombfull.png" alt="EN" style="width: 80px; height: 80px;">' : "L";
        },
        color: "#d95b07",
        branches: ["energy", "battery", "darkenergy", "light", "compactenergy"],
        resource: "Deaths",            // The name of this layer's main prestige resource.
        row: 2,
        position: 0,                                 // The row this layer is on (0 is the first row).
        baseResource: "Batteries",
        baseAmount() {return player.battery.points},
        type: "custom",
        requires: new Decimal(1e126),
        unlocked() {return hasUpgrade('battery', 41) || player.bomb.total.gte(1)},
        layerShown() {return hasUpgrade('battery', 41) || player.bomb.total.gte(1)},
        onPrestige() {layerDataReset('energy')
            layerDataReset('darkcore')
            layerDataReset('darkenergy')
            layerDataReset('battery')
            layerDataReset('compactenergy')
            layerDataReset('light')
            if (layers.bomb.radius.gt(layers.bomb.topradius)) {layers.bomb.topradius = layers.bomb.radius}
        },
        style() {
            return {
                "background-image": "linear-gradient(to top,rgb(119, 28, 28),rgb(206, 183, 30))",
                "background-size": "cover"
            };
        },
        prestigeButtonText(){if (player.battery.points.gte(1e126) && player.energy.points.gte(new Decimal("1e430"))) {return "Combine " + format(player.battery.points) + " Batteries and " + format(player.energy.total) + " Energy into a bomb with a radius of " + format(layers.bomb.radius) + "km², giving " + format(this.getResetGain()) + " Deaths."}
            return "You need 1e126 Batteries and 1e430 Energy to combine into a bomb."
        },
        canReset(){return player.battery.points.gte(1e126) && player.energy.points.gte(new Decimal("1e430"))},
        
        getResetGain() {let base = new Decimal(7)
        let batteries = player.battery.points
        let energy = player.energy.points
        let radiusb = Decimal.max(0,Decimal.log10(batteries.div(1e126)))
        let radiuse = Decimal.max(0,Decimal.log10(energy.div(new Decimal("1e430"))))
        let radius = base.times(Decimal.max(0,new Decimal(1).add(radiuse.div(100)))).times(Decimal.max(0,new Decimal(1).add(radiusb.div(100))))
        gain = radius.times(100)
        layers.bomb.radius = radius
        gain = gain.times(new Decimal(1.3).pow(getBuyableAmount('bomb', 23)))
        if (hasMilestone('bomb', 1)) {gain = gain.times(new Decimal(1).add(Decimal.log10(player.light.points).div(100)))}
        return Decimal.floor(gain)
        },

        getNextAt() {return new Decimal(0)},
        update(diff) {

            if (player.bomb.total.gte(1)) {
                if (!player.darkcore.upgrades.includes(11)) player.darkcore.upgrades.push(11);
                if (!player.battery.upgrades.includes(41)) player.battery.upgrades.push(41);
            }

            // upgrade handling stuff
            
            // energy

            if (hasUpgrade('bomb', 11)) {
                if (!player.energy.upgrades.includes(11)) player.energy.upgrades.push(11);
                if (!player.energy.upgrades.includes(12)) player.energy.upgrades.push(12);
                if (!player.energy.upgrades.includes(13)) player.energy.upgrades.push(13);
                if (!player.energy.upgrades.includes(14)) player.energy.upgrades.push(14);
                if (!player.energy.upgrades.includes(21)) player.energy.upgrades.push(21);
                if (!player.energy.upgrades.includes(22)) player.energy.upgrades.push(22);
                if (!player.energy.upgrades.includes(23)) player.energy.upgrades.push(23);
                if (!player.energy.upgrades.includes(24)) player.energy.upgrades.push(24);
                if (!player.battery.milestones.includes(0)) player.battery.milestones.push(0);
                if (!player.darkcore.upgrades.includes(11)) player.darkcore.upgrades.push(11);
            }
            if (hasUpgrade('bomb', 21)) {
                if (!player.battery.milestones.includes(3)) player.battery.milestones.push(3);
                if (!player.battery.milestones.includes(7)) player.battery.milestones.push(7);
            }
            if (hasUpgrade('bomb', 31)) {
                if (!player.energy.upgrades.includes(31)) player.energy.upgrades.push(31);
                if (!player.energy.upgrades.includes(32)) player.energy.upgrades.push(32);
                if (!player.energy.upgrades.includes(33)) player.energy.upgrades.push(33);
                if (!player.energy.upgrades.includes(34)) player.energy.upgrades.push(34);
                if (!player.energy.upgrades.includes(35)) player.energy.upgrades.push(35);
            }
            if (hasUpgrade('bomb', 41)) {
                if (!player.energy.upgrades.includes(41)) player.energy.upgrades.push(41);
                if (!player.energy.upgrades.includes(42)) player.energy.upgrades.push(42);
                if (!player.energy.upgrades.includes(43)) player.energy.upgrades.push(43);
                if (!player.energy.upgrades.includes(44)) player.energy.upgrades.push(44);
            }
            if (hasUpgrade('bomb', 51)) {
                player.battery.overclocktimer = new Decimal(1)
            }

            // battery

            if (hasUpgrade('bomb', 12)) {
                if (!player.battery.upgrades.includes(11)) player.battery.upgrades.push(11);
                if (!player.battery.upgrades.includes(12)) player.battery.upgrades.push(12);
                if (!player.battery.upgrades.includes(13)) player.battery.upgrades.push(13);
                if (!player.battery.upgrades.includes(14)) player.battery.upgrades.push(14);
                if (!player.battery.upgrades.includes(21)) player.battery.upgrades.push(21);
                if (!player.battery.upgrades.includes(22)) player.battery.upgrades.push(22);
                if (!player.battery.upgrades.includes(23)) player.battery.upgrades.push(23);
                if (!player.battery.upgrades.includes(24)) player.battery.upgrades.push(24);
            }
            if (hasUpgrade('bomb', 22)) {
                if (!player.battery.milestones.includes(1)) player.battery.milestones.push(1);
                if (!player.battery.milestones.includes(6)) player.battery.milestones.push(6);
                if (!player.battery.milestones.includes(9)) player.battery.milestones.push(9);
                if (!player.darkcore.upgrades.includes(21)) player.darkcore.upgrades.push(21);
            }
            if (hasUpgrade('bomb', 32)) {
                if (!player.battery.milestones.includes(4)) player.battery.milestones.push(4);
                if (!player.battery.milestones.includes(5)) player.battery.milestones.push(5);
                if (!player.battery.milestones.includes(10)) player.battery.milestones.push(10);
            }
            if (hasUpgrade('bomb', 42)) {
                if (!player.battery.milestones.includes(2)) player.battery.milestones.push(2);
                if (!player.battery.milestones.includes(8)) player.battery.milestones.push(8);
            }
            if (hasUpgrade('bomb', 52)) {
                if (!player.battery.upgrades.includes(31)) player.battery.upgrades.push(31);
                if (!player.battery.upgrades.includes(32)) player.battery.upgrades.push(32);
                if (!player.battery.upgrades.includes(33)) player.battery.upgrades.push(33);
                if (!player.battery.upgrades.includes(34)) player.battery.upgrades.push(34);
                if (!player.battery.upgrades.includes(35)) player.battery.upgrades.push(35);
            }

            // dark energy

            if (hasUpgrade('bomb', 13)) {
                if (!player.darkenergy.upgrades.includes(11)) player.darkenergy.upgrades.push(11);
                if (!player.darkenergy.upgrades.includes(12)) player.darkenergy.upgrades.push(12);
                if (!player.darkenergy.upgrades.includes(13)) player.darkenergy.upgrades.push(13);
                if (!player.darkenergy.upgrades.includes(14)) player.darkenergy.upgrades.push(14);
            }
            if (hasUpgrade('bomb', 23)) {
                if (!player.darkenergy.upgrades.includes(21)) player.darkenergy.upgrades.push(21);
                if (!player.darkenergy.upgrades.includes(22)) player.darkenergy.upgrades.push(22);
                if (!player.darkenergy.upgrades.includes(23)) player.darkenergy.upgrades.push(23);
                if (!player.darkenergy.upgrades.includes(24)) player.darkenergy.upgrades.push(24);
            }
            if (hasUpgrade('bomb', 33)) {
                let darkpower = getBuyableAmount('darkcore', 11).pow(0.5)
                if (player.darkenergy.outofrun.eq(0)) {player.darkenergy.darkenergyexpo = new Decimal(1e100)}
            }
            if (hasUpgrade('bomb', 43)) {
                if (!player.darkenergy.upgrades.includes(31)) player.darkenergy.upgrades.push(31);
                if (!player.darkenergy.upgrades.includes(32)) player.darkenergy.upgrades.push(32);
                if (!player.darkenergy.upgrades.includes(33)) player.darkenergy.upgrades.push(33);
                if (!player.darkenergy.upgrades.includes(34)) player.darkenergy.upgrades.push(34);
                if (!player.darkenergy.upgrades.includes(41)) player.darkenergy.upgrades.push(41);
                if (!player.darkenergy.upgrades.includes(42)) player.darkenergy.upgrades.push(42);
            }
            if (hasUpgrade('bomb', 53)) {
                player.darkenergy.outofrun = new Decimal(0)
                let amt = getBuyableAmount('darkcore', 12)
                let cost = new Decimal(0)
                if (hasUpgrade('battery', 31)) {cost = new Decimal(1e6).times(new Decimal(1.17).pow(amt))}
                else cost = new Decimal(1e6).times(new Decimal(1.2).pow(amt))
                if (player.darkcore.points.gte(cost)) {
                    setBuyableAmount('darkcore', 12, amt.add(1))
                }
            }

            // miscellanious
            if (hasUpgrade('bomb', 24)) {
                if (!player.darkcore.upgrades.includes(22)) player.darkcore.upgrades.push(22);
            }
            if (hasUpgrade('bomb', 34)) {
                if (player.compactenergy.points.lte(new Decimal("1e600"))) {
                if (!player.lastMaxBuy || Date.now() - player.lastMaxBuy > 500) {
                    if ((player.lastMaxBuyOrder || 0) % 2 === 0) {
                        buyMaxBuyable('compactenergy', 11);
                        buyMaxBuyable('compactenergy', 12);
                    } else {
                        buyMaxBuyable('compactenergy', 12);
                        buyMaxBuyable('compactenergy', 11);
                    }
                    player.lastMaxBuyOrder = (player.lastMaxBuyOrder || 0) + 1;
                    player.lastMaxBuy = Date.now();
                }
                }
                else {setBuyableAmount('compactenergy', 11, player.compactenergy.total.pow(0.487))
                    setBuyableAmount('compactenergy', 12, player.compactenergy.total.pow(0.487).div(100))
                }
            }
            
            if (hasUpgrade('bomb', 54)) {
                if (getBuyableAmount('light', 11).lt(30)) {setBuyableAmount('light', 11, new Decimal(30))}
                if (getBuyableAmount('light', 12).lt(30)) {setBuyableAmount('light', 12, new Decimal(30))}
                if (getBuyableAmount('light', 13).lt(30)) {setBuyableAmount('light', 13, new Decimal(30))}
                if (getBuyableAmount('light', 14).lt(30)) {setBuyableAmount('light', 14, new Decimal(30))}
                if (!player.darkenergy.upgrades.includes(51)) player.darkenergy.upgrades.push(51);
            }
            
        },
        buyables: {
            11: {
                title: "Deadly Energy",
                cost() {let amt = getBuyableAmount('bomb', 11)
                    return new Decimal(10).times(new Decimal(1.4).pow(amt))               
                },
                canAfford(){
                    let cost = this.cost()
                    return player.bomb.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 11)
                    setBuyableAmount('bomb', 11, amt.add(1))
                    player.bomb.points = player.bomb.points.sub(cost)
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 11)
                    return '<span style="font-size: 15px">Multiplies Energy by 1.5x compounding.</span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(1.5).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                },
            12: {
                title: "Deadly Dark Energy",
                cost() {let amt = getBuyableAmount('bomb', 12)
                    return new Decimal(10).times(new Decimal(1.4).pow(amt))               
                },
                canAfford(){
                    let cost = this.cost()
                    return player.bomb.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 12)
                    setBuyableAmount('bomb', 12, amt.add(1))
                    player.bomb.points = player.bomb.points.sub(cost)
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 12)
                    return '<span style="font-size: 15px">Multiplies Dark Energy and Dark Cores by 1.5x compounding.</span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(1.5).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                },
            13: {
                title: "Deadly Compact Energy",
                cost() {let amt = getBuyableAmount('bomb', 13)
                    return new Decimal(10).times(new Decimal(1.4).pow(amt))               
                },
                canAfford(){
                    let cost = this.cost()
                    return player.bomb.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 13)
                    setBuyableAmount('bomb', 13, amt.add(1))
                    player.bomb.points = player.bomb.points.sub(cost)
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 13)
                    return '<span style="font-size: 15px">Multiplies Compact Energy by 1.5x compounding.</span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(1.5).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                },
            21: {
                title: "Deadly Batteries",
                cost() {let amt = getBuyableAmount('bomb', 21)
                    return new Decimal(10).times(new Decimal(1.4).pow(amt))               
                },
                canAfford(){
                    let cost = this.cost()
                    return player.bomb.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 21)
                    setBuyableAmount('bomb', 21, amt.add(1))
                    player.bomb.points = player.bomb.points.sub(cost)
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 21)
                    return '<span style="font-size: 15px">Batteries scale 1.3x compounding later.</span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(1.3).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                },
            22: {
                title: "Deadly Light",
                cost() {let amt = getBuyableAmount('bomb', 22)
                    return new Decimal(10).times(new Decimal(1.4).pow(amt))               
                },
                canAfford(){
                    let cost = this.cost()
                    return player.bomb.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 22)
                    setBuyableAmount('bomb', 22, amt.add(1))
                    player.bomb.points = player.bomb.points.sub(cost)
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 22)
                    return '<span style="font-size: 15px">Multiplies Light by 1.7x compounding.</span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(1.7).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                },
            23: {
                title: "Even Deadlier Deaths",
                cost() {let amt = getBuyableAmount('bomb', 23)
                    return new Decimal(10).times(new Decimal(3).pow(amt))               
                },
                canAfford(){
                    let cost = this.cost()
                    return player.bomb.points.gte(cost)
                },
                buy(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 23)
                    setBuyableAmount('bomb', 23, amt.add(1))
                    player.bomb.points = player.bomb.points.sub(cost)
                },
                display(){let cost = this.cost()
                    let amt = getBuyableAmount('bomb', 23)
                    return '<span style="font-size: 15px">Multiplies Deaths by 1.3x compounding.</span><span style="font-size: 20px"><br>Effect: x' + format(new Decimal(1.3).pow(amt)) + '<br>Bought: ' + format(amt) + '<br>Cost: ' + format(cost)},
                
                                    },
                            },
                            upgrades: {
                                // energy
                                11: {
                                    title: "Energy Keeper I",
                                    description: "Keeps rows 1 and 2 of Energy Upgrades forever.",
                                    cost(){return new Decimal(1000)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                21: {
                                    title: "Energy Auto I",
                                    description: "Automatically buys levels of Enhanced Energy without spending.",
                                    cost(){return new Decimal(10000)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                                    onPurchase() {player.energy.autobuy1 = true}
                            },
                                31: {
                                    title: "Energy Keeper II",
                                    description: "Keeps row 3 of Energy Upgrades forever.",
                                    cost(){return new Decimal(1e5)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                41: {
                                    title: "Energy Keeper III",
                                    description: "Keeps 'dark' Energy Upgrades forever.'",
                                    cost(){return new Decimal(1e7)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                51: {
                                    title: "Energy Auto II",
                                    description: "Overclock is permanently on.",
                                    cost(){return new Decimal(1e10)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                            // battery
                                12: {
                                    title: "Battery Keeper I",
                                    description: "Keeps rows 1 and 2 of Battery Upgrades forever.",
                                    cost(){return new Decimal(1000)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                22: {
                                    title: "Battery Keeper II",
                                    description: "Keeps Battery Milestones 1, 6, and 9 forever. Battery layer stays unlocked.",
                                    cost(){return new Decimal(10000)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                32: {
                                    title: "Battery Keeper III",
                                    description: "Keeps every Battery Milestone except 2 and 8.",
                                    cost(){return new Decimal(1e5)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                42: {
                                    title: "Battery Auto",
                                    description: "Automatically buy Batteries without resetting anything.",
                                    cost(){return new Decimal(1e7)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                                    onPurchase() {player.battery.auto = true}
                            },
                                52: {
                                    title: "Battery Keeper IV",
                                    description: "Keeps 'dark' Battery Upgrades forever.",
                                    cost(){return new Decimal(1e10)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                            // dark energy
                                13: {
                                    title: "Dark Energy Keeper I",
                                    description: "Row 1 Dark Energy Upgrades are always enabled.",
                                    cost(){return new Decimal(1000)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                23: {
                                    title: "Dark Energy Keeper II",
                                    description: "Row 2 Dark Energy Upgrades are always enabled, without downsides.",
                                    cost(){return new Decimal(10000)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                33: {
                                    title: "Dark Energy Auto I",
                                    description: "Removes the Dark Run timer. Passively generate 1% of Dark Cores you'd normally earn.",
                                    cost(){return new Decimal(1e5)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                43: {
                                    title: "Dark Energy Keeper III",
                                    description: "Rows 3 and 4 Dark Energy Upgrades are always enabled, without downsides.",
                                    cost(){return new Decimal(1e7)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                53: {
                                    title: "Dark Energy Auto II",
                                    description: "Dark Energy generates always. Automatically buys levels of Dark Scaling without spending.",
                                    cost(){return new Decimal(1e10)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                            // miscellanious
                                14: {
                                    title: "Compact Energy Auto I",
                                    description: "Passively generate 100% of Compact Energy you'd normally earn.",
                                    cost(){return new Decimal(1000)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                24: {
                                    title: "Compact Energy Auto II",
                                    description: "Earn 5x more Compact Energy. Compact Energy layer stays unlocked.",
                                    cost(){return new Decimal(10000)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                34: {
                                    title: "Compact Energy Auto III",
                                    description: "Earn 5x more Compact Energy again. Automatically buy max buyables without spending.",
                                    cost(){return new Decimal(1e5)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                44: {
                                    title: "Something About Light",
                                    description: "Blessings no longer spend, and they scale 50% slower.",
                                    cost(){return new Decimal(1e7)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                                54: {
                                    title: "Light Keeper",
                                    description: "Blessings are always maxed. Light layer stays unlocked.",
                                    cost(){return new Decimal(1e10)},
                                    canAfford() {
                                        let cost = this.cost();
                                        return new Decimal(player.bomb.points).gte(cost);
                                    },
                                    unlocked(){return true},
                            },
                        },
            milestones: {
                0: {
                    requirementDescription: "7km² Radius",
                    effectDescription: "Dark Power no longer resets everything.",
                    done() {
                        return player.bomb.topradius.gte(7)
                    },
                    unlocked() {
                        return true
                    },
                },
                1: {
                    requirementDescription: "10km² Radius",
                    effectDescription: "Light multiplies Death gain.",
                    done() {
                        return player.bomb.topradius.gte(10)
                    },
                    unlocked() {
                        return true
                    },
                },
                2: {
                    requirementDescription: "20km² Radius",
                    effectDescription: "Unlock Bomb Challenges.",
                    done() {
                        return player.bomb.topradius.gte(20)
                    },
                    unlocked() {
                        return true
                    },
                },
            },
            challenges: {
                11: {
                    name: "Uncompressed",
                    challengeDescription: "Compact Energy is locked.",
                    canComplete: function() {return player.energy.points.gte(new Decimal(1e50))},
                    goalDescription: function() {return format(new Decimal(1e50).add(new Decimal(1e20).pow(challengeCompletions('bomb', 11)))) + " Energy."},
                    rewardDescription: "+^0.01 to Energy Base.",
                    rewardDisplay: function() {return format(new Decimal(0.01).times(challengeCompletions('bomb', 11)))},
                    completionLimit: 10
                },
            },
            tabFormat:[
            "main-display",
            "prestige-button",
            "blank",
            ["display-text", function() {
            return "Making a bomb will reset everything prior. Beware. <br> Make sure to scroll! There's a lot here.";
            }],
            "blank",
            "h-line",
            "blank",
            ["display-text", function() {
                    return '<span style="font-size: 50px">Basic';
            }],
            "blank",
            "buyables",
            "blank",
            "h-line",
            "blank",
            ["display-text", function() {
                    return '<span style="font-size: 50px">Automation';
            }],
            "blank",
            ["upgrades", [1, 2 ,3, 4, 5]],
            "blank",
            "h-line",
            "blank",
            ["display-text", function() {
                if (hasMilestone('bomb', 2)) return '<span style="font-size: 50px">Challenges';
                else return "";
            }],
            () => hasMilestone('bomb', 2) ? "blank" : "",
            () => hasMilestone('bomb', 2) ? "challenges" : "",
            () => hasMilestone('bomb', 2) ? "blank" : "",
            () => hasMilestone('bomb', 2) ? "h-line" : "",
            "blank",
            ["display-text", function() {
                return '<span style="font-size: 50px">Radius Milestones';
            }],
            "blank",
            "milestones",
            "blank",
            "h-line",
            "blank", 
        ]})