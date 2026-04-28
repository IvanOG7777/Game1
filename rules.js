class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];

        // Checks to see if user has collected the buker key
        if (key === "Buried City East") {
            this.engine.show("There's this bunker. I wonder what's inside.");

            // If not collected show this
            if (!this.engine.state.hasBunkerKey) {
                this.engine.show("Damn, I need a key to enter.");

                this.engine.addChoice("North", { Text: "North",Target: "Buried City North" });
                this.engine.addChoice("South", {  Text: "South", Target: "Buried City South" });
                this.engine.addChoice("West", {  Text: "West", Target: "Buried City West" });
                this.engine.addChoice("Go to Blue Gate", { Text: "Go to Blue Gate", Target: "Blue Gate" });
            } else { // if collected show this
                this.engine.show(`There's a note inside. I should read it.`);
                this.engine.show(`"If you are reading this, I am dead. This was all a trap by Lrrr and Ndnd. They have sent you out to explore this planet to hunt you. You may still have time to leave with what you've got. Whatever you do, don't go back to them. I stashed a weapons cache at Blue Gate. I've provided you with a key. Good luck."`);

                if (!this.engine.state.hasWarehouseKey) {
                    this.engine.collectWarehouseKey();
                }

                this.engine.addChoice("Leave", {Text:"Leave", Target: "Buried City" });
                this.engine.addChoice("Go to Blue Gate", {Text:"Go to Blue Gate", Target: "Blue Gate" });
            }
            return;
        }
        
        if (key === "Radio Button") {// When user preses Radio button
            this.engine.show("\"Lrrr and Ndnd have ~~~~` you on this mission but there ~~` you don't ~~~`. At blue gate there's a key to the bunker\"");
            
            // If user doesnt already have the key show this and give key
            if (!this.engine.state.hasBunkerKey) {
                this.engine.addChoice("Pick up bunker key", {Text: "Pick up bunker key", Target: "Buried City", GiveItem: "BunkerKey"});
            }    
            return;
        }

        if (key === "Blue Gate Warehouse") { // When user goes to Warehouse
            this.engine.show("This place looks like an old security place, maybe weapons area?");


            if (!this.engine.state.hasWarehouseKey) { // If no key show this
                 this.engine.show("Damn, I need a key to enter.");

                this.engine.addChoice("Head to Village", { Text: "Head to Village",Target: "Blue Gate Village" });
                this.engine.addChoice("Go to Buried City", { Target: "Buried City" });
            } else {
                this.engine.show("Nice these are the weapons the note was talking about. They should help against Lrrr and Ndnd");
                this.engine.addChoice("Head to Village", { Text: "Head to Village",Target: "Blue Gate Village" });
                this.engine.addChoice("Pick up weapons", {Text: "Pick up weapons", Target: "Picked up weapons", GiveItem: "Weapons"});
            }
        }

        if (locationData.Body) {
            this.engine.show(locationData.Body);
        }

        if (locationData.Choices) {
            for (let choice of locationData.Choices) {
                if (choice.Text === "Press Radio button" && this.engine.state.hasBunkerKey) { // skip over the press radio button once pressed
                    continue;
                }
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("Restart", {Text: "Restart", Action: "Restart"});
        }
    }

    handleChoice(choice) {
    if (choice) {
        if (choice.Action === "Restart") {
            this.engine.resetGame();
            return;
        }

        this.engine.show("&gt; " + choice.Text);

        // If the user has the key update the UI
        if (choice.GiveItem === "BunkerKey") {
            this.engine.collectBunkerKey();
        }
        if (choice.GiveItem === "WarehouseKey") {
            this.engine.collectWarehouseKey();
        }
        if (choice.GiveItem === "Weapons") {
            this.engine.collectWeapons();
        }

        this.engine.gotoScene(Location, choice.Target);
    } else {
        this.engine.gotoScene(End);
    }
}
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
        this.engine.addChoice("Restart", { Text: "Restart", Action: "Restart" }); // Reset the game back to inital start state
    }
}

Engine.load(Start, 'myStory.json');