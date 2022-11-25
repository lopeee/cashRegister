"use strict";

var input = document.getElementById("input_startValue");
var out = document.getElementById("output");
var chkbxRandom = document.getElementById("checkbox_random");
var chkbxSort = document.getElementById("checkbox_sorted");
var totalAmountCashRegister = 0;
var totalCashRegisterData = [
    {
        ID: 0,
        asset: 100,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 1,
        asset: 50,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 2,
        asset: 20,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 3,
        asset: 10,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 4,
        asset: 5,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 5,
        asset: 2,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 6,
        asset: 1,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 7,
        asset: 0.5,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 8,
        asset: 0.2,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 9,
        asset: 0.1,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 10,
        asset: 0.05,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 11,
        asset: 0.02,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
    {
        ID: 12,
        asset: 0.01,
        assetTotal: 0,
        amountTotal: 0,
        assetLast: 0,
        amountLast: 0
    },
];
chkbxRandom.addEventListener("change", function (e) { return toggleDistribCheckboxes("rand"); });
chkbxSort.addEventListener("change", function (e) { return toggleDistribCheckboxes("sort"); });
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        main();
    }
});
chkbxRandom.checked = true;
function main() {
    var val = input.value.replace(",", ".");
    if (isInputValid(val)) {
        if (chkbxRandom.checked) {
            calculate(val, randDistrib(val));
            updateOutput(val);
        }
        else if (chkbxSort.checked) {
            calculate(val, fromHighToLowDistrib(val));
            updateOutput(val);
        }
        scrollDown(updateOutput.entryCount);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////    functions    ////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function isInputValid(inVal) {
    /**
     * checks a string by regex...
     *
     * returns true, if validation was successfully
     * returns false, if validation failed and gives a message to the user
     */
    var pattern = /(-?[0-9]+((,|\.){1}[0-9]+)?)/g;
    var result = inVal.match(pattern);
    // validation characters
    if (result == null || result[0] != inVal) {
        alert("Bitte nur Zahlen in folgendem Format eingeben...\n" +
            "\n" +
            "Beispiel:\n" +
            "      100,30\n" +
            "      50\n" +
            "      13.5\n" +
            "      -23.27\n" +
            "      usw.");
        input.value = "";
        return false;
    }
    else {
        // validation maxWithdraw
        if (totalAmountCashRegister + parseFloat(inVal) < 0) {
            alert("Entnahmebetrag ist zu gross...\n");
        }
        else {
            return true;
        }
    }
}
function updateOutput(inVal) {
    /**
     * creates a table of values for the user
     * the innerText of the outputElement gets expanded by every round
     */
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
        parseFloat(inVal).toFixed(2) +
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
     * scroll the page by a measured value
     *
     */
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
function toggleDistribCheckboxes(inID) {
    /**
     * switching between checkboxes...like the radioButtons in VBA
     * only one checkbox is allowed to stay checked
     */
    switch (inID) {
        case "rand":
            if (chkbxRandom.checked) {
                chkbxSort.checked = false;
            }
            else {
                chkbxRandom.checked = true;
            }
            break;
        case "sort":
            if (chkbxSort.checked) {
                chkbxRandom.checked = false;
            }
            else {
                chkbxSort.checked = true;
            }
            break;
    }
}
function adaptSpaces(inVal, numSpace) {
    /**
     * concat the right num of spaces, so that there is no shifting to the right
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
     * @param inval     // the String, we need to concatinate with spaces
     * @param numSpace  // the num of spaces, we like to add
     * @return result   // the concatinated string
     */
    var lenValue = String(inVal).length;
    var result = inVal;
    for (var i = 0; i < numSpace - lenValue; i++) {
        result += "&emsp;";
    }
    return result;
}
function calculate(inVal, inArray) {
    /**
     * calculation of the current state of the cashRegister, fills the
     * global array totalCashRegisterData
     *
     * @param     inVal             current amount in/out the cashRegister
     * @param     inArray           values of assets from distributionCalculation
     *
     * @variable  assetsID          holds the assetsValues
     * @variable  amo               current amount, conversion string/number from inVal
     * @variable  x                 for + or - the values
     *
     */
    var assetIDs = [100, 50, 20, 10, 5, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];
    var amo = parseFloat(inVal);
    var x = 1;
    // plus or minus
    if (totalAmountCashRegister + amo < totalAmountCashRegister) {
        x *= -1;
    }
    // calculation new totalAmount
    totalAmountCashRegister += amo;
    // fill the array
    for (var i = 0; i < totalCashRegisterData.length; i++) {
        if (Math.abs(inArray[i]) > 0) {
            if (totalCashRegisterData[i].ID === i) {
                totalCashRegisterData[i].assetTotal += inArray[i] * x;
                totalCashRegisterData[i].amountTotal += inArray[i] * (totalCashRegisterData[i].asset * x);
                totalCashRegisterData[i].assetLast = inArray[i] * x;
                totalCashRegisterData[i].amountLast = inArray[i] * totalCashRegisterData[i].asset * x;
            }
        }
        else {
            if (totalCashRegisterData[i].ID === i) {
                totalCashRegisterData[i].assetLast = 0;
                totalCashRegisterData[i].amountLast = 0;
            }
        }
    }
}
