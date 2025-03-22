// INFO LAYER

addLayer("infobutnot", {
    name: "Info",
    symbol() { 
        return options.imageSymbols ? "<img src='resources/infofull.png'>" : "I"; 
    },
    startData() {
        return {
            unlocked: true,
            energydecayUnlocked: false,
            tierscalingUnlocked: false,
        };
    },
    row: "side",
    color: "#9c2c2c",
    tooltip() {return "Info"},
    position: 0,
    infoboxes: {
        'energytree': {
            title: "Energy Tree",
            body() { return "Welcome to The Energy Tree of Doom and Demise! Don't mind those last four words, they simply do not mean anything of the valuable sort. How to play this game is quite simple. You gain Energy with a base of 1 Energy per second, using a [base x multiplier] ^ exponent formula. You use that Energy to buy upgrades, which will let you acquire even more." },
        },
        'energytiers': {
            title: "Energy Tiers",
            body() { return "This is the first actual unique mechanic you'll see in the game. Your Energy is not pointless, you know, and it serves as experience for your Energy Tier gauge. Every time you reach the required experience, it is reset in exchange for one Energy Tier, which boosts Energy's multiplier by 2x compounding defaultly. The required experience scales by x5 for every Energy Tier you attain, making this both a useful tool and not an easy task." },
            unlocked() {return getBuyableAmount('energy', 41).eq(1)}
        },
        'energydecay': {
    title: "Energy Decay",
    body() {
        return "You didn't think it was going to be all fun and games, did you? Of course not. The game has 'DOOM AND DEMISE' in the title for a reason. Meet Energy Decay, he's like that one guy you always want to avoid because he's just unnecessarily mean for no reason. Basically, as you get more Energy past 1 Million, your Energy per Second will start slowly going down. It may be too little to notice now, but trust me, it'll prove hurtful.";
    },
    unlocked() {
        if (player.infobutnot.energydecayUnlocked) return true; // Check persistent state
        if (player.energy.points.gte(1e6)) {
            player.infobutnot.energydecayUnlocked = true; // Update persistent state
            return true;
        }
        return false;
    },
},
        'battery': {
            title: "Batteries",
            body() { return "Batteries are the first official reset layer of the game. And they are quite simple at that! You need at least Energy Tier 9 to perform the Battery reset, with that requirement scaling as you get more Batteries. Batteries themselves are a powerful tool, however, offering upgrades, of course. Along with this, Batteries themselves also boost Energy's Multiplier. Oh, another fun fact, Battery Upgrades will never spend your Batteries!" },
            unlocked() {return getBuyableAmount('energy', 61).eq(1)}
        },
        'conditionals': {
            title: "Conditional Unlocks",
            body() { return "You may have noticed the odd fuchsia coloration of the 'Will unlock new upgrades.' text on Energy Upgrade 'A New Era'. Yes, this is intentional, and it is a signal that whenever this upgrade unlocks new upgrades, it will NOT be immediate. In this case, a certain Battery Upgrade is required to allow it to unlock new ones." },
            unlocked() {return getBuyableAmount('energy', 61).eq(1)}
        },
        'tierscaling': {
            title: "Tier Scaling",
            body() {
                return "To prevent you from making progress too quickly, Energy Tiers will begin to scale! Every 10 Energy Tiers, starting at 20, a +^1.05 modifier will be added to their requirement. Of course, you can delay them, and you also may brute force them, but I personally wouldn't recommend that second option. I'm not a certain red shark, and timewalls aren't my cup of joe.";
            },
            unlocked() {
                if (player.infobutnot.tierscalingUnlocked) return true; // Check persistent state
                if (player.energy.points.gte(1e6)) {
                    player.infobutnot.tierscalingUnlocked = true; // Update persistent state
                    return true;
                }
                return false;
            },
        },
    },
    tabFormat: [
        ["infobox", "energytree"],
        ["infobox", "energytiers"],
        ["infobox", "energydecay"],
        ["infobox", "battery"],
        ["infobox", "conditionals"],
        ["infobox", "tierscaling"],
    ]
})

// DEBUG LAYER

