/**
 * Draws a plot using the
 * @param where Where to draw the plot
 * @param data {{Exact:{}, Euler:{}, ImEuler:{}, Runge:{}}} The plotting data: method, x, y, color
 */

function drawPlot(where, data) {
    const addTrace = (arr, tr) => arr.push({
        name: tr.name,
        type: 'scatter',
        line: {
            shape: 'spline',
            color: tr.color,
            width: 1
        },
        marker: {
            color: tr.color,
            line: {
                width: 2.5
            }
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

    Plotly.react(where, traces, layout, {responsive: true});
}


/**
 * Function for creating a slider out of a text field
 * @param element
 */

function bindSlider(element) {
    element.slider();
    element.on('change', function (slideEvt) {
        element.parent().children('.grid-steps').text(slideEvt.value.newValue);

        collectUserInput(0, null, {steps: slideEvt.value.newValue});

        refreshPlot($('#plot-0')[0], plotData[0]); // FIXME
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
    applyBtn.on('click', () => callback(applyBtn.parents('.modal').first()));
}


/**
 * Enables Bootstrap tooltips
 */

function enableTooltips() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
}