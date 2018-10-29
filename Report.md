# Programming Assignment Report
**Project**: Numerical Methods for solving differential equations\
**Student**: Marsel Shayhin\
**Group**: B17–02

## Overview
1. Problem statement
2. Exact solution of the problem and approximations
3. The structure of the program
4. Screenshots
4. Method descriptions
5. Method errors

## Problem Statement
The **Initial Value Problem** is the following:
> y' = f(x, y),\
> y(x<sub>0</sub>) = y<sub>0</sub>,\
> x ∈ \[x<sub>0</sub>, X\],

where _f(x, y) = y<sup>2</sup>e<sup>x</sup> − 2y_.\
Default values are:
_x<sub>0</sub> = 1, y<sub>0</sub> = 1, X = 10_.

## Problem Soloutions
### Exact solution
The general solution of the problem is _y(x) = e<sup>-x</sup> / (c<sub>1</sub>·e<sup>x</sup> + 1)_

The solution of the IVP is _e<sup>2 − x</sup> / (e<sup>x</sup> − e<sup>x + 1</sup> + e<sup>2</sup>)_

### Approximations
The program uses three methods of approximations:
- Euler method
- Improved Euler Method
- Runge-Kutta Method

## Program Structure
The program is structured as 3 modules:
1. Numerical Methods (`js/num.methods.js`). It is the computational core of the program
2. Web View (`.pug`, `.html`, `.css` files and `js/front.js`). The View part implemented as the combination of HTML and JavaScript
3. Main (`main.js`) — the controller. Serves as the bridge between GUI and logic.

### Program Executable
To start up the program, simply open `index.html` in your browser.

### Deprecated browsers warning
It is strongly recommended **NOT** to use old browser versions such as IE9.
Author does not guarantee correct code execution on such systems.

## Screenshots
![alt text](./img/Num%20Methods%201.png)

![alt text](./img/Num%20Methods%202.png)