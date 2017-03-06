// react
var React = require('react');
var ReactDOM = require('react-dom');
var ReactMarkdown = require('react-markdown');

// react bootstrap
var Accordion = require('react-bootstrap').Accordion;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var MenuItem = require('react-bootstrap').MenuItem;
var DropdownButton = require('react-bootstrap').DropdownButton;
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Input = require('react-bootstrap').Input;
var Panel = require('react-bootstrap').Panel;
var PanelGroup = require('react-bootstrap').PanelGroup;
var Well = require('react-bootstrap').Well;

// react ace
var AceEditor = require('react-ace').default;
var brace  = require('brace');
require('brace/mode/javascript');
require('brace/theme/chrome');
require('brace/ext/language_tools'); // @see https://github.com/securingsincity/react-ace/issues/95

// game components
var GameRunner = require('../lib/GameRunner');
var ScoreEvent = require('../lib/ScoreEvent');
var CompilePlayerCode = require('../lib/CompilePlayerCode');
var TutorialVerbage = require('../lib/TutorialVerbage');
var GAReporter = require('../lib/GAReporter');
var UnitType = require('../lib/UnitType');

// graphics
var GraphicsConstants = require('../lib/Graphics/GraphicsConstants');
var GameRenderer = require('../lib/Graphics/GameRenderer');

// Game constants
var GameConstants = require('../lib/GameConstants');

var ADVENTURE = "adventure";
var TUTORIAL = "tutorial";


var UnitStats = React.createClass({
    render: function() {
        if (!this.props.unit) {
            return (
                <Well>
                    <p>No units in range</p>
                </Well>
            );
        }
        return (
            <Well>
                <p>{this.props.unit.name}: {this.props.unit.type}   {this.props.unit.hp}/{this.props.unit.maxHp}</p>
                <p>{this.props.unit.description}</p>
                <ul>
                {(this.props.unit.type != UnitType.PLAYER) ?
                    <li>Value: {Math.round(this.props.unit.defeatPoints)}</li> : null
                }
                <li>Delay: {Math.round(100 * this.props.unit.delay) / 100}</li>
                <li>Sight: {this.props.unit.sensorRadiusSquared}</li>
                <li>Melee: {this.props.unit.meleeAttackPower} / {this.props.unit.meleeAttackDelay}</li>
                <li>Magic: {this.props.unit.magicAttackPower} / {this.props.unit.magicAttackDelay}</li>
                <li>Ranged: {this.props.unit.rangedAttackPower} / {this.props.unit.rangedAttackDelay}</li>
                    </ul>
            </Well>
        );
    }
});


var GameController = React.createClass({
    slow: function() {
        this.props.setSpeed(600);
    },
    normal: function() {
        this.props.setSpeed(300);
    },
    fast: function() {
        this.props.setSpeed(150);
    },
    ultra: function() {
        this.props.setSpeed(75);
    },
    zap: function() {
        this.props.setSpeed(25);
    },
    compileAndRun: function() {
        this.props.compile(this.props.playerCode);
    },
    render: function() {
        var mode = (this.props.mode === TUTORIAL ? "Tutorial" : "Adventure");
        var playPause = (
            <ButtonGroup>
                <Button onClick={this.props.pause}>Pause</Button>
                <Button onClick={this.compileAndRun} bsStyle="danger">Restart</Button>
            </ButtonGroup>
        );
        if (this.props.paused) {
            playPause = (
                <ButtonGroup>
                    <Button onClick={this.props.play}>Continue</Button>
                    <Button onClick={this.props.step}>Step</Button>
                    <Button onClick={this.compileAndRun} bsStyle="danger">Restart</Button>
                </ButtonGroup>

            );
        }

        var content = (
            <Well>
                <h3>{mode} Level: {this.props.level}</h3>
                <h4>Score: {Math.round(this.props.score)}</h4>
                <Button onClick={this.compileAndRun}>Run</Button>
            </Well>
        );
        if (this.props.game) {
            content = (
                <Well>
                    <h3>{mode} Level: {this.props.level}</h3>
                    <h4>Score: {Math.round(this.props.score)}</h4>
                    <p>Round: {this.props.game.round}/{this.props.game.map.roundLimit}</p>
                    <ButtonToolbar>
                        {playPause}
                        <DropdownButton title="Speed" id="bg-nested-dropdown">
                            <MenuItem eventKey="1" onSelect={this.slow}>.5x</MenuItem>
                            <MenuItem eventKey="2" onSelect={this.normal}>1x</MenuItem>
                            <MenuItem eventKey="3" onSelect={this.fast}>2x</MenuItem>
                            <MenuItem eventKey="4" onSelect={this.ultra}>4x</MenuItem>
                            <MenuItem eventKey="5" onSelect={this.zap}>12x</MenuItem>
                        </DropdownButton>
                    </ButtonToolbar>
                </Well>
            );
        }

        return (
            <div>
                {content}
            </div>
        );
    }
});

