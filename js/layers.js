addLayer("p", {
    name: "planets", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        matterDeposited: new Decimal(0),
    }},
    color: "yellowgreen",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "planets", // Name of prestige currency
    baseResource: "matter", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        mult = mult.mul(player.m.points.add(1))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    doReset(resettingLayer) {
       if (layers[resettingLayer].row <= this.row) return;
    
       let keep = [];
       if (hasMilestone("s", 2)) keep.push("upgrades");
       layerDataReset(this.layer, keep);
     },
    clickables: {
        11: {
            title: "Add 1 Matter",
            display: "Hotkey: [Z]",
            onClick() {
                player.p.matterDeposited = player.p.matterDeposited.add(1)
                player.points = player.points.sub(1)
                if (player.p.matterDeposited.gte(50)) {
                    instantGain("p", 1)
                    player.p.matterDeposited = new Decimal(0)
                }
            },
            canClick() {return player.points.gte(1)},
            style: {
                "border-radius":"15px"
            }
        },
        12: {
            title: "Add 25% Matter",
            display: "Hotkey: [X]",
            onClick() {
                let added = player.points.div(4).floor()
                player.p.matterDeposited = player.p.matterDeposited.add(added)
                player.points = player.points.mul(0.75)
                if (player.p.matterDeposited.gte(50)) {
                    let gains = player.p.matterDeposited.div(50).floor()
                    instantGain("p", gains)
                    player.p.matterDeposited = player.p.matterDeposited.sub(gains.mul(50))
                }
            },
            canClick() {return player.points.gte(4)},
            unlocked() {return hasUpgrade('p', 13) || hasMilestone("s", 1)},
            style: {
                "border-radius":"15px"
            }
        },
        13: {
            title: "Add 100% Matter",
            display: "Hotkey: [C]",
            onClick() {
                player.p.matterDeposited = player.p.matterDeposited.add(player.points.floor())
                player.points = new Decimal(0)
                if (player.p.matterDeposited.gte(50)) {
                    let gains = player.p.matterDeposited.div(50).floor()
                    instantGain("p", gains)
                    player.p.matterDeposited = player.p.matterDeposited.sub(gains.mul(50))
                }
            },
            canClick() {return player.points.gte(10)},
            unlocked() {return hasMilestone("s", 3)},
            style: {
                "border-radius":"15px"
            }
        }
    },
    infoboxes: {
        info: {
            title: "Information|Planets",
            body: "This game is not like most other TMT games, because I tried to make something unique with this game. <br>Your first objective is to make a planet, which requires 50 matter. Click the [Grow planet] button to add 1 matter to the planet.",
        }
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "z", description: "[Z] Add 1 Matter (planets)", onPress(){clickClickable("p", 11)}},
        {key: "x", description: "[X] Add 25% Matter (planets)", onPress(){clickClickable("p", 12)}},
        {key: "c", description: "[Z] Add 100% Matter (planets)", onPress(){clickClickable("p", 13)}},
    ],
    upgrades: {
        11: {
            title: "Multiplier",
            description: "Multiply matter gain by 2",
            cost: new Decimal(1)
        },
        12: {
            title: "Tripliplier",
            description: "Multiply matter gain by 3",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade('p', 11)}
        },
        13: {
            title: "New Button",
            description: "Unlock Add 25% Matter button",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade('p', 12)}
        },
        14: {
            title: "Another Layer",
            description: "Unlock star layer",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade('p', 13)}
        },
    },
    layerShown(){return true},
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                ["infobox", "info"],
                ["display-text", "Planet Creations"],
                "blank",
                "h-line",
                "blank",
                ["display-text", function() {return "You have put <span class='planets'><h2>"+ player.p.matterDeposited +" / 50</h2></span> matter"}],
                "blank",
                "clickables",
                "blank",
                ["display-text", "Planet Upgrades"],
                "blank",
                "h-line",
                "blank",
                "upgrades"
            ]
        }
    }
})

