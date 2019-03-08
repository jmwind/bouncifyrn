import React, { PureComponent, Component } from "react";
import { StyleSheet, View, Text, Dimensions, Animated, Easing } from "react-native";
import { Svg, Circle, Text as SVGText } from "react-native-svg";
import utils from "./utils";
import Explosion from "./components/explosion";

export const RADIUS = 7;
export const SCOREBOARD_HEIGHT = 90;
export const BOX_TILE_SIZE = 40;
export const BOX_TILE_SPACE = 6;
export const FLOOR_HEIGHT = 640;

export const COLORS = [
    "#DFB44F", // yellow 1-10
    "#8CB453", // green 11-20
    "#EA225E", // red 21-30,
    "#59B9F9", // light blue 31-50,
    "#265BF6", // darker blue 51-99,
    "#7112F5", // purple 100-150 
    "#449b8e", // dull green 151+
];

function hitsToColor(hits) {
    if(hits <= 10) {
        return COLORS[0];
    } else if(hits <=20) {
        return COLORS[1];
    } else if(hits <= 30) {
        return COLORS[2];
    } else if(hits <= 50) {
        return COLORS[3]
    } else if(hits <= 99) {
        return COLORS[4];
    } else if(hits <= 150) {
        return COLORS[5];
    }
    return COLORS[6];    
}

/**
 * Box tiles deal in colum and row number only. These help map row/col to top/left positions
 * for the boxes.
 */
export function colToLeftPosition(col) {
    return BOX_TILE_SPACE + ((col * BOX_TILE_SPACE) + (col * BOX_TILE_SIZE));
}

export function rowToTopPosition(row) {
    return SCOREBOARD_HEIGHT + BOX_TILE_SPACE + ((row * BOX_TILE_SPACE) + (row * BOX_TILE_SIZE));
}

class Ball extends PureComponent {
  render() {
    const x = this.props.position.x - RADIUS / 2;
    const y = this.props.position.y - RADIUS / 2;
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
                    top: this.props.height,
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
                <View style={styles.bestcontainer}>                    
                    <Text style={styles.besttitle}>Best</Text>
                    <Text style={styles.bestscore}>{this.props.best}</Text>
                </View>  
                <View style={styles.levelcontainer}>              
                <Text style={styles.besttitle}>Level</Text>
                    <Text style={styles.currentscore}>{this.props.level}</Text>
                </View>
                <View style={styles.ballscontainer}>
                    <Text style={styles.besttitle}>Balls</Text>              
                    <Text style={styles.currentscore}>{this.props.balls - this.props.balls_in_play}</Text>               
                </View>
            </View>
        );
    }
}

class AimLine extends PureComponent {
    render() {
        const drawLength = 1.0; // Ratio of aim vector to display
        const numCircles = 12;
        let delta = utils.getPointsDeltas(this.props.start, this.props.end);
        let length = utils.getDistance(this.props.start, this.props.end);
        if (length == 0) {
            return null
        }

        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;
        let radius = Math.min(RADIUS*2/3, Math.max(RADIUS/2, RADIUS * length/(height/2))) ;

        let circles = Array(numCircles).fill().map((_, i) => {
            let start = this.props.start;
            let x = start.x + (((delta.x) / numCircles) * i * drawLength);
            let y = start.y + (((delta.y) / numCircles) * i * drawLength);
            return (<Circle key={i} cx={x} cy={y} r={radius} fill="white"/>)
        });

        return (
            <View>
                <Svg width={width} height={height}>
                    {circles}
                </Svg>
            </View>
        );
    }
}

class BoxTile extends PureComponent {

    state = {
        animateTop: new Animated.Value(rowToTopPosition(0)),
        animated: false,
        explode: false
    }

    componentWillUnmount() {
        if(this.rowAnimation) this.rowAnimation.stop();
    }

    componentWillReceiveProps(nextProps) {
        // Advance to next row and if game starting advance from top
        if(!this.state.animated || this.props.row != nextProps.row) {
            let starting_row = this.state.animated ? this.props.row : 0;
            this.state.animateTop = new Animated.Value(rowToTopPosition(starting_row));            
            this.rowAnimation = Animated.spring(this.state.animateTop, {
                toValue: rowToTopPosition(nextProps.row),                
                bounciness: 8,
                speed: 8
              });
              this.rowAnimation.start();
            this.setState({animated: true});
        } else if(this.props.explode != nextProps.explode) {
            this.setState({explode: true});
        }
    }

    render() {
        if(this.state.explode) {       
            return (     
                <Explosion 
                    backgroundColor={hitsToColor(this.props.hits)} 
                    count={30} 
                    origin={{x: colToLeftPosition(this.props.col), y: rowToTopPosition(this.props.row)}} />            
            );
        } else {
            return (               
                <Animated.View style={[styles.boxcontainer, {
                    backgroundColor: hitsToColor(this.props.hits),
                    top: this.state.animateTop,
                    left: colToLeftPosition(this.props.col)
                    }]}> 
                    <Text style={{color: "#262626", fontSize: 16}}>
                        {this.props.hits}
                    </Text>
                </Animated.View>
            );
        }
    }
}

class BallPowerUp extends PureComponent {

