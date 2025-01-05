let modInfo = {
		name: "Energy Tree of Doom and Demise",
	author: "MiseryGal",
	pointsName: "Energy Points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Release",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Released the game!<br>
		- Added Energy layer with 17 Upgrades and 1 Buyable.<br>
		- Added Battery layer with 9 Upgrades and 11 Milestones.<br>
		- Added Compact Energy layer with 2 Buyables.<br>
		- Added Dark Energy layer with 12 Upgrades.<br>
		- Added Dark Cores sub-layer with 3 Upgrades and 2 Buyables.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade('energy', 11)) gain = new Decimal(1)
	if (hasUpgrade('energy', 12)) gain = gain.add(player.energy.points.pow(0.9))
	if (hasUpgrade('energy', 22)) gain = gain.times(10)
	if (hasUpgrade('energy', 23)) gain = gain.times(2);
	if (hasUpgrade('battery', 12)) gain = gain.times(3);
	if (hasUpgrade('energy', 31) && hasUpgrade('battery', 21)) {gain = gain.times(player.battery.points.pow(2)); }
	else if (hasUpgrade('battery', 21)) {gain = gain.times(player.battery.points); }
	gain = gain.times(layers.compactenergy.buyables[11].effect(getBuyableAmount("compactenergy", 11))); 
	if (hasUpgrade('darkenergy', 22)) {gain = gain.times(100)}
	if (hasUpgrade('darkenergy', 31)) {gain = new Decimal(0)}
	if (hasUpgrade('darkenergy', 32)) {gain = gain.times(10)}

	return gain
}
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}

// Less important things beyond this point!

// Style for the background, can be a function
let backgroundStyle = function(){ if (player.achievements.doomsday.eq(1)) {
	return {"background-color": "#000000"}}
    else return {"background-image": "linear-gradient(rgb(53, 14, 14),rgb(0, 0, 0))"}
}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(60) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}