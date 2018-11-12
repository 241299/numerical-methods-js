**WARNING!** This file is not displayed correctly on GitHub. 
Please view the [Web Version](https://www.evernote.com/l/AfL6zo_mXXhBiYHfXXKKpMZAgFMNcpv3_3I/) 


# Programming Assignment Report
**Project**:    Numerical Methods for solving differential equations\
**Student**: Marsel Shayhin\
**Group**: B17–02

## Table of contents
[TOC]

## Problem Statement
The **Initial Value Problem** is the following:
$$ \begin{cases} y' = f(x, y) \\ y(x_0) = y_0 \\ x \in [x_0, X], && where&f(x, y) = y^2 e^x - 2y \end{cases} $$

Default values are:
$$ \begin{cases} x_0 = 1, \\ y_0 = 1, \\ X = 10. \end{cases} $$


## Problem Solutions
### Exact solution
The general solution of the problem is $ y(x) = \dfrac{e^{-x}}{c_1e^x + 1} $

### Computing IVP solution
In order to compute the exact solution of the Initial Value Problem, we substitute $y_0$ and $x_0$ in the above expression,
getting the following expression for $c1$:
$$ c_1 = -e^{-x_0} + \dfrac{e^{-2x_0}}{y_0}$$

Instantiating $c_1$ with $x_0 = 1, y_0=1 $, we get $ y_{exact}(x) = \dfrac{e^{2-x}}{e^x - e^{x+1} + e^2} $

### Approximation using Numerical Methods
The program uses three methods of approximations:
- Euler method
- Improved Euler Method
- Runge-Kutta Method

#### Note
Since the exact solution has the discontinuity point at $x_{disc} = ln\dfrac{-1}{c_1}$, the approximation has to include two parts:
- before the discontinuity point,
- after the discontinuity point.

The values to start computation are $x_0, y_0$ and $x_{disc}, y_{exact}(x_{disc})$ respectively.

## Program Structure
The program is structured as 4 modules:
1. Numerical Methods (`js/num.methods.js`). It is the computational core of the program
2. Numerical Utilities (`js/num.util.js`). This is the helper script for delegating the work from controller.
3. Web View (`.pug`, `.html`, `.css` files and `js/front.js`). The View part implemented as the combination of HTML and JavaScript
4. Main (`main.js`) — the controller. Serves as the bridge between GUI and logic.

### Program Executable
To start up the program, simply open `index.html` in your browser.

### Deprecated browsers warning
It is strongly recommended **NOT** to use old browser versions such as IE9.
Author does not guarantee correct code execution on such systems.

## Method descriptions
For full method descriptions, please check the [code documentation](https://github.com/241299/numerical-methods-js) 


## Computation errors

Errors differ depending on the method and the step size. Below are some method errors for various step sizes.

##### 200 steps
![Error for 200 steps](./err_1.png)

##### 335 steps
![Error for 335 steps](./err_2.png)

##### 500 steps
![Error for 500 steps](./err_3.png)


## Screenshots
![Top View](./1542025598831.png)
![Chart customisation](./1542025672219.png)