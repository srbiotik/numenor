// Desc: Main game file
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const { exec } = require('child_process');

const { getDefaultSettings } = require('./settings.js');


// Constructs the main game object
class Game {
    constructor(options) {
        this.options = options;
        this.settings = getDefaultSettings();
        this.currentLevel = this.settings.defaultLevel;
    }
    async startNewGame() {
        this.readline = readline.createInterface({ input: stdin, output: stdout });
        this.setGamePlayParameters();
        this.printLevelDescription();
        if (await this.readline.question('Nova igra? (da/ne) ') == 'da') {
            this.run();
        } else {
            this.readline.close();
            process.exit(0);
        }
    }
    run() {
        let counter = 0;
        const interval = setInterval(async () => {
            this.sayNumber(counter);
            if (counter == this.numbers.length) this.stopGame(interval);

            if (counter >= this.gameLevel.n && counter < this.numbers.length) {
                const operands = this.numbers.slice(counter - this.gameLevel.n, counter + 1);
                const operations = this.operations.slice(counter - this.gameLevel.n, counter);
                counter++
                this.runTrial(operands, operations)
            } else counter++
        }, this.gameLevel.interval * 1000);
    }
    setGamePlayParameters() {
        this.gameLevel = this.settings.levels[this.currentLevel]
        this.numbers = this.generateNumbers();
        this.operations = this.generateOperations();
        this.hits = 0;
    }
    generateNumbers() {
        const numbers = [];
        const [start, end] = this.gameLevel.numRange
        for (let i = 0; i < this.settings.rounds + this.gameLevel.n + 1; i++) {
            let number = Math.floor(Math.random() * (end - start + 1)) + start;
            numbers.push(number);
        }
        return numbers;
    }
    generateOperations() {
        const operations = [];
        for (let i = 0; i < this.settings.rounds + this.gameLevel.n; i++) {
            let randIndex = Math.floor(Math.random() * this.gameLevel.operations.length)
            operations.push(this.gameLevel.operations[randIndex]);
        }
        return operations;
    }
    calculateResult(operands, operations) {
        let result = operands[0];
        for (let i = 1; i < operands.length; i++) {
            if (operations[i - 1] === '+') {
                result += operands[i];
            } else if (operations[i - 1] === '-') {
                result -= operands[i];
            }
        }
        return result;
    }
    speak(text, language = 'Lana') {
        exec(`say -v ${language} ${text}`);
    }
    sayNumber(counter) {
        if (counter == 0) {
            this.speak(`${this.numbers[counter]}`);
        } else if (counter > 0 && counter < this.numbers.length) {
            const operation = this.getOperationName(this.operations[counter - 1]);
            this.speak(`${operation} ${this.numbers[counter]}`)
        } else if (counter == this.numbers.length - 1) {
            this.speak(`${this.numbers[counter]}`);
        }
    }
    printScore() {
        const resultString = `Rezultat: ${this.hits}/${this.operations.length} - ${this.score.toFixed(2)}%`;
        const levelString = this.getLevelString();
        console.log(`${resultString}\n${levelString}`)
    }
    printLevelDescription() {
        console.log(`Nivo ${this.currentLevel + 1}:`);
        console.log(`Izvrsi zadate operacije (mogu biti ${this.gameLevel.operations.join(', ')}) nad ${this.gameLevel.n + 1} ${this.gameLevel.n + 1 > 4 ? 'brojeva' : 'broja'} u nizu od ${this.gameLevel.numRange[0]} do ${this.gameLevel.numRange[1]}.`);
    }
    getOperationName(operation) {
        switch (operation) {
            case '+':
                return 'plus';
            case '-':
                return 'minus';
            case '/':
                return 'podeljeno sa';
            case '*':
                return 'puta';
        }
    }
    getLevelString() {
        switch (this.levelOffset) {
            case 0:
                return 'Ostajes na istom nivou!';
            case 1:
                return 'Prelazis na visi nivo!';
            case -1:
                return 'Padas jedan nivo nize.';
            default:
                break;
        }
    }
    score() {
        this.score = 100 * this.hits / this.operations.length;
        if (this.score >= this.settings.passScore && this.currentLevel < this.settings.levels.length - 1) {
            this.levelOffset = 1;
        } else if (this.score < this.settings.failScore && this.currentLevel > 1) {
            this.levelOffset = -1;
        } else {
            this.levelOffset = 0;
        }
        this.currentLevel += this.levelOffset;
    }
    async runTrial(operands, operations) {
        let result = this.calculateResult(operands, operations);
        const answer = await this.readline.question('Resultat: ')
        if (parseInt(answer) == result) {
            console.log('√');
            this.hits++
        } else {
            console.log('X');
        };
    }
    stopGame(gameInterval) {
        clearInterval(gameInterval);
        this.score();
        this.printScore();
        this.readline.close();
        this.startNewGame();
    }
}

module.exports = { Game };


