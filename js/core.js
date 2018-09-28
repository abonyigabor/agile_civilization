/*****************************

            CORE

*****************************/

class ResData {
	static findTask(id) {
		return ResData.tasks[id];
	}

	static findWorker(id) {
		return ResData.workers[id];
	}

	static selectTasks(filter) {
		var tasks = new Array();
		Object.keys(ResData.tasks).forEach(function (key) {
			var task = ResData.tasks[key];
			if (filter(task)) {
				tasks.push(task);
			}
		});
		return tasks;
	}

	static selectWorkers(filter) {
		var workers = new Array();
		Object.keys(ResData.workers).forEach(function (key) {
			var worker = ResData.workers[key];
			if (filter(worker)) {
				workers.push(worker);
			}
		});
		return workers;
	}
}
ResData.tasks = {};
ResData.workers = {};
ResData.taskTypes = Object.freeze({Unknown:0, Vacation:1, Support:2, Feature:3, Bug:4, Finished:5, Missed:6});
ResData.taskTypesRev = Object.freeze({0:"unknown", 1:"vacation", 2:"support", 3:"feature", 4:"bug", 5:"finished", 6:"missed"});
ResData.selectedTask = '';
ResData.taskMaxProgress = 200;
ResData.defaultTime = 300;
ResData.playerInfo = {
	time: 300,
	points: 0,
	level: 1,
	core_interval: false,
	ui_active: false,
	ui_interval: false,
	time_ui: 0,
	points_ui: 1000
};
ResData.levels = new Array({style:'stoneAge',  time_limit: 300},
                           {style:'ironAge',   time_limit: 300},
                           {style:'modernAge', time_limit: 300});


// Bug: bonus: ha elég gyorsan kijavítod, nem veszik észre.
function initTasks() {
    new ResTask("task-easy-" + leadingZero(1), ResData.taskTypes.Feature, "Első feladat", 20, 30, 40, {base:{r:100,t:120,d:'Ennek a feladatnak a lényege, hogy...'}, bonus: {r:300,t:20,d:'Ha gyorsan elkészül, többet ér!'}});
    new ResTask("task-easy-" + leadingZero(2), ResData.taskTypes.Feature, "Második feladat", 40, 20, 25, {base:{r:100,t:120,d:'Ennek a feladatnak a lényege, hogy...'}, bonus: {r:300,t:25,d:'Ha gyorsan elkészül, többet ér!'}});
    for(var i = 3; i <= 16; ++i)
    {
        new ResTask("unknwown-task-" + leadingZero(i), ResData.taskTypes.Unknown, "Még nem elérhető", 0, 0, 0, {base:{r:100,t:120,d:'Előbb a többi nyitott feladatot kell elvégezni.'}});
    }

    Object.keys(ResData.tasks).forEach( function(key) {
      document.querySelector('.board').append(ResData.tasks[key].createDOM());
    });
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

function do_core_calc() {
    if(!ResData.playerInfo.ui_active) {
        return;
    }
    var level = ResData.levels[ResData.playerInfo.level - 1];
    if(document.body.className != level.style) {
        document.body.className = level.style;
    }

    Object.keys(ResData.tasks).forEach( function(key) {
        var task = ResData.tasks[key];
        if(task.type == ResData.taskTypes.Unknown) {
            return;
        }
        var workers = task.getWorkers();
        if(task.finished) {
            workers.forEach( function(worker, index) {
                worker.taskFinished();
            });

            if(!task.rewarded) {
                var reward_sum = 0;
                if(task.rewards.bonus.t > 0) {
                    reward_sum += task.rewards.bonus.r;
                }
                if(task.rewards.base.t > 0) {
                    reward_sum += task.rewards.base.r;
                }
                ResData.playerInfo.points += Math.floor(reward_sum);
                task.rewarded = true;
            }
            task.updateDOM();
            return;
        }
        task.doTick();
        
        if(workers.length > 0) {
            var fresh_workers = new Array();
            workers.forEach( function(worker, index) {
                if(worker.stamina > 0) {
                    fresh_workers.push(worker);
                }
            });
            if(fresh_workers.length > 0) {
                var skill_sum = 0;
                fresh_workers.forEach( function(worker, index) {
                    worker.setStamina(worker.stamina - (0.4 / fresh_workers.length));
                    var skill = worker.xp;
                    skill_sum += Math.floor(skill);
                    skill += 0.03 + 0.02 * (fresh_workers.length - 1);
                    worker.setXp(skill);
                });
                var progress = skill_sum * fresh_workers.length / (fresh_workers.length + 1)
                task.addProgress(progress);
            }
        }
        task.updateDOM();
    });
    
    Object.keys(ResData.workers).forEach( function(key) {
        var worker = ResData.workers[key];
        if(!worker.currentTask) {
            worker.setStamina(worker.stamina + 1);
        }
    });

    if(ResData.playerInfo.time > 0) {
        ResData.playerInfo.time--;
    }
}

function init_game() {
    ResData.playerInfo.ui_interval = setInterval(update_numbers, 80);
    ResData.playerInfo.core_interval = setInterval( do_core_calc, 1000 );
}

var started = false;
function start_game() {
    if(!started) {
        started = true;
        initTasks();
        initWorkers();
        document.querySelector('#popup').className = 'hidden';
        setTimeout(function(){ResData.playerInfo.ui_active = true;}, 1000);
    }
}