addLayer("debug", {
    name: "Debug Tools",
    symbol() { 
        return options.imageSymbols ? "<img src='resources/debug.png'>" : "I"; 
    },
    startData() {
        return {
            unlocked: true,
            energydecayUnlocked: false,
            tierscalingUnlocked: false,
        };
    },
    row: "side",
    position: 1,
    color: "#595856",
    tooltip() {return "Debug Tools"},
    clickables: {
        11: {
            display() {return "Reset Energy Layer"},
            canClick() {return true},
            onClick() {let tempbatteries = player.battery.points
                player.battery.points = new Decimal(0)
                player.energy.energytier = new Decimal(10)
                setTimeout(() => {
                    doReset('battery');
                    player.battery.points = tempbatteries;
                }, 100);
                doReset('battery')
                player.battery.points = tempbatteries
            },
            style() {return {'background-color': '#f2bc18'}}
        },
        21: {
            display() {return "Time Speed 1x"},
            canClick() {return true},
            onClick() {player.devSpeed = new Decimal(1)},
            style() {return {'background-color': '#f2bc18'}}
        },
        22: {
            display() {return "Time Speed 10x"},
            canClick() {return true},
            onClick() {player.devSpeed = new Decimal(10)},
            style() {return {'background-color': '#f2bc18'}}
        },
        23: {
            display() {return "Time Speed 100x"},
            canClick() {return true},
            onClick() {player.devSpeed = new Decimal(100)},
            style() {return {'background-color': '#f2bc18'}}
        },
    },
    tabFormat: [
        ["display-text", "This menu is only for debug purposes! Use it if something goes wrong."],
        "blank", 
        ["display-text", "<span style='font-size: 30px'>Resetting Stuff</span>"],
        "blank",
        ["clickables", [1]],
        "blank",
        ["display-text", "<span style='font-size: 30px'>Time Speed</span>"],
        "blank",
        ["clickables", [2]],
    ]
})

// ENERGY LAYER

