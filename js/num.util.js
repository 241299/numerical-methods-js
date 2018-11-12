const EPS = 0.05;

/**
 * Builds the intervals excluding discontinuity points
 * @param startPoint The left end of the interval
 * @param endPoint The right end of the interval
 * @param discontinuityPoints The points to exclude
 * @note NB discontinuity can match start or end, check is skipped intentionally
 */

function buildIntervals(startPoint, endPoint, discontinuityPoints) {
    const result = [];
    let currentStart = startPoint;

    if (discontinuityPoints) {

        /* Sorting discontinuity points if they exist */
        let discArr = discontinuityPoints.slice().sort();

        /* Pushing discontinuities if within bounds */
        for (let i = 0; i < discArr.length; i++) {
            if (discArr[i] > startPoint && discArr[i] < endPoint) {
                result.push({
                    start: currentStart,
                    end: discArr[i] - EPS,
                    discontinuity: discArr[i]
                });
                currentStart = discArr[i] + EPS;
            }
        }

    }

    result.push({
        start: currentStart,
        end: endPoint
    });

    return result
}


/**
 * Merges the first X and Y arrays with the second X and Y arrays respectively.
 * All X-Y pairs where at least one element is NaN are discarded
 */

function mergeXYArrays(arrX1, arrX2, arrY1, arrY2) {
    for (let i = 0; i < arrX2.length; i++) {
        if (!isNaN(arrX2[i] + arrY2[i])) {
            arrX1.push(arrX2[i]);
            arrY1.push(arrY2[i]);
        }
    }
}


/**
 * Computes the method at the given intervals
 * @param method
 * @param f {function}     Function to be evaluated
 * @param intervals {[{start: Number, end: Number, discontinuity: Boolean}]} Array of intervals
 * @param exactSolution {function} Function for exact solution. Used to compute initial values at interval starts
 * @param step {Number} The grid step
 * @returns {{x: Number[], y: Number[]}}
 */

function computeMethod(method, f, intervals, exactSolution, step) {
    const methodResults = {x: [], y: []};

    /*
     * Computing function on intervals.
     * At discontinuity point, x_disc is pushed into x array, NULL is pushed into y array
     */

    for (let interval of intervals) {
        const intervalResults = method(
            f,                                                      // Function to be evaluated
            interval.start,                                         // The left end of interval
            exactSolution(interval.start),                          // The value at the left end (initial value)
            step,                                                   // Grid step
            interval.end                                            // The right limit of interval
        );

        /* Merging the results with the previous ones */
        mergeXYArrays(
            methodResults.x, intervalResults.x,
            methodResults.y, intervalResults.y
        );

        /* Pushing discontinuity itself (to be reflected on plot) */
        if (interval.discontinuity) {
            methodResults.x.push(interval.discontinuity);
            methodResults.y.push(null);
        }
    }

    return methodResults
}


/**
 * Computes method error on given arrays
 * @param xArr {Number[]} The x (independent) values
 * @param yExpectedArr {Number[]} The expected y values
 * @param yActualArr {Number[]} The actual (compared) y values
 */

function computeMethodError(xArr, yExpectedArr, yActualArr) {
    const diffArr = [];

    for (let i = 0; i < xArr.length; i++) {
        diffArr.push(yActualArr[i] - yExpectedArr[i])
    }

    return {
        x: xArr,
        y: diffArr
    }
}