const
    plotData = [],
    methods = {
        'Euler': computeEuler,
        'ImEuler': computeImprovedEuler,
        'Runge': computeRungeKutta,
        'Exact': computeExactSolution
    };


$(document).ready(function () {
    initDefaults();

    refreshPlot($('#plot-0')[0], plotData[0]);

    bindSlider($('.slider'));

    for (let method in methods) {
        setColorPicker(`customise${method}ColorBtn`);
    }

    bindModalApply($('#customiseModalApplyBtn'), function (modal) {
        modal.modal('hide');

        const id = modal.data('id');
        collectUserInput(id, modal);
        refreshPlot($(`#plot-${id}`)[0], plotData[id]);
    });

    enableTooltips();
});


function initDefaults() {
    plotData.push({
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
}


/**
 * Gathers all the user data into the object
 * @param graphCardId The identification number of the plot (e.g. 0 is the first displayed plot)
 * @param modal The jQuery modal object
 * @param changes
 */

function collectUserInput(graphCardId, modal, changes) {
    if (changes) {
        const p = plotData[graphCardId];
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

    console.log(userData);

    // Adding methods
    for (let method in methods) {
        if (userData.hasOwnProperty(method)) {
            plotData[graphCardId][method] = {
                color: modal.find(`#customise${method}ColorBtn`).css('background-color')
            };
        } else {
            delete plotData[graphCardId][method];
        }
    }

    if (userData.x0) plotData[graphCardId].x0 = userData.x0.value;
    if (userData.y0) plotData[graphCardId].y0 = userData.y0.value;
    if (userData.X) plotData[graphCardId].X = userData.X.value;

    console.log(plotData[graphCardId]);


    /*
        Getting methods and their colors
     */

    // let data = {
    //     x0: 0,
    //     y0: 0,
    //     X: 0,
    //     steps: 1,
    //     EULER: {
    //         color: '#faf'
    //     },
    //     EULER_IMPROVED: {},
    //     RUNGE_KUTTA: {},
    //     EXACT: {}
    // }

    // plots[graphCardId];
}


/**
 * Computes the plots and triggers GUI refresh
 */

function refreshPlot(plot, dataIn) {
    const plotData = {};

    for (let method in methods)
        if (dataIn.hasOwnProperty(method)) {
            plotData[method] = methods[method](
                (method === 'Exact') ? dataIn.exact : dataIn.f,
                dataIn.x0,
                dataIn.y0,
                (dataIn.X - dataIn.x0) / dataIn.steps,
                dataIn.X
            );
            plotData[method].color = dataIn[method].color;
        }

    drawPlot(plot, plotData);
}