import React, { PureComponent } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Line, Svg } from "react-native-svg";

export const RADIUS = 7;
export const COLORS = ["#86E9BE", "#8DE986", "#B8E986", "#E9E986"];

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
                <Text style={styles.currentscore}>{this.props.balls}</Text>               
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
                    strokeDashoffset="4"
                    strokeWidth={this.props.strokewidth}
                    />
                </Svg>
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
  }
});

export { Ball, Floor, ScoreBar, AimLine };