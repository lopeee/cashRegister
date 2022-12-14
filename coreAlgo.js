"use strict";

var assetDistributionList = [
    Object.freeze({ value: 100.0, distribution: 12.56 }),
    Object.freeze({ value: 50.0, distribution: 47.0 }),
    Object.freeze({ value: 20.0, distribution: 17.66 }),
    Object.freeze({ value: 10.0, distribution: 11.87 }),
    Object.freeze({ value: 5.0, distribution: 9.01 }),
    Object.freeze({ value: 2.0, distribution: 0.097 }),
    Object.freeze({ value: 1.0, distribution: 0.109 }),
    Object.freeze({ value: 0.5, distribution: 0.094 }),
    Object.freeze({ value: 0.2, distribution: 0.179 }),
    Object.freeze({ value: 0.1, distribution: 0.229 }),
    Object.freeze({ value: 0.05, distribution: 0.325 }),
    Object.freeze({ value: 0.02, distribution: 0.418 }),
    Object.freeze({ value: 0.01, distribution: 0.537 }),
];
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////    sorted distribution   ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function sortedDistribution(inVal) {
    /**
     * taking the inVal and cut it into pieces of the assets which are listed in the
     * assetDistributionList array...
     *
     * the selection uses the logic:'from highest to lowest'
     * for example: 250€ -> 2 pieces of asset 100€, 1 piece of asset 50€
     *
     * if not all assets are in use (see checkboxes), the process goes on as far as
     * possible, also from highest available asset to lowest available asset...
     *
     * the results get stored in the assets array, which we return to the calling
     * function...
     *
     * parameters:
     *    inVal            inputValue   string        the value to get separated in different assets
     *
     * variables:
     *    assets           assets       []number      the num of  different assets we calculated for the amount
     *    amo              amount       number        the amount we calculate the assets from
     *    res              result       number        intermediate result
     *
     * return:
     *    assets           assets       []number      see above...
     */
    var assets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var amo = Math.abs(parseFloat(inVal));
    var res = 0;
    // searching for the assets...
    for (var i = 0; i < assetDistributionList.length; i++) {
        if (checkboxes[i].checked) {
            res = Math.abs(amo / assetDistributionList[i].value);
            if (res < 1) {
                assets[i] = 0;
                // positive booking
            }
            else if (res >= 1 && parseFloat(inVal) > 0) {
                assets[i] = Math.floor(res);
                amo =
                    ((res - Math.floor(res)) * assetDistributionList[i].value) %
                    assetDistributionList[i].value;
                if (amo === 0) {
                    break;
                }
                amo = parseFloat(amo.toFixed(2));
            }
            // negative booking
            else if (res >= 1 && parseFloat(inVal) < 0) {
                if (totalCashRegisterData[i].assetTotal - res < 0) {
                    assets[i] = totalCashRegisterData[i].assetTotal;
                    amo = amo - totalCashRegisterData[i].assetTotal * totalCashRegisterData[i].asset;
                }
                else {
                    assets[i] = Math.floor(res);
                    amo =
                        ((res - Math.floor(res)) * assetDistributionList[i].value) %
                        assetDistributionList[i].value;
                }
                if (amo === 0) {
                    break;
                }
                amo = parseFloat(amo.toFixed(2));
            }
        }
    }
    return assets;
}
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////    random distribution    //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
function randDistrib(inVal) {
    /**
     * taking the inVal and cut it into pieces of the assets which are listed in the
     * assetDistributionList array...
     * the results get stored in the assets array, which we return to the calling
     * function...
     *
     * parameters:              meaning               type
     *    inVal                 inputValue            string        the value to get separated in different assets
     *
     * variables:               meaning               type
     *    assets                assets                []array       the num of  different assets we calculated for the amount
     *    amo                   amount                number        the amount we calculate the assets from
     *    smallestCheckedAsset  ...                   number        quit condition of the whileLoop
     *    xArray                ...                   []object      the workArray to manipulate and shuffle our data
     *    randomDistrib         randomDistribution    number        a random generated value we use to find the right probabilityZone
     *    asset                 asset                 number        the asset we selected
     *
     * return:
     *    assets                ...                   []Number      see above...
     */
    var assets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var amo = Math.abs(parseFloat(inVal));
    var smallestCheckedAsset = getSmallestCheckedAsset();
    while (!(amo < smallestCheckedAsset)) {
        var xArray = JSON.parse(JSON.stringify(assetDistributionList));
        var randomDistrib = 0;
        var asset = 0;
        removeAssetWithoutUserConfirmation(xArray);
        chooseLargestIncludedAsset(amo, xArray);
        adaptDistribValues(xArray);
        setProbZones(xArray);
        sortingByDistribValues(xArray);
        // choose a random value between 0 to 100 and get an asset
        randomDistrib = parseFloat((Math.random() * 100).toFixed(2));
        asset = getAsset(randomDistrib, xArray);
        // calculate new amount
        amo -= asset;
        amo = parseFloat(amo.toFixed(2));
        // fill the assetArray
        switch (asset) {
            case 100:
                assets[0] += 1;
                break;
            case 50:
                assets[1] += 1;
                break;
            case 20:
                assets[2] += 1;
                break;
            case 10:
                assets[3] += 1;
                break;
            case 5:
                assets[4] += 1;
                break;
            case 2:
                assets[5] += 1;
                break;
            case 1:
                assets[6] += 1;
                break;
            case 0.5:
                assets[7] += 1;
                break;
            case 0.2:
                assets[8] += 1;
                break;
            case 0.1:
                assets[9] += 1;
                break;
            case 0.05:
                assets[10] += 1;
                break;
            case 0.02:
                assets[11] += 1;
                break;
            case 0.01:
                assets[12] += 1;
                break;
        }
    }
    return assets;
}
function getSmallestCheckedAsset() {
    var val = checkboxes[0].value;
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            if (checkboxes[i].value < val) {
                val = checkboxes[i].value;
            }
        }
    }
    return val;
}
function removeAssetWithoutUserConfirmation(inArray) {
    /**
     * removing all assets which are not confirmed by user (checkboxes not checked)
     *
     */
    for (var i = 0; i < assetDistributionList.length; i++) {
        if (!checkboxes[i].checked) {
            for (var ii = 0; ii < inArray.length; ii++) {
                if (inArray[ii].value == assetDistributionList[i].value) {
                    inArray.splice(ii, 1);
                }
            }
        }
    }
}
function chooseLargestIncludedAsset(inVal, inArray) {
    /**
     * get asset with highest value inside the amount
     * e.g. 52€ => 50€ == largest asset
     *
     * removing all assets which are not inside the usergiven amount
     */
    for (var i = 0; i < assetDistributionList.length; i++) {
        for (var ii = 0; ii < inArray.length; ii++) {
            if (inArray[ii].value > inVal) {
                inArray.splice(0, 1);
            }
        }
    }
}
function adaptDistribValues(inArray) {
    /**
     * distributionValues need to get adapted, cause of a new overall distribution
     * distributionValues get added all together and are the base for new overall distribution
     */
    var x = 0;
    for (var i = 0; i < inArray.length; i++) {
        x += inArray[i].distribution;
    }
    x = parseFloat(x.toFixed(2));
    // calculate new distributions for the new overall distribution
    for (var i = 0; i < inArray.length; i++) {
        inArray[i].distribution = (inArray[i].distribution * 100) / x;
        inArray[i].distribution = parseFloat(inArray[i].distribution.toFixed(2));
    }
}
function setProbZones(inArray) {
    /**
     * calculate new values for all distributions, so we get zones of probabilities
     * last index set to 100, cause last value is the sum of all values (there are always some rounding differences,
     * which causing sometimes an error when calling function 'getAsset' and there is only an index 0...)
     */
    for (var i = 1; i < inArray.length; i++) {
        inArray[i].distribution += inArray[i - 1].distribution;
        inArray[i].distribution = parseFloat(inArray[i].distribution.toFixed(2));
    }
    inArray[inArray.length - 1].distribution = 100.0;
}
function sortingByDistribValues(inArray) {
    /**
     * sorting array ascending by using distributionValues
     *
     * the sorting is needed to find the right zone of probability, where our random selection
     * of distribution lies
     */
    for (var ii = 1; ii < inArray.length; ii++) {
        for (var i = ii; i > 0; i--) {
            var plcehldr = void 0;
            if (inArray[i].distribution < inArray[i - 1].distribution) {
                plcehldr = inArray[i];
                inArray[i] = inArray[i - 1];
                inArray[i - 1] = plcehldr;
            }
        }
    }
}
function getAsset(inVal, inArray) {
    /**
     * get the asset which belongs to the random distribution
     *
     * going thru array form highest distribution value to lowest
     * the first value inside array, which is below our random distribution value stands for our asset
     * our random distribution lies in the probabilty zone...
     *
     */
    var asset = 0;
    for (var i = inArray.length - 1; i >= 0; i--) {
        if (inVal > inArray[i].distribution) {
            asset = inArray[i + 1].value;
            break;
        }
        else if (inVal < inArray[0].distribution) {
            asset = inArray[0].value;
            break;
        }
        else if (inVal === inArray[i].distribution) {
            asset = inArray[i].value;
            break;
        }
    }
    return asset;
}
