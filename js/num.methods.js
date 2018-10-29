/**
 * Approximates the y function
 * @param nextY The function which provides the next value
 * @param x0 The starting point on the grid
 * @param y0 The value y(x0)
 * @param step The step used in grid
 * @param X The right limit of the grid
 * @returns {{x: *[], y: *[]}} Object containing arrays of x and y, where y[i] is approximation at point x[i]
 */

function findApproximation(nextY, x0, y0, step, X) {
    const
        x = [x0],
        y = [y0];

    for (let i = 0; x[i] < X; i++) {
        x.push(x[i] + step);
        y.push(nextY(x[i], y[i]));
    }

    return {x, y}
}


/**
 * Wrap for Euler Method
 * @param f The function f(x, y) equal to y'(x, y)
 * @param x0 The starting point on the grid
 * @param y0 The value y(x0)
 * @param step The step of the grid
 * @param X The right limit of the grid
 * @returns {{x: *[], y: *[]}}
 */

function computeEuler(f, x0, y0, step, X) {
    const nextY = (x_i, y_i) => y_i + step * f(x_i, y_i);

    return findApproximation(nextY, x0, y0, step, X)
}


/**
 * Wrap for Improved Euler Method
 * @param f
 * @param x0
 * @param y0
 * @param step
 * @param X
 * @returns {{x: *[], y: *[]}}
 */

function computeImprovedEuler(f, x0, y0, step, X) {
    const nextY = (x_i, y_i) => {
        const
            m1 = f(x_i, y_i),
            m2 = f(x_i + step, y_i + step * m1);

        return y_i + step * (m1 + m2) / 2
    };

    return findApproximation(nextY, x0, y0, step, X)
}


/**
 * Wrap for Runge-Kutta Method
 * @param f The function f(x, y) equal to y'(x, y)
 * @param x0 The starting point on the grid
 * @param y0 The value y(x0)
 * @param step The step of the grid
 * @param X The right limit of the grid
 * @returns {{x: *[], y: *[]}}
 */

function computeRungeKutta(f, x0, y0, step, X) {
    const nextY = (x_i, y_i) => {
        const
            k1 = f(x_i, y_i),
            k2 = f(x_i + step / 2, y_i + k1 * step / 2),
            k3 = f(x_i + step / 2, y_i + k2 * step / 2),
            k4 = f(x_i + step, y_i + step * k3);

        return y_i + step / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
    };

    return findApproximation(nextY, x0, y0, step, X)
}


/**
 * Associates the x to the corresponding y using provided function
 * @param f The function to be evaluated on the grid
 * @param x0 The starting point of the grid
 * @param y0 The value f(x0). Unused, default to <code>null</code>.
 * @param step The step of the grid
 * @param X The right limit of the grid
 * @returns {{x: *[], y: *[]}}
 */

function computeExactSolution(f, x0, y0 = null, step, X) {
    const nextY = (x_i) => f(x_i + step);

    return findApproximation(nextY, x0, f(x0), step, X);
}