README

Team Airo - Ky-O-Mi

Welcome to our final deliverables folder.

We have both circuitpython code and p5 js code.

CIRCUIT PYTHON:
- Content:
We have run the circuitpython code on an itsybitsy expander M4.
All the contents of the circuitpython folder should be moved to the itsybitsy board.

- Setup:
The extra hardware components we attached are 12 -key capacitive touch sensor and a neopixel ledstring.
We have also supplied a folder with all the necessary libraries to run the code and use the components.
Make sure to power the itsybitsy (we have done it by connection it to our laptop).
Then, We have used an uart cable and a cp2104 that does the communcation between the itysbitsy and the laptop. Make use of the RX, TX and GRN pins when connection. The RX of the itsybitsy should be connected to TX of the cp2104, and the TX of the itsybitsy to the RX of the cp2104.


P5.js:
- Content:
We have used this page https://github.com/p5-serial/p5.serialport as a tutorial/template and expanded from there ourselves.
We added a p5js folder that contains all the needed code, documents and images.
The current folder allows for three subjects to be shown: Transportation, Pandemics, Cooking.
Make sure the folders of the resources are in your workspace/project.

- Setup:
If using VSC, you can open the folder as a project. Make sure you have a server running.
There exists a VSC extension for an easy set up. For more information:https://github.com/processing/p5.js/wiki/Local-server.
It is possible to add resources about a new subject with writing minimal code.

- Add subject resource:
Make sure that the recourseImages, resourceQRCodes, resourceYears and resourceQuestions are formatted in one folder, similar to the other folder.
Add a newline in the metadata.txt file, so we know how to extract the data of the subject folder.
Then add a few code lines in the "keyTyped()" function, where you mention which resourceFolder,
distinguished by their folder number, should be used.

Connection:
We use the p5.js serial communcation to communicate over the uart wire:
- https://itp.nyu.edu/physcomp/labs/labs-serial-communication/lab-serial-input-to-the-p5-js-ide/
- https://medium.com/@yyyyyyyuan/tutorial-serial-communication-with-arduino-and-p5-js-cd39b3ac10ce
