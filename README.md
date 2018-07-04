PigeonJS
========
PigeonJS is a tool for demonstration of the path-extraction process shown in the paper "A General Path-Based Representation for Predicting Program Properties" (PLDI'2018):
http://urialon.cswp.cs.technion.ac.il/wp-content/uploads/sites/83/2018/06/pldi18.pdf

PigeonJS is based on [UnuglifyJS](https://github.com/eth-srl/UnuglifyJS).

Requirements
------------
* node.js (http://nodejs.org/)
* NPM (https://www.npmjs.com/)

They can be installed using:
> sudo apt-get install nodejs npm

Setup
-----
> git clone https://github.com/urialon/PigeonJS
> sudo npm install

Path-Extraction
---------------
> bin/unuglifyjs uri.js --nice_formatting --extract_features --no_hash --max_path_length=<max_length> --max_path_width=<max_width> 

This will extract paths between variables and the rest of the elements, in the file uri.js .
Possible flags:
* removing --no_hash - will hash each path for lower memory consumption
* --semi_paths - will extract paths from variables to their ancestor non-leaves nodes
* --include_giv_giv - include paths between AST terminals which are not variables, such as constants.

> python extract_features.py --dir <training_dir> --max_path_length <max_length> --max_path_width <max_width> > training 2> out.err

This command runs the nodeJS scripts using multiple processes (much faster for large datasets, when running on a machine with many cores).

#### Nice2Predict

To install Nice2Predict framework please follow the instructions on the https://github.com/eth-srl/Nice2Predict page.

