"use strict";
exports.__esModule = true;
function main() {
    var val = input.value.replace(",", ".");
    switch (checkInputType(val)) {
        case -1: // error
            console.log("error...something went wrong");
            console.log(val);
            break;
        case 0: // positiveBooking
            if (radioRandom.checked) {
                if (calculate(val, randDistrib(val)) === 0) {
                    updateOutput();
                }
            }
            else if (radioSort.checked) {
                if (calculate(val, sortedDistribution(val)) === 0) {
                    updateOutput();
                }
            }
            scrollDown(updateOutput.entryCount);
            break;
        case 1: // negativeBooking
            if (calculate(val, sortedDistribution(val)) === 0) {
                updateOutput();
            }
            scrollDown(updateOutput.entryCount);
            break;
        case 2: // commandPositiveBooking
            if (cmdPositiveBooking(val) === 0) {
                updateOutput();
            }
            scrollDown(updateOutput.entryCount);
            break;
        case 3: // commandNegativeBooking
            if (cmdNegativeBooking(val) === 0) {
                updateOutput();
            }
            scrollDown(updateOutput.entryCount);
            break;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////    input handling    ///////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function checkInputType(inVal) {
    /**
     * checks input for type...a value to book into cashRegister or a command
     * command...for special bookings, means e.g. an input into cashRegister of 10 pieces/ 20€
     *
     * cmds_examples:
     * +p10a20     positive booking of 10 pieces of 20€ banknotes
     * -p10a5      negative booking of 10 pieces of 5€ banknotes
     * +p20a0.5    positive booking of 20 pieces of 0.5€ coins
     *
     * variables:
     *   patterns    array/string      stores the regexPatterns
     *                                 index[0]  positiveBookingValue
     *                                 index[1]  negativeBokkingValue
     *                                 index[2]  commandPositiveBooking
     *                                 index[3]  commandNegativeBooking
     *
     * return     -1    invalid input
     * return     0     positive value to book
     * return     1     negative value to book
     * return     2     command for a positive booking
     * return     3     command for a negative booking
     */
    var patterns = [
        /(^[0-9]+((,|\.){1}[0-9]{0,2})?)/,
        /(^-{1}[0-9]+((,|\.){1}[0-9]{0,2})?)/,
        /(^\+{1}p[0-9]+a((((5|2){1}0?)|(10{0,2}))|(0{1}(,|\.)(5|2|1){1})|(0{1}(,|\.)0{1}(5|2|1){1})))/,
        /(^\-{1}p[0-9]+a((((5|2){1}0?)|(10{0,2}))|(0{1}(,|\.)(5|2|1){1})|(0{1}(,|\.)0{1}(5|2|1){1})))/,
    ];
    for (var i = 0; i < patterns.length; i++) {
        var result = inVal.match(patterns[i]);
        if (result == null) {
            continue;
        } // positive booking
        else if (i === 0 && result[0] === inVal) {
            return 0;
        } // negative booking
        else if (i === 1 && result[0] === inVal) {
            if (checkForMaxWithdraw(inVal)) {
                return 1;
            }
            else {
                return -1;
            }
        } // commandPositiveBooking
        else if (i === 2 && result[0] === inVal) {
            return 2;
        } // commandNegativeBooking
        else if (i === 3 && result[0] === inVal) {
            return 3;
        }
    }
    // no pattern matched
    alert("Bitte nur Beträge in folgendem Format eingeben,\n" +
        "oder gültige Befehle (siehe auch 'Info')...\n" +
        "\n" +
        "Beispiel: Beträge          Befehle\n" +
        "              100,30           +p20a2\n" +
        "              50                  -p15a0.01\n" +
        "              13.5               +p10a0,5\n" +
        "             -23.27            -p10a50\n" +
        "               usw.");
    input.value = "";
    return -1;
}
function checkForMaxWithdraw(inVal) {
    if (parseFloat(totalAmountCashRegister.toFixed(2)) + parseFloat(inVal) < 0) {
        alert("Entnahmebetrag ist zu gross...\n");
        input.value = "";
        return false;
    }
    else {
        return true;
    }
}
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////    commands    /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function cmdPositiveBooking(inVal) {
    /**
     * books a positive value to the cashRegister with a controlled num of assets
     * for syntax -> see info
     *
     * parameter:
     *    inVal       string        userinput command
     *
     * variables:
     *    functionOK  number        for returnValue of our function
     *    numPieces   number        extraction of value for pieces out of command
     *    asset       number        extraction of value for asset out of command
     *
     * return:  type  number
     *    -1          error
     *     0          everything ok
     */
    // extraction of values from command
    var functionOK = 0;
    var numPieces = parseFloat(inVal.substring(2, inVal.indexOf("a")));
    var asset = parseFloat(inVal.substring(inVal.indexOf("a") + 1));
    for (var i = 0; i < totalCashRegisterData.length; i++) {
        var element = totalCashRegisterData[i];
        if (element.asset == asset) {
            if (checkboxes[element.ID].checked) {
                element.amountLast = parseFloat((asset * numPieces).toFixed(2));
                element.assetTotal += numPieces;
                element.amountTotal += element.amountLast;
                element.assetLast = numPieces;
                totalAmountCashRegister += element.amountLast;
                lastInputAmount = element.amountLast;
            }
            else {
                alert("Das Asset ist in der Auswahl nicht vorhanden...");
                functionOK = -1;
                break;
            }
        }
        else {
            element.assetLast = 0;
            element.amountLast = 0;
        }
    }
    return functionOK;
}
function cmdNegativeBooking(inVal) {
    /**
     * books a negative value from the cashRegister with a controlled num of assets
     * for syntax -> see info
     *
     * parameter:
     *    inVal       string        userinput command
     *
     * variables:
     *    functionOK  number        for returnValue of our function
     *    numPieces   number        extraction of value for pieces out of command
     *    asset       number        extraction of value for asset out of command
     *
     * return:   type number
     *    -1          error
     *     0          everything ok
     */
    var functionOK = 0;
    var numPieces = parseFloat(inVal.substring(2, inVal.indexOf("a")));
    var asset = parseFloat(inVal.substring(inVal.indexOf("a") + 1));
    for (var i = 0; i < totalCashRegisterData.length; i++) {
        var element = totalCashRegisterData[i];
        if (element.asset == asset) {
            if (element.assetTotal - numPieces < 0) {
                alert("Nicht genug Assets vorhanden...");
                functionOK = -1;
                break;
            }
            if (checkboxes[element.ID].checked) {
                element.amountLast = parseFloat((asset * numPieces).toFixed(2)) * -1;
                element.assetTotal -= numPieces;
                element.amountTotal += element.amountLast;
                element.amountTotal = Math.abs(element.amountTotal);
                element.assetLast = numPieces * -1;
                totalAmountCashRegister += element.amountLast;
                lastInputAmount = element.amountLast;
            }
            else {
                alert("Das Asset ist in der Auswahl nicht vorhanden...");
                functionOK = -1;
                break;
            }
        }
        else {
            element.assetLast = 0;
            element.amountLast = 0;
        }
    }
    return functionOK;
}
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////    visualization    ////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function updateOutput() {
    /**
     * creates a table of values for the user
     * the innerText of the outputElement gets expanded by every round
     */
    // static variables
    if (typeof updateOutput.entryCount == "undefined") {
        updateOutput.entryCount = 0;
    }
    updateOutput.entryCount++;
    out.innerHTML +=
        "+-----------------------------------------------------+<br>" +
            "Eintrag:&emsp;" +
            adaptSpaces(updateOutput.entryCount, 9) +
            adaptSpaces("total", 25) +
            "einzel" +
            "<br>" +
            "+-----------------------------------------------------+<br>" +
            "Betrag(€):&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;" +
            adaptSpaces(totalAmountCashRegister.toFixed(2), 25) +
            lastInputAmount.toFixed(2) +
            "<br>" +
            "<br>" +
            "Banknoten(Stck):<br>" +
            "<br>" +
            "100€:&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[0].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[0].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[0].assetLast.toFixed(0), 10) +
            totalCashRegisterData[0].amountLast.toFixed(2) +
            "<br>" +
            "50€:&emsp;&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[1].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[1].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[1].assetLast.toFixed(0), 10) +
            totalCashRegisterData[1].amountLast.toFixed(2) +
            "<br>" +
            "20€:&emsp;&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[2].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[2].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[2].assetLast.toFixed(0), 10) +
            totalCashRegisterData[2].amountLast.toFixed(2) +
            "<br>" +
            "10€:&emsp;&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[3].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[3].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[3].assetLast.toFixed(0), 10) +
            totalCashRegisterData[3].amountLast.toFixed(2) +
            "<br>" +
            "5€:&emsp;&emsp;&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[4].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[4].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[4].assetLast.toFixed(0), 10) +
            totalCashRegisterData[4].amountLast.toFixed(2) +
            "<br><br>" +
            "Münzen(Stck):<br>" +
            "<br>" +
            "2€:&emsp;&emsp;&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[5].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[5].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[5].assetLast.toFixed(0), 10) +
            totalCashRegisterData[5].amountLast.toFixed(2) +
            "<br>" +
            "1€:&emsp;&emsp;&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[6].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[6].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[6].assetLast.toFixed(0), 10) +
            totalCashRegisterData[6].amountLast.toFixed(2) +
            "<br>" +
            "0.5€:&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[7].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[7].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[7].assetLast.toFixed(0), 10) +
            totalCashRegisterData[7].amountLast.toFixed(2) +
            "<br>" +
            "0.2€:&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[8].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[8].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[8].assetLast.toFixed(0), 10) +
            totalCashRegisterData[8].amountLast.toFixed(2) +
            "<br>" +
            "0.1€:&emsp;&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[9].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[9].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[9].assetLast.toFixed(0), 10) +
            totalCashRegisterData[9].amountLast.toFixed(2) +
            "<br>" +
            "0.05€:&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[10].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[10].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[10].assetLast.toFixed(0), 10) +
            totalCashRegisterData[10].amountLast.toFixed(2) +
            "<br>" +
            "0.02€:&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[11].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[11].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[11].assetLast.toFixed(0), 10) +
            totalCashRegisterData[11].amountLast.toFixed(2) +
            "<br>" +
            "0.01€:&emsp;&emsp;" +
            adaptSpaces(totalCashRegisterData[12].assetTotal.toFixed(0), 10) +
            adaptSpaces(totalCashRegisterData[12].amountTotal.toFixed(2), 15) +
            adaptSpaces(totalCashRegisterData[12].assetLast.toFixed(0), 10) +
            totalCashRegisterData[12].amountLast.toFixed(2) +
            "<br>" +
            "<br>" +
            "<br>" +
            "<br>" +
            "<br>" +
            "<br>" +
            "<br>" +
            "<br>" +
            "<br>";
}
function scrollDown(count) {
    /**
     * autoscroll the page by a measured value
     *
     * we measure the elementsHeight and multiply it by a counter, we get after every new
     * input from the user
     *
     * parameter:
     *    count     number      value for calculating the whole scrollDistance
     *
     */
    // static variables
    if (typeof scrollDown.height == "undefined") {
        scrollDown.height = 0;
    }
    // get the height of the element after first entry...
    if (count == 1) {
        scrollDown.height = out.offsetHeight;
    }
    // scroll down the page by the measured elements height
    if (count > 0) {
        window.scroll(0, count * scrollDown.height);
    }
}
function adaptSpaces(inVal, numSpace) {
    /**
     * concat the correct num of spaces, so that there is no shifting to the right
     * when there is one more character(digit) inside the string to the left
     *
     * e.g.
     * entry a      entry b
     *  1               a
     *  2               b
     *  10               c
     *  3               d
     *  100               e
     *  4               f
     *
     * parameters:
     *    inval       any       the String, we need to concatinate with spaces
     *    numSpace    number    the num of spaces, we like to add
     *    result                the concatinated string
     *
     * variables:
     *    lenValue    number    length of the input string
     *    result      string    string with all the 'spaces' needed
     *
     * return:
     *    result
     */
    var lenValue = String(inVal).length;
    var result = String(inVal);
    for (var i = 0; i < numSpace - lenValue; i++) {
        result += "&emsp;";
    }
    return result;
}
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////    calculation    //////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function calculate(inVal, inArray) {
    /**
     * calculation of the current state of the cashRegister, fills the
     * global array totalCashRegisterData
     *
     * parameter:
     * inVal       string           current userInput
     * inArray     []number         values of assets from distributionCalculation
     *
     * variables:
     * amo         number           current amount, conversion string/number from inVal
     * x           number           for + or - the values
     *
     * function:   distributionOK   checks for problems with distribution result
     *
     * return:     0                everything is fine...
     *            -1                error, something went wrong with distribution
     */
    var amo = parseFloat(inVal);
    var x = 1;
    // plus or minus
    if (amo < 0) {
        x *= -1;
    }
    if (distributionOK(amo, inArray)) {
        // fill the array, calculate totalAmount and lastAmount
        lastInputAmount = 0;
        for (var i = 0; i < totalCashRegisterData.length; i++) {
            if (inArray[i] > 0) {
                if (totalCashRegisterData[i].ID === i) {
                    totalCashRegisterData[i].assetTotal += inArray[i] * x;
                    totalCashRegisterData[i].amountTotal += inArray[i] * (totalCashRegisterData[i].asset * x);
                    totalCashRegisterData[i].amountTotal = Math.abs(totalCashRegisterData[i].amountTotal);
                    totalCashRegisterData[i].assetLast = inArray[i] * x;
                    totalCashRegisterData[i].amountLast = inArray[i] * totalCashRegisterData[i].asset * x;
                    lastInputAmount += totalCashRegisterData[i].amountLast;
                    totalAmountCashRegister += totalCashRegisterData[i].amountLast;
                }
            }
            else {
                if (totalCashRegisterData[i].ID === i) {
                    totalCashRegisterData[i].assetLast = 0;
                    totalCashRegisterData[i].amountLast = 0;
                }
            }
        }
        return 0;
    }
    else {
        return -1;
    }
}
function distributionOK(inVal, inArray) {
    /**
     * check, if there is a difference between UserInputValue and
     * sum of assets...
     * thats possible, when user disabled assets or there are not
     * enough of the right assets in the cashregister to distribute properly...
     *
     * parameters:
     *      inVal         number          userInput
     *      inArray       []number        distributionArray of userInput
     *
     * variables:
     *      amo           number          sum of assetValues from distributionArray
     *      assetIDs      []number        assetValues
     *
     * return:
     *      true                          when no problem occurs with distribution, or user confirmed the
     *                                    the knowledge of the problem
     *      false                         if there is a problem and user don not confirm
     */
    var amo = 0;
    var assetIDs = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];
    for (var i = 0; i < inArray.length; i++) {
        if (inArray[i] > 0) {
            amo += inArray[i] * assetIDs[i];
        }
    }
    amo = parseFloat(amo.toFixed(2));
    if (Math.abs(inVal) - amo != 0) {
        var x = Math.abs(inVal) - amo;
        if (confirm("Achtung ! \n" +
            "\n" +
            "   Es bleibt ein Rest von " +
            x.toFixed(2) +
            "€\n" +
            "   Dieser Rest wird nicht gebucht!\n" +
            "\n" +
            "   Betrag von  " +
            amo +
            " €   trotzdem buchen!?") == false) {
            inArray = [];
            return false;
        }
    }
    return true;
}
