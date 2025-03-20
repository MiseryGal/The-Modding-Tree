addLayer("infobutnot", {
    name: "Info",
    symbol() { 
        return options.imageSymbols ? "<img src='resources/infofull.png'>" : "I"; 
    },
    row: "side",
    color: "#9c2c2c",
    tooltip() {return "Info"},
    infoboxes: {
        1: {
            title: "Energy Tree",
            body() { return "Welcome to The Energy Tree of Doom and Demise! Don't mind those last four words, they simply do not mean anything of the valuable sort. How to play this game is quite simple. You gain Energy with a base of 1 Energy per second, using a [base x multiplier] ^ exponent formula. You use that Energy to buy upgrades, which will let you acquire even more." },
        },
        2: {
            title: "Energy Decay",
            body() { return "Energy Decay is a, while not innately good, integral aspect to the Energy Tree. Past 1000 Energy, it begins to decay on itself, adding a counter-exponent which very very slowly goes down." },
            unlocked() {player.energy.points.gte(new Decimal(1000))}
        },
    },
    tabFormat: [
        ["infobox", 1],
        ["infobox", 2]
    ]
})

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
        energytier: new Decimal(0),
        energytiercost: new Decimal(1000),
        energytiermulti: new Decimal(1),
        energytierprogress: new Decimal(0)
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
    let gain = layers.energy.getResetGain(); // Store this in a variable for debugging

    player.energy.energytierprogress = player.energy.energytierprogress.add(gain);

    if (player.energy.energytierprogress.gte(player.energy.energytiercost)) {
        player.energy.energytier = player.energy.energytier.add(1);
        player.energy.energytiercost = player.energy.energytiercost.times(new Decimal(5));
        player.energy.energytiermulti = player.energy.energytiermulti.times(new Decimal(2));
        player.energy.energytierprogress = new Decimal(0);
    }
}
    },
    getResetGain(req) {
        let base = new Decimal(1)
        let multi = new Decimal(1)
        let expo = new Decimal(1)

        // base
        base = base.add(getBuyableAmount('energy', 11))
        base = base.add(getBuyableAmount('energy', 21))
        base = base.add(getBuyableAmount('energy', 33).times(new Decimal(player.points).pow(0.2)))

        // multi
        multi = multi.add(getBuyableAmount('energy', 22).times(0.10))
        multi = multi.add(getBuyableAmount('energy', 32).times(new Decimal(player.points).pow(0.15)).div(10))
        multi = multi.times(player.energy.energytiermulti)

        // expo

        // decay

        // total
        if (new Decimal(req).eq(1)) {return base}
        if (new Decimal(req).eq(2)) {return multi}
        if (new Decimal(req).eq(3)) {return expo}
        let gain = new Decimal(new Decimal(base).times(multi)).pow(expo).div(20)
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
            cost(x) { return new Decimal(500) },
            display() {if (!getBuyableAmount('energy', 21).lt(7))
                {return `<span style="font-size: 15px">Point Magnet</span>
                <span style="font-size: 10px">One per second not enough? Energy's base is directly applied to Point gain.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
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
            branches: []
        },
        32: {
            cost(x) { return new Decimal(750) },
            display() {if (!getBuyableAmount('energy', 21).lt(7))
                {return `<span style="font-size: 15px">Point Pulsar</span>
                <span style="font-size: 10px">Points are useful now. Points add to Energy's multiplier.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>`}
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
            branches: []
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
            display() {if (!getBuyableAmount('energy', 33).lt(1))
                {return `<span style="font-size: 15px">Energy Tiers</span>
                <span style="font-size: 10px">Unlock Energy Tiers.</span>
                <span style="font-size: 12px">Cost: ` + format(this.cost()) + `</span>
                <span style="font-size: 12px">Amount: ` + format(getBuyableAmount(this.layer, this.id)) + `</span>
                <span style="font-size: 10px;color:#ffffff;text-shadow: 0 0 10px #242424, 0 0 10px #242424;">Will unlock new upgrades.</span>
                <span style="font-size: 15px;color:#60aaf0;text-shadow: 0 0 10px #3975ad, 0 0 10px #3975ad;">Permanent</span>`}
                else {return `<span style="font-size: 30px">???</span>`}},
            canAfford() { return player[this.layer].points.gte(this.cost()) && getBuyableAmount('energy', 33).gte(1) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() {return getBuyableAmount('energy', 22).gte(1)},
            style() {
                if (getBuyableAmount('energy', 33).lt(1)) {
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
        
    },
    bars: {
        energytierbar: {
            direction: RIGHT,
            width: 200,
            height: 50,
            progress() { 
                return player.energy.energytierprogress.div(player.energy.energytiercost).toNumber(); 
            },
            display() {
                return format(player.energy.energytierprogress) + "/" + format(player.energy.energytiercost) + "<br>" + "Tier " + format(player.energy.energytier.add(1)) + "<br> Energy Multi: x" + format(player.energy.energytiermulti)
            },
            fillStyle() {return {'background-color': '#f2bc18', 'width': '300px', 'height': '75px'}},
            baseStyle: {'background-color': '#9c812e', 'width': '300px', 'height': '75px'},
            borderStyle() {return {'border-color': '#9c812e', 'border-width': '5px'}},
            unlocked() { return getBuyableAmount('energy', 41).eq(1) }
        },
    },
    tabFormat: {
    "Main": {
        content: [["display-text", function() {
            let shiftHeld = player.shiftDown
            let displaygain = layers.energy.getResetGain().times(20)
            let displaybase = layers.energy.getResetGain(1)
            let displaymulti = layers.energy.getResetGain(2)
            let displayexpo = layers.energy.getResetGain(3)
            
            if (shiftDown === false) {
            return `<span style="font-size: 20px">You are currently producing </span><span style="font-size: 40px;color:#f2bc18;text-shadow: 0 0 10px #f2bc18, 0 0 20px #f2bc18;">` + format(new Decimal(displaygain).toFixed(2)) + `</span><span style="font-size: 20px"> Energy per second.`}
            else  {return `<span style="font-size: 20px">You are currently producing </span><span style="font-size: 40px;color:#f2bc18;text-shadow: 0 0 10px #f2bc18, 0 0 20px #f2bc18;">` + format(new Decimal(displaygain).toFixed(2)) + `</span><span style="font-size: 15px">  (` + format (new Decimal(displaybase)) + ` x ` + format (new Decimal(displaymulti)) + `) ^ ` + format (new Decimal(displayexpo)) + `</span><span style="font-size: 20px"> Energy per second.`}
        }],
        ["display-text", function() {
            return `<span style="font-size: 20px">You currently have </span><span style="font-size: 40px;color:#f2bc18;text-shadow: 0 0 10px #f2bc18, 0 0 20px #f2bc18;">` + format(new Decimal(player.energy.points).toFixed(2)) + `</span><span style="font-size: 20px"> Energy.`;
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
