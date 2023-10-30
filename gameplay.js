const prompt = require("prompt-sync")({ sigint: true });
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

const GREENFLAG = 1;
const REDFLAG = 0;

// Reset text color
const reset = "\x1b[0m";
// Set message text colors
const log = {
    green: (text) => console.log("\x1b[32m" + text + reset),
    red: (text) => console.log("\x1b[31m" + text + reset),
    blue: (text) => console.log("\x1b[34m" + text + reset),
    yellow: (text) => console.log("\x1b[33m" + text + reset),
};

class Field {
    constructor(field = [[]]) {
        this.field = field;
        // Set user's initial position at x:0,y:0
        this.locationX = 0;
        this.locationY = 0;
        // Show pathCharacter at initial position
        this.field[0][0] = pathCharacter;
    }
    // Print current state of field
    print() {
        // Going through and console.log each element
        for (let element of this.field) {
            log.blue(element.join(""));
        }
    }
    // Print instruction
    instruction() {
        // Clear screen
        console.clear();
        log.green('Play by entering character:\n- "u" to move up\n- "d" to move down\n- "r" to move right\n- "l" to move left\n- "q" or holding CTRL + C key to quit.\n')
    }
    // Start game
    startGame() {
        let gamePlay = true;
        this.instruction();
        while (gamePlay) {
            // Print maze
            this.print();
            // Prompt direction to move
            this.promptMove();
            // Check if position is off-bound
            this.checkPosition()
            // Show pathCharacter at current position
            this.field[this.locationY][this.locationX] = pathCharacter;
        }
    }
    promptMove() {
        // Prompt user to input direction to move
        var moveDirection = prompt("Which way? ");
        // Convert to lowercase to check condition, incase user input in caps instead
        moveDirection = moveDirection.toLowerCase();
        // "Move" base on input for moveDirection
        switch (moveDirection) {
            case "u": // Move up
                this.locationY -= 1;
                break;
            case 'd': // Move down
                this.locationY += 1;
                break;
            case 'l': // Move left
                this.locationX -= 1;
                break;
            case 'r': // Move right
                this.locationX += 1;
                break;
            case 'q': // Quit game
                log.green("Thank you for playing. Goodbye.");
                this.gamePlay = false;
                process.exit();
            default:
                log.red("You need to input a valid move.")
                break;
        }
    }
    // Display status of game
    displayStatus(msg, flag) {
        switch (flag) {
            case REDFLAG:
                log.red(msg)
                break;

            default:
                log.green(msg)
                break;
        }
        this.gamePlay = false;
        process.exit();
    }

    // Catch if user has gone off-bound, fallen into the hole or found hat
    checkPosition() {
        if (this.locationY < 0 || this.locationX < 0 || this.locationY > this.field.length || this.locationX > this.field[0].length) {
            this.displayStatus("You have gone off-bound. Terminating game.", REDFLAG)
        }
        else if (this.field[this.locationY][this.locationX] === hole) {
            this.displayStatus("You have fallen into a hole. You lost.", REDFLAG)
        }
        else if (this.field[this.locationY][this.locationX] === hat) {
            this.displayStatus("You have found your hat! Congratulations!", GREENFLAG)
        }
    }
    // Generate field base on height and width input by user. Percentage of holes to appear: 0.1 - 0.2 (randomised)
    static generateField(height, width, percentage) {
        percentage = 0.1 + Math.random() * 0.1;
        // Create new array of (height) and (width) - empty items.
        const field = new Array(height).fill(0).map(el => new Array(width));
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Randomised probability
                const probability = Math.random();
                // If probability is bigger than percentage, fill withfieldCharacter. Else, fill with hole.
                field[y][x] = probability > percentage ? fieldCharacter : hole;
            }
        }
        // Set the "hat" location
        const hatLocation = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        };
        // Make sure "hat" is not at the starting point
        while (hatLocation.x === 0 && hatLocation.y === 0) {
            hatLocation.x = Math.floor(Math.random() * width);
            hatLocation.y = Math.floor(Math.random() * height);
        }
        field[hatLocation.y][hatLocation.x] = hat;
        return field;
    }
}
// Check if user input a valid height/width
function checkInput(inputType, input) {
    while (!/^([1-9][0-9]?$|^100)$/.test(input)) {
        log.red("You did not enter a number or limit the number to 1 - 100.");
        switch (inputType) {
            case "height":
                gameHeight = prompt("Input a number to set height of the maze: ");
                input = gameHeight;
                break;
            case "width":
                gameWidth = prompt("Input a number to set width of the maze: ");
                input = gameWidth;
                break;
            default:
                break;
        }
    }
}

console.clear();
// Log welcome message and prompt user for inputs to set maze
log.yellow("Welcome to Find Your Hat\n=========================\n")
console.log("Customise the maze size to set the level of difficulty.\n")
console.log("Limit your input to a number between 1-100\n")
// Prompt user input
gameHeight = prompt("Input a number to set height of the maze: ")
checkInput("height", gameHeight);
gameWidth = prompt("Input a number to set width of the maze: ")
checkInput("width", gameWidth);

// Instantiate class
const myField = new Field(Field.generateField(Number(gameHeight), Number(gameWidth)))
myField.startGame();