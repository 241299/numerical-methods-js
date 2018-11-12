const
    PLOTS = [],
    PLOT_TYPES = {
        SOLUTIONS_ERRORS: 1,
        GLOBAL_ERRORS: 2
    },
    METHODS = {
        'Exact': computeExactSolution,
        'Euler': computeEuler,
        'ImEuler': computeImprovedEuler,
        'Runge': computeRungeKutta
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

        // NB Plots for solutions and global errors are unlinked (because of initial design).
    });

    enableTooltips();
});


function initDefaults() {
    PLOTS.push({
        /* Metadata */
        name: 'Variant 21',
        plotType: PLOT_TYPES.SOLUTIONS_ERRORS,

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
            displayPlot: true,
            color: '#1da2ff'
        },
        Euler: {
            displayPlot: true,
            color: '#f6912d'
        },
        ImEuler: {
            displayPlot: false
        },
        Runge: {
            displayPlot: false
        }
    });
    PLOTS.push({
        plotType: PLOT_TYPES.GLOBAL_ERRORS,
        linkTo: PLOTS[0]
    });
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


    /* Adding or removing methods and respective errors to show */
    for (let method in METHODS) {
        const methodPlot = PLOTS[graphCardId][method];
        methodPlot.color = modal.find(`#customise${method}ColorBtn`).css('background-color');

        methodPlot.displayPlot = userData.hasOwnProperty(method);
        methodPlot.displayErrorPlot = userData.hasOwnProperty(method + 'Err');
    }

    /* Initial conditions and limit */

    if (userData.x0) PLOTS[graphCardId].x0 = userData.x0.value;
    if (userData.y0) PLOTS[graphCardId].y0 = userData.y0.value;
    if (userData.X) PLOTS[graphCardId].X = userData.X.value;
}


/**
 * Computes the plots and triggers GUI refresh. Part of the controller layer.
 * @param where The DOM node where to draw the plot
 * @param plotData An object containing all of the following: plot metadata, IVP statement and exact solution function
 */

function refreshPlot(where, plotData) {
    switch (plotData.plotType) {
        case PLOT_TYPES.SOLUTIONS_ERRORS:
            refreshSolutionsPlot(where, plotData);
            break;
        case PLOT_TYPES.GLOBAL_ERRORS:
            refreshGlobalErrorsPlot(
                where,
                plotData.linkTo || plotData
            );
            break;
    }
}


function refreshSolutionsPlot(where, dataIn) {
    const
        plottingData = {
            xTitle: 'x Axis',
            yTitle: 'y Axis'
        },
        x0 = dataIn.x0,
        y0 = dataIn.y0,
        X = dataIn.X,
        step = (X - x0) / (dataIn.steps > 0 ? dataIn.steps : 1),

        intervals = buildIntervals(
            x0, X,
            dataIn.discPoints ? dataIn.discPoints(x0, y0) : undefined
        );

    /* Computing */
    const methodsResults = {};

    console.log(dataIn);

    for (let method in METHODS) {
        if (method === 'Exact') {
            methodsResults[method] = computeMethod(
                METHODS.Exact,
                dataIn.exactSolution(x0, y0),
                intervals,
                dataIn.exactSolution(x0, y0),
                step
            );
        } else if (dataIn[method].displayPlot || dataIn[method].displayErrorPlot) {
            methodsResults[method] = computeMethod(
                METHODS[method],
                dataIn.f,
                intervals,
                dataIn.exactSolution(x0, y0),
                step
            );

            // NB Possible bug: exact solution have not been computed yet. Not caused because Exact is the first
            if (dataIn[method].displayErrorPlot) {
                methodsResults[method + 'Err'] = computeMethodError(
                    methodsResults.Exact.x,
                    methodsResults.Exact.y,
                    methodsResults[method].y
                );
            }
        }
    }

    /* Adding to plot */
    for (let method in METHODS) {
        if (dataIn[method].displayPlot) {
            plottingData[method] = methodsResults[method];
            plottingData[method].color = dataIn[method].color;
        }

        if (dataIn[method].displayErrorPlot) {
            plottingData[method + 'Err'] = methodsResults[method + 'Err'];
            console.log(plottingData);
            plottingData[method + 'Err'].color = dataIn[method].color;
        }
    }

    drawPlot(where, plottingData);
}


function refreshGlobalErrorsPlot(plot, dataIn) {

    console.log(dataIn);
}