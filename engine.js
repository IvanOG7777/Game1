class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.state = {
            hasBunkerKey: false,
            hasWarehouseKey: false,
            hasWeapons: false
        }

        this.header = document.body.appendChild(document.createElement("h1"));
        this.statusBar = document.body.appendChild(document.createElement("div"))
        this.output = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));

        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );
    }

    gotoScene(sceneClass, data) {
        this.updateStatusBar();
        this.scene = new sceneClass(this);
        this.scene.create(data);
    }

    addChoice(action, data) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            this.scene.handleChoice(data);
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }

    // Function used to set up status bar at the top of header
    updateStatusBar() {
        this.statusBar.innerHTML = `<strong>Inventory:</strong>
        Bunker Key: ${this.state.hasBunkerKey ? "Collected" : "Not collected"} |
        Warehouse Key: ${this.state.hasWarehouseKey ? "Collected" : "Not collected"} |
        Weapons: ${this.state.hasWeapons ? "Collected" : "Not Collected"}
        <hr>`;
    }

    // Functions used to collect the keys and set bool to true
    collectBunkerKey() {
        this.state.hasBunkerKey = true;
        this.updateStatusBar();
    }
    collectWarehouseKey() {
        this.state.hasWarehouseKey = true;
        this.updateStatusBar();
    }
    collectWeapons() {
        this.state.hasWeapons = true;
        this.updateStatusBar();   
    }

    // Function used to reset the game when dead or finshed
    resetGame() {
        this.state = {
            hasBunkerKey: false,
            hasWarehouseKey: false,
            hasWeapons: false
        }

        while (this.output.firstChild) {
        this.output.removeChild(this.output.firstChild);
    }

    while (this.actionsContainer.firstChild) {
        this.actionsContainer.removeChild(this.actionsContainer.firstChild);
    }

    this.updateStatusBar();
    this.gotoScene(this.firstSceneClass);
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}