addLayer("energy", {
    name: "Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol() { 
        return options.imageSymbols ? "<img src='resources/energyfull.png'>" : "En"; 
    },
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        rgb1: new Decimal(0),
        rgb1flip: new Decimal(0),
        rgb2: new Decimal(255),
        rgb2flip: new Decimal(1),
        energytier: new Decimal(1),
        energytiercost: new Decimal(1000),
        energytiermulti: new Decimal(1),
        energytierprogress: new Decimal(0),
        experiencegainmulti: new Decimal(1)
    }},
    color: "#f2bc18",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "Energy", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    style() {
        return {
            backgroundImage: `linear-gradient(to bottom, rgba(208, 169, 53, ${player.energy.rgb1.div(255)}), rgba(135, 108, 29, 1)`,
            backgroundColor: `rgb(24, 24, 24)`
        };
    },
    update(diff) {

        // rgb 
        let rgb1 = player.energy.rgb1
        let rgb1flip = player.energy.rgb1flip
        let rgb2 = player.energy.rgb2
        let rgb2flip = player.energy.rgb2flip
        if (rgb1flip.eq(0)) {
            rgb1 = rgb1.add(1)
            if (rgb1.gte(255)) {rgb1flip = new Decimal(1)}
        }
        if (rgb1flip.eq(1)) {
            rgb1 = rgb1.sub(1)
            if (rgb1.lte(0)) {rgb1flip = new Decimal(0)}
        }
        if (rgb2flip.eq(0)) {
            rgb2 = rgb2.add(1)
            if (rgb2.gte(255)) {rgb2flip = new Decimal(1)}
        }
        if (rgb2flip.eq(1)) {
            rgb2 = rgb2.sub(1)
            if (rgb2.lte(0)) {rgb2flip = new Decimal(0)}
        }
        player.energy.rgb1 = rgb1
        player.energy.rgb1flip = rgb1flip
        player.energy.rgb2 = rgb2
        player.energy.rgb2flip = rgb2flip

        // energy tiers

        if (getBuyableAmount('energy', 41).eq(1)) {

        // energy tier experience gain
        let gain = layers.energy.getResetGain().times(player.energy.experiencegainmulti)
        let experiencegain = new Decimal(1)
        experiencegain = experiencegain.times(new Decimal(1).times(new Decimal(2).pow(getBuyableAmount('energy', 54))))
        experiencegain = experiencegain.times(new Decimal(1.5).pow(getBuyableAmount('battery', 21)))
        experiencegain = experiencegain.times(new Decimal(1.1).pow(getBuyableAmount('energy', 71)))

        player.energy.experiencegainmulti = experiencegain
        // energy tier multiplier
        let tiermulti = new Decimal(1)
        let tiermultiadd = new Decimal(0)
        tiermultiadd = tiermultiadd.add(getBuyableAmount('energy', 73).div(20))
        tiermulti = new Decimal(1).times(new Decimal(new Decimal(2).add(tiermultiadd)).pow(player.energy.energytier.sub(1)))
        player.energy.energytiermulti = tiermulti
        // energy tier progress
        let cost = new Decimal(1000).times(new Decimal(5).pow(player.energy.energytier.sub(1)))
        let tierdelay = new Decimal(0)
        tierdelay = tierdelay.add(getBuyableAmount('energy', 74))
        cost = cost.div(new Decimal(1).add(player.battery.points.div(100)))
        cost = cost.pow(Decimal.max(1,new Decimal(1.05).times(Decimal.floor(new Decimal(player.energy.energytier.div(10).sub(tierdelay))).sub(1))))
        player.energy.energytiercost = cost

        player.energy.energytierprogress = player.energy.energytierprogress.add(gain);

        if (player.energy.energytierprogress.gte(player.energy.energytiercost)) {
            player.energy.energytier = player.energy.energytier.add(1);
            player.energy.energytierprogress = new Decimal(0);
    }
}
    },
    getResetGain(req) {
        let base = new Decimal(1)
        let multi = new Decimal(1)
        let expo = new Decimal(1)
        let batteryboost = new Decimal(1)

        // battery boost
        batteryboost = player.battery.points.add(1)
        batteryboost = batteryboost.times(new Decimal(1).add(getBuyableAmount('battery', 42).div(10)))

        // base
        base = base.add(getBuyableAmount('energy', 11))
        base = base.add(getBuyableAmount('energy', 21))
        base = base.add(getBuyableAmount('energy', 33).times(new Decimal(player.points).pow(0.2)))
        base = base.add(getBuyableAmount('energy', 55))
        base = base.times(Decimal.max(1,(getBuyableAmount('energy', 72).times(player.energy.energytier).div(10))))

        // multi
        multi = multi.add(getBuyableAmount('energy', 22).times(0.10))
        multi = multi.add(getBuyableAmount('energy', 32).times(new Decimal(player.points).pow(0.15)).div(10))
        multi = multi.times(new Decimal(1.01).pow(getBuyableAmount('energy', 51)))
        multi = multi.add(getBuyableAmount('energy', 55).times(0.20))
        multi = multi.times(new Decimal(1.5).pow(getBuyableAmount('battery', 11)))
        multi = multi.times(batteryboost)
        multi = multi.times(player.energy.energytiermulti)

        // expo
        expo = expo.add(getBuyableAmount('energy', 52).times(0.01))
        expo = expo.add(getBuyableAmount('battery', 31).times(0.01))
        // decay
        decay = Decimal.max(1,Decimal.exp(
            new Decimal(player.energy.points.div(1e6)).log10().max(0).times(0.2)
        ));
        // total
        if (new Decimal(req).eq(1)) {return base}
        if (new Decimal(req).eq(2)) {return multi}
        if (new Decimal(req).eq(3)) {return expo}
        if (new Decimal(req).eq(4)) {return decay}
        if (new Decimal(req).eq(5)) {return batteryboost}
        let gain = new Decimal(new Decimal(base).times(multi)).pow(expo).div(20).div(decay)
        return gain
    },
    autoPrestige() {return true},
    resetsNothing() {return true},
    canReset() {return true},
    getNextAt() {return new Decimal(0)},
    prestigeButtonText() {return "nobody will see this"},
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    doReset(resettingLayer) {
        if (layers[resettingLayer].row > layers[this.layer].row) {
            // Keep specific buyables during resets
            let keep = [];
            let preservedBuyables = {
                41: new Decimal(getBuyableAmount(this.layer, 41)),
                61: new Decimal(getBuyableAmount(this.layer, 61))
            };
    
            layerDataReset(this.layer, keep); // Reset all data except manually preserved buyables
    
            // Restore preserved buyables
            for (let id in preservedBuyables) {
                setBuyableAmount(this.layer, id, preservedBuyables[id]);
            }
        }
    },
    
    buyables: {
        11: {
            cost(x) { return new Decimal(15).add(new Decimal(5).times(x)) },
            display()
                {return `<span style="font-size: 15px">Base-ic</span>
                <span style="font-size: 10px">Your first upgrade! This one increases Energy's base by 1.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return true},
            purchaseLimit: new Decimal(3),
            branches: [21, 22]
        },
        21: {
            cost(x) { return new Decimal(30).times(new Decimal(1.3).pow(x)) },
            display() {if (!getBuyableAmount('energy', 11).lt(3))
                {return `<span style="font-size: 15px">Base After Base</span>
                <span style="font-size: 10px">Increases Energy's base by 1.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.` }
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 11).gte(3) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return true},
            style() {
                if (getBuyableAmount('energy', 11).lt(3)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(7),
            branches: [31, 32]
        },
        22: {
            cost(x) { return new Decimal(50).times(new Decimal(1.6).pow(x)) },
            display() {if (!getBuyableAmount('energy', 11).lt(3))
                {return `<span style="font-size: 15px">Multi Man</span>
                <span style="font-size: 10px">Increases Energy's multiplier by +0.10.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.` }
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 11).gte(3) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return true},
            style() {
                if (getBuyableAmount('energy', 11).lt(3)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(5),
            branches: [33]
        },
        31: {
            cost(x) { return new Decimal(250) },
            display() {if (!getBuyableAmount('energy', 21).lt(7))
                {return `<span style="font-size: 15px">Point Magnet</span>
                <span style="font-size: 10px">One per second not enough? Energy's base is directly applied to Point gain.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 21).gte(7) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 11).gte(3)},
            style() {
                if (getBuyableAmount('energy', 21).lt(7)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(1),
            branches: [41]
        },
        32: {
            cost(x) { return new Decimal(500) },
            display() {if (!getBuyableAmount('energy', 21).lt(7))
                {return `<span style="font-size: 15px">Point Pulsar</span>
                <span style="font-size: 10px">Points are useful now. Points add to Energy's multiplier.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 21).gte(7) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 11).gte(3)},
            style() {
                if (getBuyableAmount('energy', 21).lt(7)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(1),
            branches: [41]
        },
        33: {
            cost(x) { return new Decimal(1000) },
            display() {if (!getBuyableAmount('energy', 22).lt(5))
                {return `<span style="font-size: 15px">Point Synergy</span>
                <span style="font-size: 10px">And now, they return the favor! Points boost Energy's base.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 21).gte(5) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 11).gte(3)},
            style() {
                if (getBuyableAmount('energy', 22).lt(5)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(1),
            branches: [41]
        },
        41: {
            cost(x) { return new Decimal(2000) },
            display() {if (getBuyableAmount('energy', 33).gte(1) && getBuyableAmount('energy', 32).gte(1) && getBuyableAmount('energy', 31).gte(1))
                {return `<span style="font-size: 15px">Energy Tiers</span>
                <span style="font-size: 10px">Unlock Energy Tiers.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.</span>
                <span style="font-size: 15px;color:#60aaf0;text-shadow: 0 0 10px #3975ad, 0 0 10px #3975ad;">Permanent</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 33).gte(1) && getBuyableAmount('energy', 32).gte(1) && getBuyableAmount('energy', 31).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 22).gte(5) || getBuyableAmount('energy', 21).gte(7)},
            style() {
                if (getBuyableAmount('energy', 33).lt(1) || getBuyableAmount('energy', 32).lt(1) || getBuyableAmount('energy', 31).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(1),
            branches: [51, 52, 53, 54, 55]
        },
        51: {
            cost(x) { return new Decimal(1).times(new Decimal(1.5).pow(x)) },
            display() {if (!getBuyableAmount('energy', 41).lt(1))
                {return `<span style="font-size: 15px">The Pointful Upgrade</span>
                <span style="font-size: 10px">Multiplies Energy's Multiplier by 1.01x. Waste of time.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 41).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 31).gte(1) || getBuyableAmount('energy', 32).gte(1) || getBuyableAmount('energy', 33).gte(1)},
            style() {
                if (getBuyableAmount('energy', 41).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(100),
            branches: []
        },
        52: {
            cost(x) { return new Decimal(10000).times(new Decimal(3).pow(x)) },
            display() {if (!getBuyableAmount('energy', 41).lt(1))
                {return `<span style="font-size: 15px">Deciponential</span>
                <span style="font-size: 10px">Adds 0.01 to Energy's Exponent.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 41).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 31).gte(1) || getBuyableAmount('energy', 32).gte(1) || getBuyableAmount('energy', 33).gte(1)},
            style() {
                if (getBuyableAmount('energy', 41).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(10),
            branches: []
        },
        53: {
            cost(x) { return new Decimal(100000) },
            display() {if (!getBuyableAmount('energy', 41).lt(1))
                {return `<span style="font-size: 15px">Pointier</span>
                <span style="font-size: 10px">Energy's multiplier affects Points gain at a reduced rate.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 41).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 31).gte(1) || getBuyableAmount('energy', 32).gte(1) || getBuyableAmount('energy', 33).gte(1)},
            style() {
                if (getBuyableAmount('energy', 41).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(1),
            branches: [61]
        },
        54: {
            cost(x) { return new Decimal(1000).times(new Decimal(10).pow(x)) },
            display() {if (!getBuyableAmount('energy', 41).lt(1))
                {return `<span style="font-size: 15px">Tier Experience</span>
                <span style="font-size: 10px">Doubles Tier Experience gain per level.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 41).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 31).gte(1) || getBuyableAmount('energy', 32).gte(1) || getBuyableAmount('energy', 33).gte(1)},
            style() {
                if (getBuyableAmount('energy', 41).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(6),
            branches: []
        },
        55: {
            cost(x) { return new Decimal(3000).times(new Decimal(1.3).pow(x)) },
            display() {if (!getBuyableAmount('energy', 41).lt(1))
                {return `<span style="font-size: 15px">All-Around</span>
                <span style="font-size: 10px">Adds 1 to Energy's Base and 0.20 to Energy's multiplier.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 41).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 31).gte(1) || getBuyableAmount('energy', 32).gte(1) || getBuyableAmount('energy', 33).gte(1)},
            style() {
                if (getBuyableAmount('energy', 41).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(10),
            branches: []
        },
        61: {
            cost(x) { return new Decimal(1e7) },
            display() {if (!getBuyableAmount('energy', 53).lt(1))
                {return `<span style="font-size: 15px">A New Era</span>
                <span style="font-size: 10px">Unlocks Batteries.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#fc0366;text-shadow: 0 0 10px #fc0366, 0 0 10px #fc0366;">Will unlock new upgrades.</span>
                <span style="font-size: 15px;color:#60aaf0;text-shadow: 0 0 10px #3975ad, 0 0 10px #3975ad;">Permanent</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 53).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 41).gte(1)},
            style() {
                if (getBuyableAmount('energy', 53).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(1),
            branches: [71, 72, 73, 74]
        },
        71: {
            cost(x) { return new Decimal(1e10).times(new Decimal(1.3).pow(x)) },
            display() {if (!getBuyableAmount('energy', 61).lt(1))
                {return `<span style="font-size: 15px">Further, More</span>
                <span style="font-size: 10px">Compounding 1.1x Energy Tier Experience gain.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 61).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 53).gte(1) && getBuyableAmount('battery', 31).gte(1)},
            style() {
                if (getBuyableAmount('energy', 61).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(20),
            branches: []
        },
        72: {
            cost(x) { return new Decimal(2e12) },
            display() {if (!getBuyableAmount('energy', 61).lt(1))
                {return `<span style="font-size: 15px">Tiered Base</span>
                <span style="font-size: 10px">Energy's Base is multiplied by Energy Tier at a reduced rate.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 61).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 53).gte(1) && getBuyableAmount('battery', 31).gte(1)},
            style() {
                if (getBuyableAmount('energy', 61).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(1),
            branches: []
        },
        73: {
            cost(x) { return new Decimal(1e13).times(new Decimal(100).pow(x).times(new Decimal(10).pow(Decimal.max(0,x.sub(1))))) },
            display() {if (!getBuyableAmount('energy', 61).lt(1))
                {return `<span style="font-size: 15px">Tier Boost</span>
                <span style="font-size: 10px">Energy Tier's Boost is increased by +0.05x.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 61).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 53).gte(1) && getBuyableAmount('battery', 31).gte(1)},
            style() {
                if (getBuyableAmount('energy', 61).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(10),
            branches: []
        },
        74: {
            cost(x) { return new Decimal(1e16).times(new Decimal(100000).pow(x)) },
            display() {if (!getBuyableAmount('energy', 61).lt(1))
                {return `<span style="font-size: 15px">Delayed Scaling</span>
                <span style="font-size: 10px">Delays the scaling of Energy Tiers by 1.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 61).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 53).gte(1) && getBuyableAmount('battery', 31).gte(1)},
            style() {
                if (getBuyableAmount('energy', 61).lt(1)) {
                    return {
                        'background-color': '#9c812e !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(5),
            branches: []
        },
    },
    bars: {
        energytierbar: {
            direction: RIGHT,
            width: 400,
            height: 80,
            progress() { 
                return player.energy.energytierprogress.div(player.energy.energytiercost).toNumber(); 
            },
            display() {
                return format(player.energy.energytierprogress) + "/" + format(player.energy.energytiercost) + "<br>" + "Energy Tier " + String(player.energy.energytier) + "<br> Energy Multi: x" + format(player.energy.energytiermulti) + "<br> Getting " + format(layers.energy.getResetGain().times(20).times(player.energy.experiencegainmulti)) + " Experience per second."
            },
            fillStyle() {return {'background-color': '#f2bc18', 'width': '300px', 'height': '75px'}},
            baseStyle: {'background-color': '#9c812e', 'width': '300px', 'height': '75px'},
            borderStyle() {return {'border-color': '#9c812e', 'border-width': '5px'}},
            textStyle() {return {'font-size': '18px'}},
            unlocked() { return getBuyableAmount('energy', 41).eq(1) }
        },
    },
    tabFormat: {
    "Main": {
        content: [
        ["display-text", function() {
            return `<span style="font-size: 20px">You currently have </span><span style="font-size: 40px;color:#f2bc18;text-shadow: 0 0 10px #f2bc18, 0 0 20px #f2bc18;">` + format(new Decimal(player.energy.points).toFixed(2)) + `</span><span style="font-size: 20px"> Energy.`;
        }],
        ["display-text", function() {
            let shiftHeld = player.shiftDown
            let displaygain = layers.energy.getResetGain().times(20)
            let displaybase = layers.energy.getResetGain(1)
            let displaymulti = layers.energy.getResetGain(2)
            let displayexpo = layers.energy.getResetGain(3)
            let displaydecay = layers.energy.getResetGain(4)
            
            if (shiftDown === false) {
            return `<span style="font-size: 20px">You are currently producing </span><span style="font-size: 40px;color:#f2bc18;text-shadow: 0 0 10px #f2bc18, 0 0 20px #f2bc18;">` + format(new Decimal(displaygain).toFixed(2)) + `</span><span style="font-size: 20px"> Energy per second.`}
            else  {if (!player.energy.points.gte(1e6)) return `<span style="font-size: 20px">You are currently producing </span><span style="font-size: 40px;color:#f2bc18;text-shadow: 0 0 10px #f2bc18, 0 0 20px #f2bc18;">` + format(new Decimal(displaygain).toFixed(2)) + `</span><span style="font-size: 15px">  (` + format (new Decimal(displaybase)) + ` x ` + format (new Decimal(displaymulti)) + `) ^ ` + format (new Decimal(displayexpo)) + `</span><span style="font-size: 20px"> Energy per second.`
            else return `<span style="font-size: 20px">You are currently producing </span><span style="font-size: 40px;color:#f2bc18;text-shadow: 0 0 10px #f2bc18, 0 0 20px #f2bc18;">` + format(new Decimal(displaygain).toFixed(2)) + `</span><span style="font-size: 15px">  ((` + format (new Decimal(displaybase)) + ` x ` + format (new Decimal(displaymulti)) + `) ^ ` + format (new Decimal(displayexpo)) + `)</span><span style="font-size: 15px;color:#ff0000;text-shadow: 0 0 10px #610707, 0 0 20px #610707;"> ÷ ` + format (new Decimal(displaydecay)) + `</span><span style="font-size: 20px"> Energy per second.`
            }
        }],
        "blank",
        ["bar", "energytierbar"],
        ]
    },
    "Upgrades": {
        content: [
            ["display-text", function() {
                return `<span style="font-size: 20px">You currently have </span><span style="font-size: 40px;color:#f2bc18;text-shadow: 0 0 10px #f2bc18, 0 0 20px #f2bc18;">` + format(new Decimal(player.energy.points).toFixed(2)) + `</span><span style="font-size: 20px"> Energy.`;
            }],
            "blank",
            "buyables"
        ]
    
    }
}})

// BATTERY LAYER

addLayer("battery", {
    name: "Battery", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol() { 
        return options.imageSymbols ? "<img src='resources/batteryfull.png'>" : "En"; 
    },
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        rgb1: new Decimal(0),
        rgb1flip: new Decimal(0),
        rgb2: new Decimal(255),
        rgb2flip: new Decimal(1),
    }},
    color: "#68658b",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "Batteries", // Name of prestige currency
    baseResource: "Energy", // Name of resource prestige is based on
    baseAmount() {return player.energy.points}, // Get the current amount of baseResource
    style() {
        return {
            backgroundImage: `linear-gradient(to bottom, rgba(104, 101, 139, ${player.energy.rgb1.div(255)}), rgba(71, 69, 95, 1)`,
            backgroundColor: `rgb(24, 24, 24)`
        };
    },
    update(diff) {

        // rgb 
        let rgb1 = player.energy.rgb1
        let rgb1flip = player.energy.rgb1flip
        let rgb2 = player.energy.rgb2
        let rgb2flip = player.energy.rgb2flip
        if (rgb1flip.eq(0)) {
            rgb1 = rgb1.add(1)
            if (rgb1.gte(255)) {rgb1flip = new Decimal(1)}
        }
        if (rgb1flip.eq(1)) {
            rgb1 = rgb1.sub(1)
            if (rgb1.lte(0)) {rgb1flip = new Decimal(0)}
        }
        if (rgb2flip.eq(0)) {
            rgb2 = rgb2.add(1)
            if (rgb2.gte(255)) {rgb2flip = new Decimal(1)}
        }
        if (rgb2flip.eq(1)) {
            rgb2 = rgb2.sub(1)
            if (rgb2.lte(0)) {rgb2flip = new Decimal(0)}
        }
        player.energy.rgb1 = rgb1
        player.energy.rgb1flip = rgb1flip
        player.energy.rgb2 = rgb2
        player.energy.rgb2flip = rgb2flip
    },
    getResetGain(req) {
        let gain = new Decimal(0)
        gain = gain.add(new Decimal(player.energy.energytier)).sub(8).sub(player.battery.points)
        return gain
    },
    autoPrestige() {return false},
    resetsNothing() {return false},
    canReset() {return layers.battery.getResetGain().gt(0)},
    getNextAt() {return new Decimal(0)},
    prestigeButtonText() {return "Reset Energy Layer for Batteries. <br> You will be getting " + String(Decimal.max(0,layers.battery.getResetGain())) + " Batteries."},
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return getBuyableAmount('energy', 61).eq(1)},
    unlocked() {return getBuyableAmount('energy', 61).eq(1)},
    buyables: {
        11: {
            cost(x) { return new Decimal(1) },
            display()
                {return `<span style="font-size: 15px">Welcome Home</span>
                <span style="font-size: 10px">Welcome to the Battery Layer! This boosts Energy's Multiplier and Points gain by 1.5x!</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return true},
            purchaseLimit: new Decimal(1),
            branches: [21]
        },
        21: {
            cost(x) { return new Decimal(2).add(new Decimal(2).times(x)) },
            display() {if (!getBuyableAmount('battery', 11).lt(1))
                {return `<span style="font-size: 15px">Battery Operated</span>
                <span style="font-size: 10px">Multiplies Energy Tier Experience gain by 1.5x per level.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.` }
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('battery', 11).gte(1) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return true},
            style() {
                if (getBuyableAmount('battery', 11).lt(1)) {
                    return {
                        'background-color': '#3c3b53 !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(3),
            branches: [31]
        },
        31: {
            cost(x) { return new Decimal(8) },
            display() {if (!getBuyableAmount('battery', 21).lt(3))
                {return `<span style="font-size: 15px">In with the New</span>
                <span style="font-size: 10px">Unlocks new Energy Upgrades. Also, adds 0.01 to Energy's Exponent.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.` }
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('battery', 21).gte(3) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('battery', 11).gte(1)},
            style() {
                if (getBuyableAmount('battery', 21).lt(3)) {
                    return {
                        'background-color': '#3c3b53 !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(1),
            branches: [41, 42]
        },
        41: {
            cost(x) { return new Decimal(12) },
            display() {if (!getBuyableAmount('battery', 31).lt(1))
                {return `<span style="font-size: 15px">Optimizations</span>
                <span style="font-size: 10px">Batteries now divide Energy Tier costs by a reduced rate.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.` }
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('battery', 31).gte(1) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('battery', 21).gte(1)},
            style() {
                if (getBuyableAmount('battery', 31).lt(1)) {
                    return {
                        'background-color': '#3c3b53 !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(1),
            branches: []
        },
        42: {
            cost(x) { return new Decimal(14).add(new Decimal(4).times(x)) },
            display() {if (!getBuyableAmount('battery', 31).lt(1))
                {return `<span style="font-size: 15px">Self-Powering</span>
                <span style="font-size: 10px">Multiplies Battery Boost by +0.1x.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.` }
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('battery', 31).gte(1) },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('battery', 21).gte(1)},
            style() {
                if (getBuyableAmount('battery', 31).lt(1)) {
                    return {
                        'background-color': '#3c3b53 !important',
                        'cursor': 'not-allowed !important'
                    };
                }
                return {}; // Ensures a valid return value if the condition is not met
            },
            purchaseLimit: new Decimal(5),
            branches: []
        },
},
    tabFormat: {
    "Main": {
        content: [["display-text", function() {
            let displaybatteries = player.battery.points
        
            return `<span style="font-size: 20px">You currently have </span><span style="font-size: 40px;color:#68658b;text-shadow: 0 0 10px #68658b, 0 0 20px #68658b;">` + String(new Decimal(displaybatteries)) + `</span><span style="font-size: 20px"> Batteries.`
        }],
        ["display-text", function() {
            let displayboost = layers.energy.getResetGain(5)

            return `<span style="font-size: 20px">Your Batteries are boosting Energy's Multiplier by x</span><span style="font-size: 40px;color:#68658b;text-shadow: 0 0 10px #68658b, 0 0 20px #68658b;">` + format(new Decimal(displayboost).toFixed(2)) + `</span><span style="font-size: 20px">`;
        }],
        ["display-text", function() {
            let displayenergytier = player.energy.energytier

            return `<span style="font-size: 20px">Your Energy Tier is </span><span style="font-size: 40px;color:#f2bc18;text-shadow: 0 0 10px #f2bc18, 0 0 20px #f2bc18;">` + String(new Decimal(displayenergytier)) + `</span><span style="font-size: 20px">`;
        }],
        "blank",
        "prestige-button"
        ]
    },
    "Upgrades": {
        unlocked() { return player.battery.total.gt(0) },
        content: [
            ["display-text", function() {
                let displaybatteries = player.battery.points
            
                return `<span style="font-size: 20px">You currently have </span><span style="font-size: 40px;color:#68658b;text-shadow: 0 0 10px #68658b, 0 0 20px #68658b;">` + String(new Decimal(displaybatteries)) + `</span><span style="font-size: 20px"> Batteries.`
            }],
            "blank",
            "buyables"
        ]

    }
}})
