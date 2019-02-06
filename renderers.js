import React, { PureComponent } from "react";
import { StyleSheet, View, Dimensions } from "react-native";

export const RADIUS = 10;
export const COLORS = ["#86E9BE", "#8DE986", "#B8E986", "#E9E986"];

class Finger extends PureComponent {
  render() {
    const x = this.props.position[0] - RADIUS / 2;
    const y = this.props.position[1] - RADIUS / 2;
    return (
      <View style={[styles.finger, { left: x, top: y }]} />
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
                    backgroundColor: "pink"
                }
                }
            />
        );
    }
}

const styles = StyleSheet.create({
  finger: {
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: RADIUS * 2,
    width: RADIUS * 2,
    height: RADIUS * 2,
    backgroundColor: "white",
    position: "absolute"
  }
});

export { Finger, Floor };