// game-browser.js
class GameParser {
    constructor(file) {
        this.file = file;
        this.gameData = [];
        this.currentScene = null;
        this.readExcel();
    }

    readExcel() {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            this.gameData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            this.startGame();
        };
        reader.readAsArrayBuffer(this.file);
    }


// class GameParser {
//     constructor(filePath) {
//         this.filePath = filePath;
//         this.gameData = null;
//         this.currentScene = null;
//         this.readExcel();
//     }

//     // Read the Excel file and convert it to JSON
//     readExcel() {
//         fetch(this.filePath)
//             .then(response => response.arrayBuffer())
//             .then(data => {
//                 const workbook = XLSX.read(data, { type: 'array' });
//                 const sheetName = workbook.SheetNames[0];
//                 this.gameData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//                 this.startGame();
//             });
//     }

    // Get a scene by its Paragraph ID
    getScene(paragraphId) {
        return this.gameData.find(scene => scene['Paragraph ID'] === paragraphId);
    }

    // Start the game from the first scene
    startGame() {
        // Check if a file has been selected
        if (!this.file) {
            console.error("No Excel file selected. Please select a file to start the game.");
            return;
        }
    
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            this.processExcelData(workbook);
            this.displayScene();
        };
        reader.readAsArrayBuffer(this.file);
    }
    //     startGame() {
    //     this.currentScene = this.gameData[0];
    //     this.displayScene();
    // }

    // Display the current scene and prompt choices to the player
    displayScene() {
        document.getElementById('scenePrompt').textContent = `[${this.currentScene['Scene Prompt Character ID']}] ${this.currentScene['Scene Prompt Text']}`;
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            if (this.currentScene[`User Choice Prompt ${i}`]) {
                const choiceBtn = document.createElement('button');
                choiceBtn.textContent = this.currentScene[`User Choice Prompt ${i}`];
                choiceBtn.onclick = () => {
                    this.handleChoice(i);
                    this.displayScene();
                };
                choicesDiv.appendChild(choiceBtn);
            }
        }
    }

    // Handle the player's choice and transition to the next scene
    handleChoice(choiceNumber) {
        alert(`[${this.currentScene['Result Text Character ID']}] ${this.currentScene[`Result Text Choice ${choiceNumber}`]}`);
        const nextParagraphId = this.currentScene[`Next Paragraph ID Choice ${choiceNumber}`];
        this.currentScene = this.getScene(nextParagraphId);
        if (this.currentScene) {
            this.displayScene();
        } else {
            alert('End of game. Thank you for playing!');
        }
    }
}

// Remove the immediate game initialization from the bottom of the script
// const game = new GameParser();
// game.startGame();
// Usage:
// const game = new GameParser('C:\\codes\\JS\\excel-advdata-test\\GameStoryData-CirtainAdv.xlsx');


// Add an event listener to the file input to start the game when a file is selected
document.getElementById('excelFile').addEventListener('change', function(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        const game = new GameParser(selectedFile);
        game.startGame();
    } else {
        console.error("No file selected.");
    }
});
