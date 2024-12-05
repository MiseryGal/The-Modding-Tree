addLayer("energy", {
    name: "Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(1),
    }},
    color: "#ebcc34",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    resource: "Energy", // Name of prestige currency
    baseResource: "Energy Points", // Name of resource prestige is based on
    baseAmount() {return player.points},
    syncResources() {
        ; // Sync resource with baseResource
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    passiveGeneration() {
        let passive = new Decimal(0);
        if (hasUpgrade('energy', 11)) passive = passive.add(1);
        return passive;
    },
    upgrades: {
        11: {
            title: "Energy",
            description: "Begin Energy [And Energy Point] production.",
            cost: new Decimal(1),         // Costs 1 Energy
        },
        12: {
            title: "More Energy",
            description: "2.00x Energy production,",
            cost: new Decimal(100),
        }
    },
    tabFormat: [
        ["display-text", function() { return `You have <b>${format(this.points)}</b> Energy.` }],
        ["display-text", function() { return 'The basis of it all.' }],        
        "blank",  // Adds space
        "upgrades",  // Displays the upgrades section
    ],
    layerShown(){return true}
})