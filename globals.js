"use strict";

var input = document.getElementById("input_startValue");
var out = document.getElementById("output");
var radioRandom = document.getElementById("radio_random");
var radioSort = document.getElementById("radio_sorted");
var checkboxes = document.getElementsByName("selectAsset");
var totalAmountCashRegister = 0;
var lastInputAmount = 0;
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
// eventListeners
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        main();
    }
});
// default settings
for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = true;
}
radioRandom.checked = true;

