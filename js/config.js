/*****************************

            CONFIG

*****************************/

var uTasksNeeded = 14;
var featureCounter = 0;
var featureList = [
    [ResData.taskTypes.Feature, "Kunyhóépítés", 20, 60, 10, 3.0, {base:{r:100,t:110,d:'Építsünk házat...',s:'egyedi_stile_szokoz_nelkul'}, bonus: {r:300,t:5,d:'Ha gyorsan elkészül, többet ér!',s:'house' }}],
    [ResData.taskTypes.Feature, "Rádió", 50, 20, 30, 3.0, {base:{r:200,t:100,d:'Jó reggelt Vietnám!',s:'egyedi_stile_szokoz_nelkul'}, bonus: {r:500,t:15,d:'Ha gyorsan elkészül, többet ér!',s:'radio' }}],
    [ResData.taskTypes.Feature, "Tárcsás telefon", 50, 10, 40, 3.0, {base:{r:250,t:100,d:'Watson jojjon ide, szuksegem van magara (Alexander Graham Bell)',s:'egyedi_stile_szokoz_nelkul'}, bonus: {r:700,t:15,d:'Ha gyorsan elkészül, többet ér!',s:'oldtelefon' }}],
    [ResData.taskTypes.Feature, "Képrögzítés", 40, 20, 25, 3.0, {base:{r:300,t:110,d:'Felvegyelek?',s:'egyedi_stile_szokoz_nelkul'}, bonus: {r:900,t:20,d:'Ha gyorsan elkészül, többet ér!',s:'oldcamera' }}],
    [ResData.taskTypes.Feature, "Mühold", 40, 20, 25, 3.0, {base:{r:400,t:90,d:'És még mindig mozog, a Föld!',s:'egyedi_stile_szokoz_nelkul'}, bonus: {r:1200,t:25,d:'Ha gyorsan elkészül, többet ér!',s:'satellite' }}],
    [ResData.taskTypes.Feature, "Mobiltelefon", 40, 20, 25, 3.0, {base:{r:400,t:70,d:'Honnan tudtad hogy itt vagyok?',s:'egyedi_stile_szokoz_nelkul'}, bonus: {r:1200,t:35,d:'Ha gyorsan elkészül, többet ér!',s:'mobile' }}],
    [ResData.taskTypes.Feature, "Robotkutya", 45, 10, 35, 3.0, {base:{r:500,t:50,d:'Intelligens, kikapcsolhato házikedvenc',s:'egyedi_stile_szokoz_nelkul'}, bonus: {r:2000,t:45,d:'Ha gyorsan elkészül, többet ér!',s:'robot pet' }}]
]

// Bug: bonus: ha elég gyorsan kijavítod, nem veszik észre.
function initTasks() {
    for(var i = 1; i <= uTasksNeeded + 2; ++i) {
        addUnknownTask();
    }
    var uTasks = ResData.selectTasks(function(t){return t.type === ResData.taskTypes.Unknown;});
    addTask();
    addTask();
}

function addUnknownTask() {
    var newTask = new ResTask("task", ResData.taskTypes.Unknown, "Még nem elérhető", 0, 0, 0, 3.0, {base:{r:0,t:0,d:'Előbb a többi nyitott feladatot kell elvégezni.'}});
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
    if(featureCounter >= featureList.length) {
        featureCounter = 0;
    }
    replaceTaskFromArray(taskToReplace, featureList[featureCounter]);
    ++featureCounter;
}

function replaceTaskFromArray(taskToReplace, a) {
    taskToReplace.replace(a[0],a[1],a[2],a[3],a[4],a[5],a[6])
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

