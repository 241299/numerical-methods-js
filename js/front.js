const
    CUSTOMISE_MODAL = $('#customiseModal');


/**
 * Gets the id of the graph bound to the element
 * @param element Control element: a button, a slider, or whatever. jQuery node object
 */

function getGraphId(element) {
    return element.parents('.graph-card').first().data('id')
}


/**
 * Draws a plot using Plot.ly
 * @param where DOM node where to draw the plot
 * @param data {{Exact:{x: [], y: [], color: string}, Euler:{}, ImEuler:{}, Runge:{}}} The plotting data: method, x, y, color
 */

function drawPlot(where, data) {
    const addTrace = (arr, tr) => arr.push({
        name: tr.name,
        type: 'scatter',
        mode: 'lines',
        line: {
            shape: 'spline',
            color: tr.color,
            width: 1
        },
        x: tr.x,
        y: tr.y,
    });

    // Adding traces (independently from logic)
    const traces = [];
    for (let i in data)
        if (data.hasOwnProperty(i))
            addTrace(traces, {
                name: i,
                color: data[i].color,
                x: data[i].x,
                y: data[i].y
            });

    // Defining layout
    const layout = {
        font: {size: 18}
    };

    Plotly.react(where, traces, layout);
}


/**
 * Function for creating a slider out of a text field and binding it to refresh the corresponding plot
 * @param element
 */

function bindSlider(element) {
    element.slider();

    /* Introducing constants to capture them and avoid recalculations */
    const
        id = getGraphId(element),
        textLabel = element.parent().children('.grid-steps');


    element.on('change', function (slideEvt) {
        textLabel.text(slideEvt.value.newValue);

        collectUserInput(id, null, {steps: slideEvt.value.newValue});

        refreshPlot($('#plot-' + id)[0], PLOTS[id]);
    });
}


function bindCustomiseBtn(btn) {
    btn.on('click', function () {
        CUSTOMISE_MODAL.modal('show');

        const id = getGraphId($(this));
        CUSTOMISE_MODAL.data('id', id);

        // TODO Modify the modal to show the current state
    });
}


const colorPickerTimeOuts = {};


function setColorPicker(elementId) {
    const element = $('#' + elementId);

    element.colorpicker()
        .on('changeColor', function (e) {
            clearTimeout(colorPickerTimeOuts[elementId]);

            function changeColor() {
                element.css({
                    'background-color': e.color.toHex(),
                    'border-color': e.color.toHex()
                });
            }

            colorPickerTimeOuts[elementId] = setTimeout(changeColor, 250);
        });
}


/**
 * Binds the events triggered when 'Apply' button in modal is pressed. NB: the modal is closed
 * @param applyBtn The jQuery button object
 * @param callback The function to be executed
 */

function bindModalApply(applyBtn, callback) {
    applyBtn.on('click', () => callback(CUSTOMISE_MODAL));
}


/**
 * Enables Bootstrap tooltips
 */

function enableTooltips() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
}