const
    PLOTS = [],
    METHODS = {
        'Euler': computeEuler,
        'ImEuler': computeImprovedEuler,
        'Runge': computeRungeKutta,
        'Exact': computeExactSolution
    };


$(document).ready(function () {
    initDefaults();

    refreshPlot($('#plot-0')[0], PLOTS[0]);

    bindSlider($('.slider'));

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
        name: 'Variant 21',
        f: (x, y) => (y ** 2) * Math.exp(x) - 2 * y,

        exactSolution: (x0, y0) => {
            const c = -Math.exp(-x0) + Math.exp(-2 * x0) / y0;
            return (x) => Math.exp(-x) / (c * Math.exp(x) + 1)
        },

        discPoints: (x0, y0) => {
            const c = -Math.exp(-x0) + Math.exp(-2 * x0) / y0;
            return [Math.log(-1 / c)]
        },

        x0: 1,
        y0: 1,
        X: 10,
        steps: 3,
        Exact: {
            color: '#1da2ff'
        },
        Euler: {
            color: '#f6912d'
        }
    });
}


/**
 * Gathers all the user data into the object
 * @param graphCardId The identification number of the plot (e.g. 0 is the first displayed plot)
 * @param modal The jQuery modal object
 * @param changes
 */

function collectUserInput(graphCardId, modal, changes) {
    if (changes) {
        const p = PLOTS[graphCardId];
        for (let i in changes) {
            if (changes.hasOwnProperty(i) && p.hasOwnProperty(i)) {
                p[i] = changes[i];
            }
        }
        return
    }

    const a = ({
        name: 'Variant 21',
        f: (x, y) => (y ** 2) * Math.exp(x) - 2 * y,
        exact: (x) => Math.exp(2 - x) / (Math.exp(x) - Math.exp(x + 1) + Math.exp(2)),
        x0: 1,
        y0: 1,
        X: 10,
        steps: 3,
        Exact: {
            color: '#1da2ff'
        },
        Euler: {
            color: '#f6912d'
        }
    });

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

    // Adding methods
    for (let method in METHODS) {
        if (userData.hasOwnProperty(method)) {
            PLOTS[graphCardId][method] = {
                color: modal.find(`#customise${method}ColorBtn`).css('background-color')
            };
        } else {
            delete PLOTS[graphCardId][method];
        }
    }

    if (userData.x0) PLOTS[graphCardId].x0 = userData.x0.value;
    if (userData.y0) PLOTS[graphCardId].y0 = userData.y0.value;
    if (userData.X) PLOTS[graphCardId].X = userData.X.value;
}


/**
 * Computes the plots and triggers GUI refresh
 */

// TODO Handle discontinuity

function refreshPlot(plot, dataIn) {
    const plottingData = {};

    for (let method in METHODS)
        if (dataIn.hasOwnProperty(method)) {

            const
                x0 = dataIn.x0,
                y0 = dataIn.y0,
                X = dataIn.X,
                step = (X - x0) / (dataIn.steps > 0 ? dataIn.steps : 1),
                func = (method === 'Exact') ? dataIn.exactSolution(x0, y0) : dataIn.f;

            plottingData[method] = METHODS[method](
                func,
                x0,
                y0,
                step,
                X
            );
            plottingData[method].color = dataIn[method].color;
        }

    drawPlot(plot, plottingData);
}