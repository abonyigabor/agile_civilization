/*****************************

            CONFIG

*****************************/

uTasksNeeded = 14;

// Bug: bonus: ha elég gyorsan kijavítod, nem veszik észre.
function initTasks() {
    for(var i = 1; i <= uTasksNeeded + 2; ++i) {
        addUnknownTask();
    }
    var uTasks = ResData.selectTasks(function(t){return t.type === ResData.taskTypes.Unknown;});
    uTasks[0].replace(ResData.taskTypes.Feature, "Első feladat", 20, 30, 40, {base:{r:100,t:120,d:'Ennek a feladatnak a lényege, hogy...'}, bonus: {r:300,t:18,d:'Ha gyorsan elkészül, többet ér!'}});
    uTasks[1].replace(ResData.taskTypes.Feature, "Második feladat", 40, 20, 25, {base:{r:100,t:110,d:'Ennek a feladatnak a lényege, hogy...'}, bonus: {r:300,t:5,d:'Ha gyorsan elkészül, többet ér!'}});

}

function addUnknownTask() {
    var newTask = new ResTask("task", ResData.taskTypes.Unknown, "Még nem elérhető", 0, 0, 0, {base:{r:0,t:0,d:'Előbb a többi nyitott feladatot kell elvégezni.'}});
    document.querySelector('.board').append(newTask.createDOM());
}

function addTask() {
    var uTasks = ResData.selectTasks(function(t){return t.type === ResData.taskTypes.Unknown;});
    if(uTasks.length < uTasksNeeded) {
        for(var i=uTasks.length; i<=uTasksNeeded; ++i) {
            addUnknownTask();
        }
    }
    if(uTasks.length == 0) {
        var uTasks = ResData.selectTasks(function(t){return t.type === ResData.taskTypes.Unknown;});
    }
    var taskToReplace = uTasks[0];
    // TODO: Generate
    taskToReplace.replace(ResData.taskTypes.Bug, "Harmadik feladat", 40, 20, 25, {base:{r:100,t:110,d:'Ennek a feladatnak a lényege, hogy...'}, bonus: {r:300,t:5,d:'Ha gyorsan elkészül, többet ér!'}});
//    new ResTask("task", ResData.taskTypes.Support, "Negyedik feladat", 40, 20, 25, {base:{r:100,t:110,d:'Ennek a feladatnak a lényege, hogy...'}, bonus: {r:300,t:5,d:'Ha gyorsan elkészül, többet ér!'}});

}

function initWorkers() {
    new ResWorker(['Arisztotelész', 'Alfréd', 'Alan'],    2, 100);
    new ResWorker(['Gilgames',      'Graham', 'Grace'],   2, 100);
    new ResWorker(['Ikarosz',       'Ignác',  'Iwatani'], 2, 100);
    new ResWorker(['Laukon',        'Lenoir', 'Larry'],   2, 100);
    new ResWorker(['Euklidesz',     'Edison', 'Edward'],  2, 100);

    Object.keys(ResData.workers).forEach( function(key) {
      document.querySelector('section.infobar > .workers').append(ResData.workers[key].createDOM());
    });
}

