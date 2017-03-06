function Tile(props) {
    this.name = props.name;
    this.passable = props.passable;
    this.cssClass = props.cssClass;
    this.type = props.type;
}

module.exports = Tile;