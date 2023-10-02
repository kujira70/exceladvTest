// Using the 'xlsx' library to read the Excel file
const XLSX = require('xlsx');

class GameParser {
    constructor(filePath) {
        this.filePath = filePath;
        this.gameData = this.readExcel();
        this.currentScene = null;
    }

    // Read the Excel file and convert it to JSON
    readExcel() {
        const workbook = XLSX.readFile(this.filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        return data;
    }

    // Get a scene by its Paragraph ID
    getScene(paragraphId) {
        return this.gameData.find(scene => scene['Paragraph ID'] === paragraphId);
    }

    // Start the game from the first scene
    startGame() {
        this.currentScene = this.gameData[0];
        this.displayScene();
    }

    // Display the current scene and prompt choices to the player
    displayScene() {
        console.log(`[${this.currentScene['Scene Prompt Character ID']}] ${this.currentScene['Scene Prompt Text']}`);
        console.log('Choices:');
        for (let i = 1; i <= 3; i++) {
            if (this.currentScene[`User Choice Prompt ${i}`]) {
                console.log(`${i}. ${this.currentScene[`User Choice Prompt ${i}`]}`);
            }
        }
    }

    // Handle the player's choice and transition to the next scene
    handleChoice(choiceNumber) {
        console.log(`[${this.currentScene['Result Text Character ID']}] ${this.currentScene[`Result Text Choice ${choiceNumber}`]}`);
        const nextParagraphId = this.currentScene[`Next Paragraph ID Choice ${choiceNumber}`];
        this.currentScene = this.getScene(nextParagraphId);
        if (this.currentScene) {
            this.displayScene();
        } else {
            console.log('End of game. Thank you for playing!');
        }
    }
}

// Usage:
// const game = new GameParser('C:\codes\js\excel-advdata-test\GameStoryData-CirtainAdv.xlsx');
const game = new GameParser('C:\\codes\\JS\\excel-advdata-test\\GameStoryData-CirtainAdv.xlsx');
game.startGame();

// When the player makes a choice, call:
// game.handleChoice(choiceNumber);
