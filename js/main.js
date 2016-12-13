// Amount of start points for each person
var startPoints = 40;
// Points for consuming the needed good
var consumeBonus = 20;
// Amount of Persons in the simulation
var n = 24;
// Amount of runs for the simulation
var rounds = 10;

/**
 * Storage costs for the different types of goods
 * @type {number}
 */
storageCosts[typeA] = 1;
storageCosts[typeB] = 4;
storageCosts[typeC] = 9;

/**
 * Probabilities of accepting a trade for person type 1 for the different goods
 * @type {number}
 */
propTypeAccepts[pTypeA + typeA] = 1.0;
propTypeAccepts[pTypeA + typeB] = 1.0;
propTypeAccepts[pTypeA + typeC] = 0.0;

/**
 * Probabilities of accepting a trade for person type 2 for the different goods
 * @type {number}
 */
propTypeAccepts[pTypeB + typeA] = 1.0;
propTypeAccepts[pTypeB + typeB] = 1.0;
propTypeAccepts[pTypeB + typeC] = 0.0;

/**
 * Probabilities of accepting a trade for person type 3 for the different goods
 * @type {number}
 */
propTypeAccepts[pTypeC + typeA] = 1.0;
propTypeAccepts[pTypeC + typeB] = 0.0;
propTypeAccepts[pTypeC + typeC] = 1.0;

/**
 * Probability of concession for all 3 types of persons
 * @type {number}
 */
propTypeNice[pTypeA] = 0.0;
propTypeNice[pTypeB] = 0.0;
propTypeNice[pTypeC] = 0.0;

// log each round
var verbose = true;

/**
 *  Resets the input fields to the initial state
 */
function resetInputFields(){
    var e;
    e = document.getElementById('storageAtxt');
    e.value = 1;
    e = document.getElementById('storageBtxt');
    e.value = 4;
    e = document.getElementById('storageCtxt');
    e.value = 9;
    e = document.getElementById('startPointsTxt');
    e.value = 40;
    e = document.getElementById('consumeBonusTxt');
    e.value = 20;
    e = document.getElementById('probType1acceptsA');
    e.value = 1;
    e = document.getElementById('probType1acceptsB');
    e.value = 0;
    e = document.getElementById('probType1acceptsC');
    e.value = 0;
    e = document.getElementById('probType2acceptsA');
    e.value = 1;
    e = document.getElementById('probType2acceptsB');
    e.value = 1;
    e = document.getElementById('probType2acceptsC');
    e.value = 0;
    e = document.getElementById('probType3acceptsA');
    e.value = 1;
    e = document.getElementById('probType3acceptsB');
    e.value = 0;
    e = document.getElementById('probType3acceptsC');
    e.value = 1;
    e = document.getElementById('propTyp1nice');
    e.value = 0;
    e = document.getElementById('propTyp2nice');
    e.value = 0;
    e = document.getElementById('propTyp3nice');
    e.value = 0;
};

/**
 *  Resets the input fields and sets the settings for the corresponding
 *  trading strategy
 */
function presetsSelectorChanged(){
    resetInputFields();
    var e;
    switch(document.getElementById('presetsSelector').value){
        case 'strict':
            break;
        case 'stubborn':
            e = document.getElementById('probType1acceptsB');
            e.value = 0;
            e = document.getElementById('probType2acceptsA');
            e.value = 0;
            e = document.getElementById('probType3acceptsA');
            e.value = 0;
            break;
        case 'strategic':
            e = document.getElementById('probType1acceptsC');
            e.value = 1;
            e = document.getElementById('probType3acceptsB');
            e.value = 1;
            break;
        case 'social':
            e = document.getElementById('propTyp1nice');
            e.value = 0.25;
            e = document.getElementById('propTyp2nice');
            e.value = 0.25;
            e = document.getElementById('propTyp3nice');
            e.value = 0.25;
            break;
        case 'equilibrium':
            e = document.getElementById('probType1acceptsB');
            e.value = 1;
            e = document.getElementById('probType1acceptsC');
            e.value = 1;
            e = document.getElementById('probType2acceptsC');
            e.value = 1;
            e = document.getElementById('probType3acceptsB');
            e.value = 1;
            e = document.getElementById('storageAtxt');
            e.value = 5;
            e = document.getElementById('storageBtxt');
            e.value = 5;
            e = document.getElementById('storageCtxt');
            e.value = 5;
            break;
        case 'random':
            e = document.getElementById('storageAtxt');
            e.value = Math.round(Math.random() * 10);
            e = document.getElementById('storageBtxt');
            e.value = Math.round(Math.random() * 10);
            e = document.getElementById('storageCtxt');
            e.value = Math.round(Math.random() * 10);
            e = document.getElementById('startPointsTxt');
            e.value = Math.round(Math.random() * 50);
            e = document.getElementById('consumeBonusTxt');
            e.value = Math.round(Math.random() * 50);
            e = document.getElementById('probType1acceptsA');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('probType1acceptsB');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('probType1acceptsC');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('probType2acceptsA');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('probType2acceptsB');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('probType2acceptsC');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('probType3acceptsA');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('probType3acceptsB');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('probType3acceptsC');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('propTyp1nice');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('propTyp2nice');
            e.value = roundDec(Math.random(), 2);
            e = document.getElementById('propTyp3nice');
            e.value = roundDec(Math.random(), 2);
            break;
    }
};

