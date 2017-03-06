
var levelOne =
"In this level you need to make your way to the exit! (marked by `/`)\n\n" +
"In the API pay special attention to the `PlayerController.senseDirectionToExit()` function.\n\n" +
"Consider using the following example code inside `RaidPlayer.prototype.act()`.\n" +
"```js\n" +
"console.log('Round', this.pc.getGameRound());\n" +
"var direction = this.pc.senseDirectionToExit();\n" +
"if (this.pc.canMove(direction)) {\n" +
"    console.log('Moving', direction.toString());\n" +
"    this.pc.move(direction);\n" +
"    return;\n" +
"}\n" +
"console.log('cannot move!');\n" +
"```\n" +
"The default player is quite dumb and won't be able to make it to the exit without your help!\n\n" +
"__TIP:__ [Console output will be helpful in debugging your AI!](http://webmasters.stackexchange.com/questions/8525/how-to-open-the-javascript-console-in-different-browsers#77337)\n";

var levelTwo =
"In this level several walls block your way!\n\n" +
"You will need to add some advanced path finding later, but for now you should pay close attention to \`Direction.rotateLeft()\`, \`Direction.rotateRight()\`!\n" +
"If a wall is blocking your path, often the best choice is to rotate until you find a clear direction.\n\n" +
"```js\n" +
"var direction = this.pc.senseDirectionToExit();\n" +
"var idx = 0;\n" +
"while (!this.pc.canMove(direction) && idx < 10) {\n" +
"    console.log('rotating left!')\n" +
"    direction = direction.rotateLeft();\n" +
"    idx++;\n" +
"}\n" +
"if (this.pc.canMove(direction)) {\n" +
"    console.log('Moving', direction.toString());\n" +
"    this.pc.move(direction);\n" +
"    return;\n" +
"}\n" +
"console.log('cannot move!');\n" +
"```\n" +
"__TIP:__ Make sure to check out the Raid API below!\n";

var levelThree =
"In this level you face your first opponent, a giant frog!\n" +
"Use `this.pc.senseNearbyUnits()` to see if there are any nearby enemies.\n\n" +
"You should be able to use `canMeleeAttack` and `meleeAttack` to easily defeat the giant frog once you are adjacent to it!\n" +
"```js\n" +
"var units = this.pc.senseNearbyUnits();\n" +
"for (var i = 0; i < units.length; i++) {\n" +
"    if (this.pc.canMeleeAttack(units[i].location)) {\n" +
"        console.log('melee attacking unit at location ', units[i].location.toString());\n" +
"        this.pc.meleeAttack(units[i].location);\n" +
"        return;\n" +
"    }\n" +
"}\n" +
"console.log('Cannot melee attack anything!');\n" +
"```";

var levelFour =
"In this level you face **several** giant frogs!\n" +
"Use what you learned in the last level and you should be fine.\n" +
"Note that always turning left might not be the best choice, can you find a different way?\n";

var levelFive =
"In this level you face a swarm of gnats!\n" +
"Gnats are fast but have very low HP (4).\n\n" +
"Kill them with magic if you want to survive! Magic attacks do splash damage (check out `GameConstants`) so you should be able to kill multiple gnats at once.\n" +
"```js\n" +
"var units = this.pc.senseNearbyUnits();\n" +
"for (var i = 0; i < units.length; i++) {\n" +
"    if (this.pc.canMagicAttack(units[i].location)) {\n" +
"        console.log('magic attacking unit at location ', units[i].location.toString());\n" +
"        this.pc.magicAttack(units[i].location);\n" +
"        return;\n" +
"    }\n" +
"}\n" +
"console.log('Cannot magic attack anything!');\n" +
"```";

var levelSix =
"In this level you face your first ranged enemy, a quill boar!\n" +
"Kill them with `rangedAttack` if you want to survive! Ranged attacks are powerful at range, but have a minimum attack distance (see `GameConstants`).\n" +
"```js\n" +
"var units = this.pc.senseNearbyUnits();\n" +
"for (var i = 0; i < units.length; i++) {\n" +
"    if (this.pc.canRangedAttack(units[i].location)) {\n" +
"        console.log('ranged attacking unit at location ', units[i].location.toString());\n" +
"        this.pc.rangedAttack(units[i].location);\n" +
"        return;\n" +
"    }\n" +
"}\n" +
"console.log('Cannot ranged attack anything!');\n" +
"```";

var levelSeven =
"In this level you face off against an evil necromancer!\n" +
"You'll have to use all that you have learned to defeat him.\n" +
"You may even need to heal. Make sure to check your hp before healing!\n" +
"\n" +
"```js\n" +
"if (this.pc.getHp() < 100) {\n" +
"    this.pc.heal();\n" +
"    return;\n" +
"}\n" +
"```";

var complete = "`__Congratulations__, you have beat the tutorial!\n" +
"Your player has been saved to local storage (unless you don't allow that sort of thing!). You can also copy your code, of course.\n" +
"Now refresh this page and take on __Adventure Mode__!";

function getMDForLevel(level) {
    switch(level) {
        case 1:
            return levelOne;
        case 2:
            return levelTwo;
        case 3:
            return levelThree;
        case 4:
            return levelFour;
        case 5:
            return levelFive;
        case 6:
            return levelSix;
        case 7:
            return levelSeven;
        default:
            return complete;
    }

}

module.exports = getMDForLevel;
