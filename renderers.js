import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Line, Svg } from "react-native-svg";

export const RADIUS = 7;
export const SCOREBOARD_HEIGHT = 90;
export const BOX_TILE_SIZE = 40;
export const BOX_TILE_SPACE = 6;

export const COLORS = [
    "#DFB44F", // yellow 1-10
    "#8CB453", // green 11-20
    "#EA225E", // red 21-30
];

function hitsToColor(hits) {
    if(hits <= 10) {
        return COLORS[0];
    } else if(hits <=20) {
        return COLORS[1];
    } else if(hits <= 30) {
        return COLORS[2];
    }
    return COLORS[0];    
}

export function colToLeftPosition(col) {
    return BOX_TILE_SPACE + ((col * BOX_TILE_SPACE) + (col * BOX_TILE_SIZE));
}

export function rowToTopPosition(row) {
    return SCOREBOARD_HEIGHT + BOX_TILE_SPACE + ((row * BOX_TILE_SPACE) + (row * BOX_TILE_SIZE));
}

class Ball extends PureComponent {
  render() {
    const x = this.props.position[0] - RADIUS / 2;
    const y = this.props.position[1] - RADIUS / 2;
    return (
      <View style={[styles.ball, { left: x, top: y, backgroundColor: this.props.color }]} />
    );
  }
}

class Floor extends PureComponent {
    render() {
        return (
            <View
                style={
                {
                    position: "absolute",
                    left: 0,
                    top: Dimensions.get("window").height - this.props.height,
                    width: Dimensions.get("window").width,
                    height: Dimensions.get("window").height,
                    backgroundColor: "#262626"
                }
                }
            />            
        );
    }
}

class ScoreBar extends PureComponent {
    render() {
        return (
            <View style={[styles.scorebar, {height: this.props.height}]}>
                <View style={[styles.bestcontainer, {top: this.props.height / 2 - 10}]}>                    
                    <Text style={styles.besttitle}>Best</Text>
                    <Text style={styles.bestscore}>{this.props.best}</Text>
                </View>                
                <Text style={styles.currentscore}>{this.props.level}</Text>
                <Text style={styles.currentscore}>{this.props.balls}/{this.props.balls - this.props.balls_in_play}</Text>               
            </View>
        );
    }
}

class AimLine extends PureComponent {
    render() {
        return (
            <View>                
                <Svg height={Dimensions.get("window").height} width={Dimensions.get("window").width}>
                    <Line
                    x1={this.props.start[0]}
                    y1={this.props.start[1]}
                    x2={this.props.end[0]}
                    y2={this.props.end[1]}
                    stroke="white"
                    strokeLinecap="round"
                    strokeDasharray={[5, 10]}
                    strokeDashoffset="6"
                    strokeWidth={this.props.strokewidth}
                    />
                </Svg>
            </View>
        );
    }    
}

class BoxTile extends PureComponent {
    render() {
        return (
            <View style={[styles.boxcontainer, {
                backgroundColor: hitsToColor(this.props.hits),
                top: rowToTopPosition(this.props.row),
                left: colToLeftPosition(this.props.col)
                }]}> 
                <Text style={{color: "#262626", fontSize: 16}}>
                    {this.props.hits}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  ball: {
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: RADIUS * 2,
    width: RADIUS * 2,
    height: RADIUS * 2,
    position: "absolute"
  },
  boxcontainer: {
    position: "absolute",
    width: BOX_TILE_SIZE,
    height: BOX_TILE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,    
  },
  scorebar: {
      position: "absolute",
      left: 0,
      top: 0,
      width: Dimensions.get("window").width,
      backgroundColor: "#262626"
  },
  bestcontainer: {      
      left: 60,                
  },
  besttitle: {
    fontSize: 14,
    color: 'white'
  },
  bestscore: {
    fontSize: 22,
    color: 'white'
  },
  currentscore: {
    left: Dimensions.get("window").width / 2 - 8,
    fontSize: 22,
    color: 'white'
  },
  ballcounter_container: {
    position: "absolute",
    left: 0,
    top: 0
  },
  ballcounter_text: {
    fontSize: 14,
    color: 'white'
  }
});

export { Ball, Floor, ScoreBar, AimLine, BoxTile };