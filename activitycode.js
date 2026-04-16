// function that occurs when a button is pressed (saves current dot position)
input.onButtonPressed(Button.A, function () {
    led.plot(1, y)
})

// function that occurs when b button is pressed (moves dot one downwards, if at end calculates probability)
input.onButtonPressed(Button.B, function () {
    led.unplot(0, y)
    if (y != 4) {
        y += 1
        led.plot(0, y)
    } 
    else {
        y = 0
        for (let l = 0; l <= 4; l++) {
            if (led.point(1, l) == true) {
                list[l] = 1
            }
            else {
                list[l] = 0
            }
    }
    serial.writeNumbers(list)

        //calculating probability based on statistical average
        probTotal = 1
        probTotalUn = 1
        for (let m = 0; m <= 4; m++) {
            if (list[m] == 1) {
                probTotal *= probIfTrue[m];
                probTotalUn *= (1-probIfTrue[m]);
            }
        }

        probTotal *= probabilityBase;
        probTotalUn *= (1-probabilityBase);
        probFin = probTotal / (probTotal + probTotalUn);

        if (Math.round(probFin * 100) > 50) {
            serial.writeString("The model is " + Math.round(probFin * 100).toString() + "% certain that the input fits the critera\n")
        }
        else {
            serial.writeString("The model is " + (100-Math.round(probFin * 100)).toString() + "% certain that the input does not fit the critera\n")
        }

        basic.showLeds(`
            # . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    }
})

// creates the dataset
function createDataset () {

    // saves information about data to calculate percentages
    dataSum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let index = 0; index < 10000; index++) {

        // randomly generates data point
        dataPoint = [
            Math.round(randint(randint(40, 50), randint(51, 100)) / 100),
            Math.round(randint(randint(10, 50), randint(51, 60)) / 100),
            Math.round(randint(randint(20, 50), randint(51, 73)) / 100),
            Math.round(randint(randint(15, 50), randint(51, 60)) / 100),
            Math.round(randint(randint(21, 50), randint(51, 110)) / 100),
            Math.round(randint(randint(10, 50), randint(51, 90)) / 100)
        ]

        if (dataPoint[5] == 1) {
            for (let i = 0; i <= 4; i++) {
                if (dataPoint[i] == 1) {
                    dataSum[i] = dataSum[i] + 1
                }
            }
            completedTimes += 1
        } 
        
        else {
            for (let j = 0; j <= 4; j++) {
                if (dataPoint[j] == 1) {
                    dataSum[j + 5] = dataSum[j + 5] + 1
                }
            }
            incompletedTimes += 1
        }
    }

    serial.writeNumbers(dataSum)
    serial.writeNumber(completedTimes); serial.writeLine("")
    serial.writeNumber(incompletedTimes); serial.writeLine("")

    probabilityBase = completedTimes / (completedTimes + incompletedTimes)
    serial.writeString("Input fits the criteria " + Math.round(probabilityBase*100).toString() + "% of the time (overall)\n")
    
    for (let k = 0; k <= 4; k++) {
        probIfTrue[k] = dataSum[k] / completedTimes
        serial.writeString("Input fits the criteria " + Math.round(probIfTrue[k]*100).toString() + "% of the time when category " + k.toString() + " is true\n")
    }
}

//sets up variables and begins program
let dataset: number[][] = []
let dataSum: number[] = []
let dataPoint: number[] = []
let list: number[] = []
let probIfTrue: number[] = []

let probFin = 0
let probTotalUn = 0
let probTotal = 0
let probabilityBase = 0
let incompletedTimes = 0
let completedTimes = 0
let y = 0

list = [0, 0, 0, 0, 0]
probIfTrue = [0, 0, 0, 0, 0]
dataPoint = []
dataset = []

led.plot(0, y)
createDataset()