addLayer("s", {
    name: "stars", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "khaki",
    requires: new Decimal(8), // Can be a function that takes requirement increases into account
    resource: "stars", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ["p"],
    infoboxes: {
        info: {
            title: "Information|Stars",
            body: "You made it to the stars layer! Now the game will not be boring anymore, lol.<br>You can start by getting 8 planets for a star, then the star will trigger 1st milestone, no upgrade needed."
        }
    },
    hotkeys: [
        {key: "s", description: "[S] Reset planets to get stars", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "1 star",
            effectDescription: "Your matter gain is multiplied by 2.5",
            done() {return player.s.points.gte(1)}
        },
        1: {
            requirementDescription: "2 stars",
            effectDescription: "x2 matter gain, Add 25% Matter button always unlocked",
            done() {return player.s.points.gte(2)}
        },
        2: {
            requirementDescription: "4 stars",
            effectDescription: "Keep planet upgrades on row 1 reset",
            done() {return player.s.points.gte(4)}
        },
        3: {
            requirementDescription: "5 stars",
            effectDescription: "Permanently unlock Add 100% Matter button",
            done() {return player.s.points.gte(5)}
        },
        4: {
            requirementDescription: "10 stars",
            effectDescription: "Unlock the Moon layer",
            done() {return player.s.points.gte(10)}
        },
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "infoboxes",
        ["display-text", "Star Milestones"],
        "blank",
        "h-line",
        "blank",
        "milestones"
    ],
    layerShown(){return hasUpgrade('p', 14)}
})

addLayer("m", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        moonCostA: new Decimal(12), //Planet cost
        moonCostB: new Decimal(2500) //Matter cost
    }},
    color: "gray",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "moons", // Name of prestige currency
    baseResource: "matter", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    infoboxes: {
        info: {
            title: "Information|Moons",
            body: "This is the moon layer, this is a side layer for faster progression to row 1+ resets.<br>The buff from moons is simple: Moons+1, which means 3 moons = x4 planets."
        }
    },
    branches: ["p", "s"],
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "[M] Buy a moon", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    tabFormat: [
        "main-display",
        "buyables",
        ["infobox", "info"],
    ],
    buyables: {
        11: {
            title: "Buy a moon",
            cost(x) { return new Decimal(500).mul(x.pow(2)) },
            display() { return `Cost: ${format(this.cost())} matter` },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
    componentStyles: {
        "buyable"() { return {'height': '100px', 'width': '160px'} },
    },
    effect() {return player.m.points.add(1)},
    effectDescription() {return "which multiply planet gain by <h2 style='color: gray; text-shadow: gray 0px 0px 10px'>"+format(player.m.points.add(1))+"x</h2>"},
    layerShown(){return hasMilestone("s", 4)}
})

addLayer("a", {
    name: "Achievements",
    symbol: "A",
    row: "side",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "gold",
    resource: "achievements", 
    type: "none", 

    // Updates the layer points automatically every tick
    update() {
        let earned = player[this.layer].achievements.length;
        player[this.layer].points = new Decimal(earned);
    },

    // Displays the standard resource counter and the fraction breakdown
    tabFormat: [
        ["display-text", function() { 
            let earned = player['a'].achievements.length;
            let total = Object.keys(layers['a'].achievements).filter(key => !isNaN(key)).length;
            return `Progress: ${earned} / ${total} achievements completed. (${format((earned/total)*100)}%)`;
        }],
        ["blank", "20px"],
        ["display-text", "Achievements"],
        "blank",
        "h-line",
        "blank",
        "achievements"
    ],

    achievements: {
        11: {
            name: "The first planet",
            done() { return player.p.points.gte(1) },
            tooltip: "Get your 1st planet",
        },
        12: {
            name: "Finally",
            done() { return hasUpgrade('p', 13) },
            tooltip: "Buy planet upgrade 13",
        },
        13: {
            name: "Complete for now",
            done() { return hasUpgrade('p', 14) },
            tooltip: "Buy every planet upgrade",
        },
        14: {
            name: "Time for stars",
            done() { return hasUpgrade('p', 14) && player.p.points.gte(8) },
            tooltip: "Buy every planet upgrade",
        },
    },
})