var TableCell = React.createClass({
    render: function() {
        var classes = "tile"
        if (this.props.terrain.cssClass != this.props.mapCssClass) {
            classes += " " + this.props.terrain.cssClass;
        }
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var wid = (.8*w)/this.props.width;

        if (this.props.inSight) {
            classes += ' in-sight';
        }
        var style = {
            height: wid + "px"
        };
        var fontStyle = {
            fontSize: Math.ceil(.5 * wid) - 2 + "px"
        };
        var unit = this.props.unit;
        if (unit) {
            unit = unit.type;
        }
        if (!unit && this.props.isExit) {
            unit = "/"
        }
        return (
            <td className={classes} style={style}>
                <p style={fontStyle}>
                    {unit}
                </p>
            </td>
            )
    }
});

var TableRow = React.createClass({
    render: function() {
        var cells = [];
        for (var i = 0; i < this.props.terrain.length; i++) {
            var isExit = this.props.row === this.props.exit.y && i === this.props.exit.x;
            var inSight = Math.pow(this.props.row - this.props.playerLoc.y, 2) + Math.pow(i - this.props.playerLoc.x, 2) <= 64;
            cells.push(
                <TableCell
                    key={"c-" + this.props.gameId + "-" + i}
                    isExit={isExit}
                    height={this.props.height}
                    width={this.props.width}
                    terrain={this.props.terrain[i]}
                    unit={this.props.units[i]}
                    inSight={inSight}
                    mapCssClass={this.props.mapCssClass}
                />
            )
        }
        return (
            <tr>
                {cells}
            </tr>
            )
    }

});

var TableRenderer = React.createClass({
    render: function() {
        var rows = [];
        for (var i = 0; i < this.props.height; i++) {
            rows.push(<TableRow
                        height={this.props.height}
                        width={this.props.width}
                        key={this.props.gameId + "-" + i}
                        row={i}
                        gameId={this.props.gameId}
                        exit={this.props.exit}
                        units={this.props.units[i]}
                        terrain={this.props.terrain[i]}
                        playerLoc={this.props.playerLoc}
                        mapCssClass={this.props.cssClass}
                      />
            );
        }
        var style= {
            tableLayout: "fixed",
            "width": "100%"
        };
        return (
            <table id="map" className={this.props.cssClass} style={style}>
                <thead></thead>
                <tbody>{rows}</tbody>
            </table>
            );
    }
});

var CanvasRenderer = React.createClass({
    getInitialState: function() {
        return {
            zoomFactor: this.props.currentZoomFactor
        };
    },
    componentDidMount: function () {
        ReactDOM.findDOMNode(this).children[0].appendChild(this.props.canvas);
    },
    handleZoomIn: function() {
        this.state.zoomFactor = Math.min(this.state.zoomFactor + 0.5, GraphicsConstants.FX_VIEWPORT_MAX_ZOOM_FACTOR);
        this.props.setZoom(this.state.zoomFactor);
    },
    handleZoomOut: function() {
        this.state.zoomFactor = Math.max(this.state.zoomFactor - 0.5, GraphicsConstants.FX_VIEWPORT_MIN_ZOOM_FACTOR);
        this.props.setZoom(this.state.zoomFactor);
    },
    render: function() {
        var containerDivStyle = {
            width: "100%",
            paddingBottom: "75%", //  Maintains 4:3 aspect ratio for the canvas
            position: "relative"
        };

        var stretchyDivStyle = {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };

        return (
            <div id="canvasContainer" style={containerDivStyle}>
                <div style={stretchyDivStyle}/>
                <div id="canvasZoomButtonsContainer">
                    <button id="zoomIn" onClick={this.handleZoomIn} className="zoomButton"></button>
                    <button id="zoomOut" onClick={this.handleZoomOut} className="zoomButton"></button>
                </div>
            </div>
            );
    }
});

