/*****************************

            TASK

*****************************/

class ResTask {
	constructor(id, type, name, planAmount, implementAmount, testAmount, difficulty, rewards) {
		this.id = id + '-' + Object.keys(ResData.tasks).length;
		ResData.tasks[this.id] = this;
        this.replace(type, name, planAmount, implementAmount, testAmount, difficulty, rewards);
	}

    replace(type, name, planAmount, implementAmount, testAmount, difficulty, rewards) {
		this.name = name;
		this.name_id = ascii(name);
		this.planAmount = planAmount;
		this.implementAmount = implementAmount;
		this.testAmount = testAmount;
        this.difficulty = difficulty;
		// Rewards {base:{r:100,t:120,d:''}, bonus: {r:300,t:25,d:''}}
        this.rewards = rewards;
		this.planProgress = 0;
		this.implementProgress = 0;
		this.testProgress = 0;
        this.rewarded = false;

        this.originalType = type;
        this.setType(type);
	}

    
	DEBUG_finish() {
		this.planProgress = this.planAmount;
		this.implementProgress = this.implementAmount;
		this.testProgress = this.testAmount;
		this.updateDOM();
	}

	DEBUG_reset() {
		this.planProgress = 0;
		this.implementProgress = 0;
		this.testProgress = 0;
		this.updateDOM();
	}

	get finished() {
		return this.planProgress == this.planAmount
		 && this.implementProgress == this.implementAmount
		 && this.testProgress == this.testAmount;
	}

	getWorkers() {
        var id = this.id;
        return ResData.selectWorkers(function(w){
            return w.currentTask === id;
        });
	}

	addProgress(progress) {
        progress /= this.difficulty;
		if (this.planProgress + progress < this.planAmount) {
			this.planProgress += progress;
		} else {
			progress -= this.planAmount - this.planProgress;
			this.planProgress = this.planAmount;
			if (this.implementProgress + progress < this.implementAmount) {
				this.implementProgress += progress;
			} else {
				progress -= this.implementAmount - this.implementProgress;
				this.implementProgress = this.implementAmount;
				if (this.testProgress + progress < this.testAmount) {
					this.testProgress += progress;
				} else {
					progress -= this.testAmount - this.testProgress;
					this.testProgress = this.testAmount;
				}
			}
		}
        this.updateDOM()        
	}
    
    setType(type) {
        var wrapperDiv = document.getElementById(this.id);
        if (!wrapperDiv) {
            this.type = type;
        } else {
            wrapperDiv.className = wrapperDiv.className.replace(' ' + ResData.taskTypesRev[this.type], '');
            this.type = type;
            wrapperDiv.className += ' ' + ResData.taskTypesRev[this.type];
            this.updateDOM();
        }
    }

    doTick() {
        if(this.rewards.base.t > 0) {
            --this.rewards.base.t;
        }
        if(this.rewards.bonus.t > 0) {
            --this.rewards.bonus.t;
        }
        if(this.rewards.base.t == 0
          && this.type != ResData.taskTypes.Unknown
          && this.type != ResData.taskTypes.Finished
          && this.type != ResData.taskTypes.Missed) {
            this.setType(ResData.taskTypes.Missed);
        }
    }

	createDOM() {
        wrapperDiv = document.getElementById(this.id);
        if (wrapperDiv == null) {
            var wrapperDiv = document.createElement('div');
        }
        wrapperDiv.setAttribute('id', this.id);

        if(this.type != ResData.taskTypes.Unknown)
        {
            wrapperDiv.className = "task " + this.name_id + ' ' + ResData.taskTypesRev[this.type];
        } else {
            wrapperDiv.className = "task " + ResData.taskTypesRev[this.type];
        }
        var progressDiv = document.createElement('div');
        progressDiv.className = "progress";
        wrapperDiv.append(progressDiv);
        var progress_stateDiv = document.createElement('div');
        progress_stateDiv.className = "progress_state";
        wrapperDiv.append(progress_stateDiv);

        wrapperDiv.addEventListener("click", function(e){e.stopPropagation();ResData.findTask(this.id).selectToggle();});

        this.updateDOM(wrapperDiv);
		return wrapperDiv;
	}

	updateDOM(wrapperDiv) {
		if (typeof wrapperDiv == "undefined") {
			wrapperDiv = document.getElementById(this.id);
			if (wrapperDiv == null) {
				console.log("Cannot update! '" + this.id + "' not found.");
				return false;
			}
		}
        var prog_p = this.planAmount;
        var prog_i = (prog_p + this.implementAmount);
        var prog_t = (prog_i + this.testAmount);
        var prog_style = 'background-image: linear-gradient(to right,';
        prog_style += '#0D0, #0D0 ' + (prog_p-1) + '%, #0DD ' + prog_p;
        prog_style += '%, #0DD ' + (prog_i-1) + '%, #DD0 ' + prog_i;
        prog_style += '%, #DD0 ' + (prog_t-1) + '%, #FFF4 ' + prog_t;
        prog_style += '%);';
        wrapperDiv.querySelector('.progress').style = prog_style;    
        var prog_status = (this.planProgress + this.implementProgress + this.testProgress);
        wrapperDiv.querySelector('.progress_state').style = 'width: ' + prog_status + '%';

        if(this.finished && this.type != ResData.taskTypes.Unknown && this.type != ResData.taskTypes.Finished) {
            this.setType(ResData.taskTypes.Finished);
        }
        
        if (wrapperDiv.classList.contains('selected')) {
            updateTaskInfo(this.id);
        }
		return true;
	}
    
    selectToggle() {
        var id = this.id;
        var wrapperDiv = document.getElementById(this.id);
        
        document.querySelectorAll('.task.selected').forEach(function (item, index) {
        	if (item.getAttribute('id') != id) {
        		item.className = item.className.replace(' selected', '');
        	}
        });
        
        if (wrapperDiv.classList.contains('selected')) {
            wrapperDiv.className = wrapperDiv.className.replace(' selected', '');
            updateTaskInfo();
        } else {
            wrapperDiv.className += ' selected';
        }
        
        this.updateDOM(wrapperDiv);
    }

}