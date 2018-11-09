const EPS = 0.05;

/**
 * Builds the intervals excluding discontinuity points
 * @param startPoint The left end of the interval
 * @param endPoint The right end of the interval
 * @param discontinuityPoints The points to exclude
 * @note FIXME discontinuity can match start or end, check is skipped intentionally
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