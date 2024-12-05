addLayer("energy", {
    name: "Energy", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(1),
    }},
    color: "#ebcc34",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: 0, // Row the layer is in on the tree (0 is the first row)
    upgrades: {
        11: {
            title: "Energy",
            description: "Begin Energy production.",
            cost: new Decimal(1),         // Costs 1 Energy
        },
    },
    tabFormat: [
        "upgrades",  // Displays the upgrades section
    ],
    layerShown(){return true}
})