var Quartile = function Quartile(data_set) {
    /*
     * This sorts the given array from least to greatest
     */
    function sortAscending(data_set) {
        var result = data_set.sort((a, b) => {
            if (a > b) return 1;
            if (a < b) return -1;
            else return 0;
        });
        return result;
    }
    this.data_set = sortAscending(data_set);
//    console.log(this.data_set);
}

/************************************************************
* name: getQuartile
* desc: This returns the specified quartile from the data set.
* inputs: 
*       quartile: number quartile
* outputs: newQuartile
************************************************************/
Quartile.prototype.getQuartile = function (quartile) {
    
    var median = this.getMedian(this.data_set);
    
    if (quartile == 2) return median;
    
    var newArray = [];
    
    for (var i in this.data_set) {
        if (quartile == 1) {
            if (this.data_set[i] < median) newArray.push(this.data_set[i]);
            else break;
        }
        else {
            if (this.data_set[i] > median) newArray.push(this.data_set[i]);
        }
    }
    var newQuartile = (this.getMedian(newArray));
    return newQuartile;
}

/************************************************************
* name: getFirstQuartile
* desc: This returns the first quartile.
* inputs: none
* outputs: quartile
************************************************************/
Quartile.prototype.getFirstQuartile = function () {
    return this.getQuartile(1)
}

/************************************************************
* name: getThirdQuartile
* desc: This returns the third quartile.
* inputs: none
* outputs: quartile
************************************************************/
Quartile.prototype.getThirdQuartile = function () {
        return this.getQuartile(3)
}


/************************************************************
* name: getIQR
* desc: Returns the  Inner Quartile Range of the set.
* inputs: none
* outputs: quartile
************************************************************/
Quartile.prototype.getIQR = function () {
    return this.getQuartile(3) - this.getQuartile(1);
}

/************************************************************
* name: isOutlier
* desc: Determines if a number is an outlier in the set.
* inputs: 
*       n: number to determine
* outputs: boolean value
************************************************************/
Quartile.prototype.isOutlier = function (n) {
    var IQR = this.getIQR();
    return (n < this.getQuartile(1) - 1.5 * IQR || n > this.getQuartile(3) + 1.5 * IQR);
}

/************************************************************
* name: getMedian
* desc: 
* inputs: 
*       data_set: ??
* outputs: median
************************************************************/
Quartile.prototype.getMedian = function (data_set) {
        if (!data_set) data_set = this.data_set;
        if (!this.data_set) console.log("We are screwed!", this.data_set, data_set);
        var length = data_set.length;
        var median = (length % 2 == 0) ? (data_set[length / 2] + data_set[(length / 2) - 1]) / 2 : data_set[Math.ceil(length / 2) - 1];
        return median;
}
    // Quartile Test Run
    /*
        var quart = new Quartile([3, 7, 8, 5, 12, 14, 21, 13, 18]);
        console.log(quart.getThirdQuartile());
    */
