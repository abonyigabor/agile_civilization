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
ResData.levels = new Array({style:'winAge', time_limit: 300});

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
                    if(task.rewards.bonus.s) {
                        task.showReward(task.rewards.bonus.s);
                    }
                }
                if(task.rewards.base.t > 0) {
                    reward_sum += task.rewards.base.r;
                    if(task.rewards.base.s) {
                        task.showReward(task.rewards.base.s);
                    }
                }
                ResData.playerInfo.points += Math.floor(reward_sum);
                task.rewarded = true;
                task.updateDOM();
            }
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
                    worker.setStamina(worker.stamina - (0.8 / fresh_workers.length));
                    var skill = worker.xp;
                    skill_sum += Math.floor(skill);
                    skill += 0.01 + 0.006 * (fresh_workers.length - 1);
                    worker.setXp(skill);
                });
                var progress = skill_sum * fresh_workers.length / (fresh_workers.length + 1)
                task.addProgress(progress);
                return;
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
    } else {
        setTimeout(function(){end_age();}, 1000);
    }

    var openTasks = ResData.selectTasks(function(t){return !t.finished && t.type != ResData.taskTypes.Missed;});
    if(openTasks.length < 3) {
        addTask();
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

function end_age() {
    if(!started) {
        return;
    }
    started = false;
    ResData.playerInfo.ui_active = false;
    document.querySelector('#popup').className = '';
    ResData.playerInfo.level += 1;
    do_core_calc();
    var level = ResData.levels[ResData.playerInfo.level - 1];
    if(level) {
        ResData.playerInfo.time = level.time_limit;
    }
}

function resume_game() {
    if(!started || true) {
        started = true;
        document.querySelector('#popup').className = 'hidden';
    }
}