    state = {
        animateTop: new Animated.Value(rowToTopPosition(0)),
        anim_radius: new Animated.Value(12),
        animated: false,
        radius: 12
    }

    componentDidMount() {
        // Breathing animation of outer circle       
        this.animListener = this.state.anim_radius.addListener(({value}) => this.setState({radius: value}));        
        this.breathAnimation = Animated.loop(
            Animated.sequence([
              Animated.timing(this.state.anim_radius, {
                toValue: 14,
                duration: 100,
                ease: Easing.linear,
                useNativeDriver: true
              }),
              Animated.timing(this.state.anim_radius, {
                toValue: 12,
                duration: 100,
                ease: Easing.linear,
                useNativeDriver: true
              })
            ])
          );
          this.breathAnimation.start();
    }

    componentWillUnmount() {
        if(this.rowAnimation) this.rowAnimation.stop();
        if(this.dropAnimation) this.dropAnimation.stop();
        if(this.breathAnimation) this.breathAnimation.stop();
        if(this.collectAnimation) this.collectAnimation.stop();
        this.state.animateTop.removeAllListeners();
    }

    componentWillReceiveProps(nextProps) {
        // Animate down to the floor when hit by the ball
        if(nextProps.falling && this.props.falling != nextProps.falling) {
            this.state.animateTop = new Animated.Value(rowToTopPosition(this.props.row));
            this.animTopListener = this.state.animateTop.addListener(({value}) => {this.topPosition = value});  
            this.dropAnimation = Animated.timing(this.state.animateTop, {
                toValue: FLOOR_HEIGHT - BOX_TILE_SIZE + 10,
                easing: Easing.back(),
                duration: 700,
              });
              this.dropAnimation.start(); 
        // Animate into the next row when moving to next level       
        } else if(!this.state.animated || this.props.row != nextProps.row) {
            let starting_row = this.state.animated ? this.props.row : 0;
            this.state.animateTop = new Animated.Value(rowToTopPosition(starting_row));            
            this.rowAnimation = Animated.spring(this.state.animateTop, {
                toValue: rowToTopPosition(nextProps.row),                
                bounciness: 8,
                speed: 2
              });
            this.rowAnimation.start();
            this.setState({animated: true});
        // Animate +1 when current level finished and powerup is on the floor
        } else if(nextProps.collecting && this.props.collecting != nextProps.collecting) {
            this.state.animateCollection = new Animated.Value(0);
            this.collectAnimation = Animated.timing(this.state.animateCollection, {
                toValue: 1,
                easing: Easing.linear,
                duration: utils.randomValueRounded(400, 800)
            });
            this.collectAnimation.start();
        }
    }

    render() { 
        let color = !this.props.falling ? "white" : "#8CB453";   
        let topPosition = this.state.animateTop;
        let leftPosition = colToLeftPosition(this.props.col);
        let opacity = 1;
        if(this.props.collecting) {
            topPosition = this.state.animateCollection.interpolate({
                inputRange: [0, 1],
                outputRange: [this.topPosition, this.topPosition - 500]
            });   
            opacity = this.state.animateCollection.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              });  
        } 
        return (
            <Animated.View style={[styles.boxcontainer, {
                top: topPosition,
                left: leftPosition,
                opacity: opacity
                }]}>
                <Svg height={BOX_TILE_SIZE} width={BOX_TILE_SIZE} >
                    {!this.props.falling && 
                    <Circle
                            cx={BOX_TILE_SIZE / 2}
                            cy={BOX_TILE_SIZE / 2}
                            r={this.state.radius}
                            stroke={color}
                            strokeWidth="3"
                            fill="#202020"
                        />
                    }
                    {!this.props.collecting &&
                    <Circle
                        cx={BOX_TILE_SIZE / 2}
                        cy={BOX_TILE_SIZE / 2}
                        r="7"
                        stroke={color}
                        fill={color}
                    />
                    }
                    {this.props.collecting &&
                    <SVGText
                        dx={BOX_TILE_SIZE / 2}
                        dy={BOX_TILE_SIZE / 2}
                        stroke={color}
                        fill={color}
                        opacity={opacity}
                    >+1
                    </SVGText>
                    }
                </Svg>
            </Animated.View>
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
      flex: 1,
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'space-between',
      width: Dimensions.get("window").width,
      backgroundColor: "#262626"
  },
  bestcontainer: {  
    flex: 1,
    alignItems: 'center',  
    marginBottom: 5,    
    justifyContent: 'flex-end'              
  },
  levelcontainer: {   
    flex: 1,
    alignItems: 'center',   
    marginBottom: 5,    
    justifyContent: 'flex-end'           
  },
  ballscontainer: { 
    flex: 1,
    alignItems: 'center',
    marginBottom: 5,    
    justifyContent: 'flex-end'           
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
    fontSize: 22,
    color: 'white'
  },
  ballpowerupcontainer: {
    position: 'absolute',
    left: 100,    
    top: 100,
    alignItems: 'center',
    backgroundColor: "#202020"
  },
  ballpowerup: {
    position: 'absolute',
    flex: 1
  }
});

export { Ball, Floor, ScoreBar, AimLine, BoxTile, BallPowerUp };