/**
 *  Onclick listener which initializes the variables with the values from the input fields
 *  and starts the simulation procedure
 */
document.getElementById('runSimBtn').onclick = function(){
    n = parseInt(document.getElementById('numbPersonsTxt').value);
    if(n % 2 != 0 || n % 3 != 0)
        notie.alert(3, 'Sorry, die Anzahl an Personen muss durch  <b>2</b> <i>and</i> <b>3</b> <small> teilbar sein </small>', 5);
    else {
        rounds = parseInt(document.getElementById('numbRoundsTxt').value);
        storageCosts[typeA] = parseInt(document.getElementById('storageAtxt').value);
        storageCosts[typeB] = parseInt(document.getElementById('storageBtxt').value);
        storageCosts[typeC] = parseInt(document.getElementById('storageCtxt').value);
        startPoints = parseInt(document.getElementById('startPointsTxt').value);
        consumeBonus = parseInt(document.getElementById('consumeBonusTxt').value);

        storageCosts[typeA] = parseInt(document.getElementById('storageAtxt').value);

        propTypeAccepts[pTypeA + typeA] = parseFloat(document.getElementById('probType1acceptsA').value);
        propTypeAccepts[pTypeA + typeB] = parseFloat(document.getElementById('probType1acceptsB').value);
        propTypeAccepts[pTypeA + typeC] = parseFloat(document.getElementById('probType1acceptsC').value);

        propTypeAccepts[pTypeB + typeA] = parseFloat(document.getElementById('probType2acceptsA').value);
        propTypeAccepts[pTypeB + typeB] = parseFloat(document.getElementById('probType2acceptsB').value);
        propTypeAccepts[pTypeB + typeC] = parseFloat(document.getElementById('probType2acceptsC').value);

        propTypeAccepts[pTypeC + typeA] = parseFloat(document.getElementById('probType3acceptsA').value);
        propTypeAccepts[pTypeC + typeB] = parseFloat(document.getElementById('probType3acceptsB').value);
        propTypeAccepts[pTypeC + typeC] = parseFloat(document.getElementById('probType3acceptsC').value);

        propTypeNice[pTypeA] = parseFloat(document.getElementById('propTyp1nice').value);
        propTypeNice[pTypeB] = parseFloat(document.getElementById('propTyp2nice').value);
        propTypeNice[pTypeC] = parseFloat(document.getElementById('propTyp3nice').value);

        verbose = document.getElementById('loggingCheckbox').checked;

        runSim();
    }
};

/**
 * Initializes the experiment with the given settings and runs the simulation and analysis
 */
function runSim(){
    print('<b><font size="5" color="green">Initialisiere...</font></b>');
    print();
    print('Gesamtanzahl der Personen = ' + n);
    print('Runden = ' + rounds);
    print('Lagerkosten = ' + typeA + ': ' + storageCosts[typeA] + ', ' + typeC + ': ' + storageCosts[typeB] + ', ' + typeC + ': ' + storageCosts[typeC]);
    print('Anfangspunktzahl = ' + startPoints)
    print('Konsumbonus = ' + consumeBonus + '</font>');
    print('Gesamtzahl an Gütern = ' + n);
    print('Wahrscheinlichkeit von Bauer Gut zu akzeptieren ' + typeA + ': ' + propTypeAccepts['1' + typeA] + ', ' + typeB +':' + propTypeAccepts['1' + typeB] + ', ' + typeC + ': ' + propTypeAccepts['1' + typeC]);
    print('Wahrscheinlichkeit von Müller Gut zu akzeptieren ' + typeA + ': ' + propTypeAccepts['2' + typeA] + ', ' + typeB +':' + propTypeAccepts['2' + typeB] + ', ' + typeC +':' + propTypeAccepts['2' + typeC]);
    print('Wahrscheinlichkeit von Bäcker Gut zu akzeptieren ' + typeA + ': ' + propTypeAccepts['3' + typeA] + ' ' + typeB +':' + propTypeAccepts['3' + typeB] + ', ' + typeC +':' + propTypeAccepts['3' + typeC]);
    print('Wahrscheinlichkeit, dass Bauer entgegenkommend ist: ' + propTypeNice[pTypeA]);
    print('Wahrscheinlichkeit, dass Müller entgegenkommend ist: : ' + propTypeNice[pTypeB]);
    print('Wahrscheinlichkeit, dass Bäcker entgegenkommend ist: ' + propTypeNice[pTypeC]);
    createPersons();
    print('Anzahl an Personen = Bauer: ' + personTypeAmounts[pTypeA] + ', Müller: ' + personTypeAmounts[pTypeB] + ', Bäcker: ' + personTypeAmounts[pTypeC]);
    print('Anzahl an Gütern = ' + typeA +':' + goodsStartAmounts[typeA] + ', ' + typeB +':' + goodsStartAmounts[typeB] + ', ' + typeC +':' + goodsStartAmounts[typeC] );
    print();
    print('<b><font size="5" color="blue">Starte Simulation</font></b>');

    runRounds(rounds);
    if(!verbose){
        print();
        print('<i><font color="gray"><small>[output not shown]</small></font></i>');
    }
    print('<br><b><font size="5" color="blue">Simulation beendet</font></b>');
    print('<br><b><font size="5" color="red">Markanalyse</font></b><br>');
    runAnalysis();
    print();
};
