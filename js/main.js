const
    PLOTS = [],
    PLOT_TYPES = {
        SOLUTIONS: 1,
        LOCAL_ERRORS: 2,
        SOLUTIONS_ERRORS: 3,
        GLOBAL_ERRORS: 4
    },
    METHODS = {
        'Euler': computeEuler,
        'ImEuler': computeImprovedEuler,
        'Runge': computeRungeKutta,
        'Exact': computeExactSolution
    };


$(document).ready(function () {
    initDefaults();

    refreshPlot($('.graph-card[data-id="0"] .plot')[0], PLOTS[0]);

    bindSlider($('.slider'));
    bindCustomiseBtn($('.customise-btn'));

    for (let method in METHODS) {
        setColorPicker(`customise${method}ColorBtn`);
    }

    bindModalApply($('#customiseModalApplyBtn'), function (modal) {
        modal.modal('hide');

        const id = modal.data('id');
        collectUserInput(id, modal);
        refreshPlot($(`#plot-${id}`)[0], PLOTS[id]);
    });

    enableTooltips();
});


function initDefaults() {
    PLOTS.push({
        /* Metadata */
        name: 'Variant 21',
        plotType: PLOT_TYPES.SOLUTIONS,

        /* Function and exact solution */
        f: (x, y) => (y ** 2) * Math.exp(x) - 2 * y,

        exactSolution: (x0, y0) => {
            const c = -Math.exp(-x0) + Math.exp(-2 * x0) / y0;
            return (x) => Math.exp(-x) / (c * Math.exp(x) + 1)
        },

        discPoints: (x0, y0) => {
            const c = -Math.exp(-x0) + Math.exp(-2 * x0) / y0;
            return [Math.log(-1 / c)]
        },

        /* Problem statement */
        x0: 1,
        y0: 1,
        X: 10,
        steps: 200,

        /* Plotting data */
        Exact: {
            color: '#1da2ff'
        },
        Euler: {
            color: '#f6912d'
        }
    });

    /* Variant 2 solved. Uncomment to use it instead */
    // PLOTS.push({
    //     /* Metadata */
    //     name: 'Variant 2',
    //     plotType: PLOT_TYPES.SOLUTIONS,
    //
    //     /* Function and exact solution */
    //     f: (x, y) => -2 * y + 4 * x,
    //
    //     exactSolution: (x0, y0) => {
    //         const c = (y0 - 2*x0 + 1) / Math.exp(-2 * x0);
    //         return (x) => c * Math.exp(-2 * x) + 2 * x - 1
    //     },
    //
    //     discPoints: () => [],
    //
    //     /* Problem statement */
    //     x0: 0,
    //     y0: 0,
    //     X: 3,
    //     steps: 3,
    //
    //     /* Plotting data */
    //     Exact: {
    //         color: '#1da2ff'
    //     },
    //     Euler: {
    //         color: '#f6912d'
    //     }
    // });
}


/**
 * Gathers all the user data into the object
 * @param graphCardId The identification number of the plot (e.g. 0 is the first displayed plot)
 * @param modal The jQuery modal object
 * @param changes
 */

function collectUserInput(graphCardId, modal, changes) {

    /* Reacting to changes instead of collecting user data */
    if (changes) {
        const p = PLOTS[graphCardId];
        for (let i in changes) {
            if (changes.hasOwnProperty(i) && p.hasOwnProperty(i)) {
                p[i] = changes[i];
            }
        }
        return
    }

    /*
    * Serializing user input.
    * Dirty input will be excluded
    */

    const userData = modal.find('form')
        .serializeArray()
        .reduce(function (obj, item) {
            let value = item.value;
            if (value !== '') {
                value = !isNaN(parseFloat(value)) && isFinite(value) ? parseFloat(value) : value;
                obj[item.name] = {value};
            }
            return obj;
        }, {});

    /* Adding or removing methods to show */
    for (let method in METHODS) {
        if (userData.hasOwnProperty(method)) {
            PLOTS[graphCardId][method] = {
                color: modal.find(`#customise${method}ColorBtn`).css('background-color')
            };
        } else {
            delete PLOTS[graphCardId][method];
        }
    }

    /* Initial conditions and limit */

    if (userData.x0) PLOTS[graphCardId].x0 = userData.x0.value;
    if (userData.y0) PLOTS[graphCardId].y0 = userData.y0.value;
    if (userData.X) PLOTS[graphCardId].X = userData.X.value;
}


/**
 * Computes the plots and triggers GUI refresh. Part of the controller layer.
 * @param plot The DOM node where to draw the plot
 * @param dataIn An object containing all of the following: plot metadata, IVP statement and exact solution function
 */

function refreshPlot(plot, dataIn) {
    const
        plottingData = {},
        x0 = dataIn.x0,
        y0 = dataIn.y0,
        X = dataIn.X,
        step = (X - x0) / (dataIn.steps > 0 ? dataIn.steps : 1),

        intervals = buildIntervals(
            x0, X,
            dataIn.discPoints ? dataIn.discPoints(x0, y0) : undefined
        );

    for (let method in METHODS)
        if (dataIn.hasOwnProperty(method)) {

            const methodResults = plottingData[method] = {x: [], y: []};

            /*
             * Computing function on intervals.
             * At discontinuity point, x_disc is pushed into x array, NULL is pushed into y array
             */

            for (let interval of intervals) {
                const intervalResults = METHODS[method](
                    (method === 'Exact')                                    // Function to be evaluated
                        ? dataIn.exactSolution(x0, y0)                          // either the exact solution
                        : dataIn.f,                                             // or the method approximation
                    interval.start,                                         // The left end of interval
                    dataIn.exactSolution(x0, y0)(interval.start),           // The value at the left end (initial value)
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

            plottingData[method].color = dataIn[method].color;
        }

    // TODO check dataIn.plotType

    drawPlot(plot, plottingData);
}