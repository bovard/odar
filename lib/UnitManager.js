

var id = 2;

function UnitManager() {
    this.idToUnit = {};
    this.player = null;
    this.units = [];

}

UnitManager.prototype = {
    addPlayer: function(playerUnit) {
        playerUnit.id = 1;
        this.player = playerUnit;
        this.idToUnit[playerUnit.id] = playerUnit;
    },
    addUnit: function(unit) {
        unit.id = id;
        id++;
        this.idToUnit[unit.id] = unit;
        this.units.push(unit);
    },
    removeUnit: function(id) {
        var unit = this.idToUnit[id];
        if (!unit) {
            throw Error("tried to delete a unit that was already deleted!");
        }
        delete this.idToUnit[id];
        this.units = this.units.filter(function (u) {return u.id !== unit.id;});
    },
    getById: function(id) {
        return this.idToUnit[id];
    },
    getPlayer: function() {
        return this.player;
    }
};

module.exports = UnitManager;