
function BaseCreepPlayer(creepController) {
    this.cc = creepController;
    this.behaviors = [];
}

BaseCreepPlayer.prototype = {
    alertAllies: function() {
        this.cc.alertAllies();
    },
    act: function() {
        if (!this.behaviors) {
            return;
        }

        for (var i = 0; i < this.behaviors.length; i++) {
            if (this.behaviors[i].act()) {
                return;
            }
        }
    },
};

module.exports = BaseCreepPlayer;