var samplePlayer = [
    "function RaidPlayer(playerController) {",
    "  this.pc = playerController;",
    "}",
    "",
    "RaidPlayer.prototype = {",
    "  act: function() {",
    "    var direction = Direction.randomDirection()",
    "    if(this.pc.canMove(direction)) {",
    "      this.pc.move(direction);",
    "      return;",
    "    }",
    "  }",
    "};"
];

var API = React.createClass({
    //TODO: we need to change this to only return a subset if we are
    // on the tutorial levels
    render: function() {
        return (
            <Well>
                <h3>Raid API</h3>
                <Accordion>
                    <Panel header="PlayerController" eventKey="1">
                        <Accordion>
                            <Panel header="bool canMove(Direction d)" eventKey="1">
                                Returns true if the unit can move in Direction d and false otherwise
                            </Panel>
                            <Panel header="move(Direction d)" eventKey="2">
                                Moves the unit in direction d (adding delay). Throws an Error if that's not possible.
                            </Panel>
                            <Panel header="bool canHeal()" eventKey="19">
                                Returns true if the unit can heal. Your player will always return <code>true</code>.
                            </Panel>
                            <Panel header="heal()" eventKey="20">
                                Heals the unit. Healing adds a lot to your delay.
                            </Panel>
                            <Panel header="bool canMeleeAttack(MapLocation m)" eventKey="3">
                                Returns true if the unit can attack that direction.
                            </Panel>
                            <Panel header="meleeAttack(MapLocation m)" eventKey="4">
                                Melee attacks at m.
                            </Panel>
                            <Panel header="bool canMagicAttack(MapLocation m)" eventKey="5">
                                Returns true if the unit can attack that location.
                            </Panel>
                            <Panel header="magicAttack(MapLocation m)" eventKey="6">
                                Magic attacks at m. Magic attacks do splash damage to nearby squares.
                            </Panel>
                            <Panel header="bool canRangedAttack(MapLocation m)" eventKey="7">
                                Returns true if the unit can range attack that location.
                            </Panel>
                            <Panel header="rangedAttack(MapLocation m)" eventKey="8">
                                Range attacks at m. Ranged attack does big damage with large range but has a minimum range.
                            </Panel>
                            <Panel header="double getDelay()" eventKey="9">
                                Get your player's current delay.
                            </Panel>
                            <Panel header="UnitInfo getMyInfo()" eventKey="10">
                                Get your player's current UnitInfo.
                            </Panel>
                            <Panel header="MapLocation getCurrentLocation()" eventKey="11">
                                Get your player's current location.
                            </Panel>
                            <Panel header="int getGameRound()" eventKey="12">
                                Get the current game round.
                            </Panel>
                            <Panel header="int getGameRoundLimit()" eventKey="13">
                                Gets the game round limit.
                            </Panel>
                            <Panel header="bool canSense(MapLocation m)" eventKey="14">
                                Returns true if m is in this units sensor range.
                            </Panel>
                            <Panel header="bool senseIfPassable(MapLocation m)" eventKey="15">
                                Returns true if location m is a traversable.
                            </Panel>
                            <Panel header="UnitInfo senseUnitAtLocation(MapLocation m)" eventKey="16">
                                Senses the unit at that location.
                            </Panel>
                            <Panel header="UnitInfo[] senseNearbyUnits()" eventKey="17">
                                Senses all units in sensorRange
                            </Panel>
                            <Panel header="Direction senseDirectionToExit()" eventKey="18">
                                Senses the direction to the level exit;
                            </Panel>
                            <Panel header="MapLocation senseExitLocIfClose()" eventKey="19">
                                Senses the location of the exit if you are close enough;
                            </Panel>

                        </Accordion>
                    </Panel>
                    <Panel header="MapLocation" eventKey="2">
                        <ul className="list-unstyled">
                            <li><code>x</code>: returns <code>int</code>, the east/west coordinate (east (0) -> west (width))</li>
                            <li><code>y</code>: returns <code>int</code>, the north/south cooredinate (north (0) -> south (height))</li>
                        </ul>
                        <Accordion>
                            <Panel header="MapLocation add(Direction d)" eventKey="1">
                                Adds direction d to this location and return a new location in that direction.
                            </Panel>
                            <Panel header="Direction directionTo(MapLocation m)" eventKey="2">
                                Returns the direction to move from this current to square to get to m.
                            </Panel>
                            <Panel header="int distanceSquaredTo(MapLocation m)" eventKey="3">
                                Returns the distance squared from this location to m.
                            </Panel>
                            <Panel header="bool isAdjacentTo(MapLocation m)" eventKey="4">
                                Returns true if this location is adjectent to m.
                            </Panel>
                            <Panel header="bool equals(MapLocation m)" eventKey="5">
                                Returns true if this location equals m.
                            </Panel>
                            <Panel header="String toString()" eventKey="6">
                                Returns the string representation of this lcoation.
                            </Panel>
                        </Accordion>
                    </Panel>
                    <Panel header="Direction" eventKey="3">
                        <ul className="list-unstyled">
                            <li><code>x</code>: returns <code>int</code>, the east/west component (east (-1) -> west (1))</li>
                            <li><code>y</code>: returns <code>int</code>, the north/south component (north (-1) -> south (1))</li>
                            <li><code>Direction.NORTH\SOUTH\EAST\WEST\NORTH_EAST\NORTH_WEST\SOUTH_EAST\SOUTH_WEST</code></li>
                            <li><code>Direction.OMNI</code> - returned when you are at a location and do directionTo that same location.</li>
                        </ul>
                        <Accordion>
                            <Panel header="bool equals(Direction d)" eventKey="1">
                                Returns true if this direction equals d.
                            </Panel>
                            <Panel header="Direction rotateLeft()" eventKey="2">
                                Returns the direction to the left. Ie NORTH.rotateLeft() -> NORTH_WEST
                            </Panel>
                            <Panel header="Direction rotateRight()" eventKey="3">
                                Returns the direction to the right. Ie NORTH.rotateRight() -> NORTH_EAST
                            </Panel>
                            <Panel header="Direction opposite()" eventKey="4">
                                Returns the opposite direction. Ie NORTH.opposite() -> SOUTH
                            </Panel>
                            <Panel header="bool isDiagonal()" eventKey="5">
                                Returns true if this direction is not cardinal.
                            </Panel>
                            <Panel header="String toString()" eventKey="6">
                                Returns the string representation of this direction.
                            </Panel>
                            <Panel header="Direction randomDirection()" eventKey="7">
                                Returns a random direction (not including OMNI).
                            </Panel>
                        </Accordion>
                    </Panel>
                    <Panel header="GameConstants" eventKey="4">
                        <b>Access through GameContants.VAR_NAME</b>
                        <ul className="list-unstyled">
                            <li><code>MIN_RANGED_ATTACK_RADIUS_SQUARED</code>: 16</li>
                            <li><code>MAX_RANGED_ATTACK_RADIUS_SQUARED</code>: 49</li>
                            <li><code>MAX_MAGIC_ATTACK_RADIUS_SQUARED</code>: 25</li>
                            <li><code>MAGIC_ATTACK_SPLASH_PERCENTAGE</code>: .75</li>
                            <li><code>MAX_MELEE_ATTACK_RADIUS_SQUARED</code>: 2</li>
                            <li><code>SENSE_EXIT_THRESHOLD</code>: 144</li>
                            <li><code>PLAYER_MOVE_DELAY</code>: 2</li>
                            <li><code>PLAYER_HEAL_POWER</code>: 10</li>
                            <li><code>PLAYER_HEAL_DELAY</code>: 20</li>
                            <li><code>PLAYER_MELEE_POWER</code>: 20</li>
                            <li><code>PLAYER_MELEE_DELAY</code>: 2</li>
                            <li><code>PLAYER_MAGIC_POWER</code>: 8</li>
                            <li><code>PLAYER_MAGIC_DELAY</code>: 4</li>
                            <li><code>PLAYER_RANGED_POWER</code>: 18</li>
                            <li><code>PLAYER_RANGED_DELAY</code>: 3</li>
                        </ul>
                    </Panel>
                    <Panel header="UnitInfo" eventKey="5">
                        <b>Values are static, check them again for new values</b>
                        <ul className="list-unstyled">
                            <li><code>name</code> the name of the unit.</li>
                            <li><code>type</code> the symbol of the unit.</li>
                            <li><code>hp</code> the current hp of the unit.</li>
                            <li><code>maxHp</code> the maxHp of that unit.</li>
                            <li><code>canBeHealed</code> indicates if the unit can be healed.</li>
                            <li><code>location</code> the maplocation of the unit when you sensed it.</li>
                            <li><code>delay</code> the current delay of the unit (can't act until delay less than 1).</li>
                            <li><code>movementDelay</code> the delay incurred by movement.</li>
                            <li><code>healPower</code> how much HP the unit can heal.</li>
                            <li><code>healDelay</code> how much delay is incurred by healing (0 if can't heal).</li>
                            <li><code>active</code>true/false a unit will not move or attack if it is not active. Units remain active until they are attacked, see you, or are alerted to your presence</li>
                            <li><code>meleeAttackPower</code> how much damage a melee attack does.</li>
                            <li><code>meleeAttackDelay</code> how much delay is incurred by melee attack (0 if can't attack).</li>
                            <li><code>magicAttackPower</code> how much damage a magic attack does.</li>
                            <li><code>magicAttackDelay</code> how much delay is incurred by magic attack (0 if can't attack).</li>
                            <li><code>rangedAttackPower</code> how much damage a ranged attack does.</li>
                            <li><code>rangedAttackDelay</code> how much delay is incurred by a ranged attack (0 if can't attack).</li>
                            <li><code>sensorRadiusSquared</code> how far the unit can see.</li>
                            <li><code>alertRadiusSquared</code> once the unit sees you, it alerts nearby allies in this range.</li>
                            <li><code>spawnDelay</code> how many turns after spawning a unit this unit can spawn another.</li>
                            <li><code>currentSpawnDelay</code> how many turns until next unit is spawned.</li>
                            <li><code>spawnedUnitType</code> what type of unit will be spawned.</li>
                        </ul>
                    </Panel>
                </Accordion>
            </Well>
        );
    }

});


var SplashScreen = React.createClass({
    setAdventure: function() {
        this.props.setGameMode(ADVENTURE);
    },
    setTutorial: function() {
        this.props.setGameMode(TUTORIAL);
    },
    render: function() {
        var titleStyle = {fontSize: "400px",
                        width: "100%"
                        };
        return (
            <div>
                <div className="text-center">
                    <span style={titleStyle}>@</span><br />
                    <h1>Welcome to <code>Rogue AI Dungeon!</code></h1>
                </div>
                <br />
                <div className="container lead">
                    <div className="col-md-8 col-md-offset-2">
                        Far fields. Many dungeons. Much monsters. And let's not forget <code>javascript</code>! This
                        is a code-your-own-adventure take on a classic game. How far can you get?
                        <br />
                        <br />
                        <div className="text-center">
                            <ButtonToolbar>
                                <Button onClick={this.setTutorial} className="btn-lg">Tutorial</Button>
                                <Button onClick={this.setAdventure} className="btn-lg">Adventure</Button>
                            </ButtonToolbar>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});


var BetweenLevelContent = React.createClass({
    render: function() {
        if (this.props.mode === ADVENTURE) {
            return this.renderAdventure();
        } else {
            return this.renderTutorial();
        }

    },
    renderAdventure: function() {
        return (
            <Well>
                <p>{this.props.message}</p>
                <br />
                <p>Press Run to Continue</p>
                <br />
            </Well>
        );
    },
    renderTutorial: function() {
        var source = TutorialVerbage(this.props.level);
        return (
            <Well>
                <h3>{this.props.message}</h3>
                <ReactMarkdown source={source} />
                <p>Good luck!</p>
                <p>Press <strong>Run</strong> to Continue</p>
            </Well>
        );
    }
});


var Raid = React.createClass({
    getInitialState: function() {
        var gR = new GameRunner(this.renderUI, GameConstants.RENDER_WITH_CANVAS ? this.renderCanvas : null);
        var canvas = document.createElement('canvas');
        canvas.width = GraphicsConstants.FX_VIEWPORT_CANVAS_WIDTH;
        canvas.height = GraphicsConstants.FX_VIEWPORT_CANVAS_HEIGHT;
        canvas.style.cssText = "width: 100%; height: 100%;";
        return {
            "gameRunner": gR,
            "game": null,
            "mode": null,
            "level": 1,
            "message": "Welcome!",
            "renderer": GameConstants.RENDER_WITH_CANVAS ? "canvas" : "table",
            "canvas": canvas,
            "currentZoomFactor": GraphicsConstants.FX_VIEWPORT_DEFAULT_ZOOM_FACTOR,
            "gameRenderer": new GameRenderer(canvas),
            "playerCode": JSON.parse(localStorage.getItem("playerCode")) || samplePlayer.join('\n')
        }
    },
    onPlayerCodeUpdate: function(playerCode) {
        localStorage.setItem("playerCode", JSON.stringify(playerCode));
        this.setState({"playerCode": playerCode});
    },
    compileAndStart: function(playerCode) {
        var playerCreator = CompilePlayerCode(playerCode);
        this.state.gameRunner.setPlayerCreator(playerCreator);
        this.startGame();
    },
    getCanvasWidth: function() {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        w = Math.min(1107, w);
        var canvasWidth = w;
        if (w > 1000) {
            canvasWidth = 652; /* Based on min width for containing col-lg-7 */
        } else {
            canvasWidth *= .85;
        }
        return canvasWidth;
    },
    startGame: function() {
        this.state.gameRunner.createNewGame(this.state.level, this.state.mode === TUTORIAL);
        GAReporter.levelStart(this.state.mode, this.state.level);
        this.setState({"game": this.state.gameRunner.game});
        this.state.gameRunner.play();
    },
    renderUI: function(game) {
        if (!this.state.game) {
            return;
        }
        if (this.state.gameRunner.gameOver()) {
            if (this.state.gameRunner.won()) {
                this.state.gameRunner.updateScore({event: ScoreEvent.MAP_CLEARED, state: this.state});
                GAReporter.levelComplete(this.state.mode, this.state.level, this.state.game.round);
                this.setState({
                    "level": this.state.level + 1,
                    "game": null,
                    "message": "Congratulations! On to the next level"
                });
            } else {
                this.setState({"finalScore": this.state.gameRunner.scoreManager.getScore()});
                this.state.gameRunner.scoreManager.reset();
                GAReporter.levelGameOver(this.state.mode, this.state.level, this.state.game.round);
                if (this.state.mode === TUTORIAL) {
                    this.setState({
                        "game": null,
                        "message": "Game Over! Try again?"
                    })
                } else {
                    this.setState({
                        "level": 1,
                        "game": null,
                        "message": "Game Over! Try again?"
                    })
                }

            }
        } else {
            this.setState({"game": game});
        }
    },
    renderCanvas: function(gameState){
        this.state.gameRenderer.render(gameState);
    },
    setGameMode: function(mode) {
        GAReporter.startNewGame(mode);
        this.setState({"mode": mode});
    },
    setSpeed: function(speed) {
        this.state.gameRunner.setSpeed(speed);
    },
    setZoom: function(zoomFactor){
        this.state.currentZoomFactor = zoomFactor;
        this.state.gameRenderer.setZoom(this.state.currentZoomFactor);
        this.renderCanvas(this.state.game);
    },
    render: function() {
        if (this.state.mode) {
            return this.renderGame()
        } else {
            return (<SplashScreen setGameMode={this.setGameMode} />);
        }
    },
    play: function() {
        this.state.gameRunner.play();
    },
    pause: function() {
        this.state.gameRunner.pause();
    },
    step: function() {
        this.state.gameRunner.step();
    },
    renderGame: function() {
        var score = this.state.finalScore || this.state.gameRunner.scoreManager.getScore();
        var mainContent = (
            <BetweenLevelContent
                level={this.state.level}
                mode={this.state.mode}
                message={this.state.message}
            />
        );
        var sideContent = (
            <Row>
                <Col lg={12} md={12} xs={12}>
                    <GameController
                        level={this.state.level}
                        mode={this.state.mode}
                        score={score}
                        compile={this.compileAndStart}
                        playerCode={this.state.playerCode}
                    />
                </Col>
            </Row>
        );
        if (this.state.game) {
            var nearbyUnits = this.state.game.player.player.pc.senseNearbyUnits();
            var closestUnit = null;
            var closetUnitDistSq = 10000;
            for (var i = 0; i < nearbyUnits.length; i++) {
                var d = nearbyUnits[i].location.distanceSquaredTo(this.state.game.player.location);
                if (d < closetUnitDistSq) {
                    closestUnit = nearbyUnits[i];
                    closetUnitDistSq = d;
                }
            }
            // Setup renderer
            var renderer = null;
            if(this.state.renderer == "canvas"){
                mainContent = (
                        <CanvasRenderer 
                            canvas={this.state.canvas}
                            setZoom={this.setZoom}
                            currentZoomFactor={this.state.currentZoomFactor} />
                    );
            }else{
                mainContent = (
                        <TableRenderer
                            width={this.state.game.map.width}
                            height={this.state.game.map.height}
                            exit={this.state.game.map.exit}
                            gameId={this.state.game.id}
                            terrain={this.state.game.map.terrain}
                            cssClass={this.state.game.map.cssClass}
                            units={this.state.game.map.units}
                            playerLoc={this.state.game.player.location}
                            />
                    );
            }
            sideContent = (
                <Row>
                    <Col lg={12} md={4} xs={12}>
                        <GameController
                            level={this.state.level}
                            mode={this.state.mode}
                            score={score}
                            setSpeed={this.setSpeed}
                            game={this.state.game}
                            paused={this.state.gameRunner.paused}
                            play={this.play}
                            pause={this.pause}
                            step={this.step}
                            compile={this.compileAndStart}
                            playerCode={this.state.playerCode}
                        />
                    </Col>
                    <Col lg={6} md={4} xs={6}>
                        <UnitStats unit={this.state.game.player} score={this.state.gameRunner.getScore()} />
                    </Col>
                    <Col lg={6} md={4} xs={6}>
                        <UnitStats unit={closestUnit} />
                    </Col>
                </Row>
            );
        }
        return (
            <Grid>
                <Row>
                    <Col lg={7} md={12} xs={12}>
                        {mainContent}
                    </Col>
                    <Col lg={5} md={12} xs={12}>
                        {sideContent}
                    </Col>
                </Row>

                <Row>
                    <Col xs={12} md={7} lg={7}>
                        <AceEditor
                            name="playerText"
                            mode="javascript"
                            theme="chrome"
                            width="100%"
                            fontSize={12}
                            showPrintMargin={false}
                            highlightActiveLine={true}
                            maxLines={50}
                            tabSize={2}
                            value={this.state.playerCode}
                            onChange={this.onPlayerCodeUpdate}
                            editorProps={{$blockScrolling: Infinity}}
                            label="RaidPlayer.js"
                            ref="playerText"
                        />
                    </Col>
                    <Col xs={12} md={5} lg={5}>
                        <API />
                    </Col>
                </Row>
            </Grid>
        );
    }
});

ReactDOM.render(
    <Raid />,
    document.getElementById("content")
);