import React, { PureComponent, Component } from "react";
import { StyleSheet, View, Text, Dimensions, Animated, Easing } from "react-native";
import { Svg, Circle, Text as SVGText } from "react-native-svg";
import Utils from "./utils";
import { Constants } from "./constants";
import * as Animatable from "react-native-animatable";
import Explosion from "./components/explosion";

class Ball extends PureComponent {
  render() {
    const x = this.props.position.x - (Constants.RADIUS / 2);
    const y = this.props.position.y - (Constants.RADIUS / 2);
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
        const {height, best, level, balls_in_play, balls} = this.props;
        let ball_count = balls == balls_in_play ? balls : balls - balls_in_play;
        return (
            <View style={[styles.scorebar, {height: height}]}>
                <View style={styles.bestcontainer}>                    
                    <Text style={styles.besttitle}>Best</Text>
                    <Text style={styles.bestscore}>{best}</Text>
                </View>  
                <View style={styles.levelcontainer}>              
                <Text style={styles.besttitle}>Level</Text>
                    <Text style={styles.currentscore}>{level}</Text>
                </View>
                <View style={styles.ballscontainer}>
                    <Text style={styles.besttitle}>Balls</Text>              
                    <Text style={styles.currentscore}>{ball_count}</Text>               
                </View>
            </View>
        );
    }
}

class AimLine extends PureComponent {
    render() {
        const {start, end} = this.props;
        const drawLength = 1.0; // Ratio of aim vector to display
        const numCircles = 20;
        let delta = Utils.getPointsDeltas(start, end);
        let length = Utils.getDistance(start, end);
        if (length == 0) {
            return null
        }
        let RADIUS = Constants.RADIUS;
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;
        let radius = Math.min(RADIUS*2/3, Math.max(RADIUS/2, RADIUS * length/(height/2))) ;

        let circles = Array(numCircles).fill().map((_, i) => {
            let start = this.props.start;
            let spacing = delta.x / numCircles;            
            
            // check screen upper and sound bounds and bounce the aim line off the surface
            let x = start.x + (spacing * i * drawLength);
            if(x > width) {
                x -= (x - width) * 2;              
            }
            if(x < 0) {
                x += (-x) * 2;              
            }
            let y = start.y + (((delta.y) / numCircles) * i * drawLength);
            if(y < (Constants.SCOREBOARD_HEIGHT)) {
                y -= (y - Constants.SCOREBOARD_HEIGHT) * 2;
            }
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

class SpeedUpButton extends PureComponent {    
    render() {
        const {speed, row, column, available} = this.props;        
        return(
            available &&
            <View style={[styles.boxcontainer, {
                    top: Utils.rowToTopPosition(row),
                    left: Utils.colToLeftPosition(column)
                    }]}>
                <Animatable.Text 
                style={{color: "white", fontSize: 20}} animation="pulse" 
                iterationCount="infinite" direction="alternate">
                    {speed}x
                </Animatable.Text>                   
            </View>            
        );
    }
}

class BoxTile extends PureComponent {

    state = {
        animateTop: new Animated.Value(Utils.rowToTopPosition(0)),
        animateOpacity: new Animated.Value(0),
        animated: false,
        explode: false
    }

    componentWillUnmount() {
        if(this.rowAnimation) this.rowAnimation.stop();
        if(this.hitAnimation) this.hitAnimation.stop();
    }

    componentWillReceiveProps(nextProps) {
        // Advance to next row and if game starting advance from top
        if(!this.state.animated || this.props.row != nextProps.row) {
            let starting_row = this.state.animated ? this.props.row : 0;
            this.state.animateTop = new Animated.Value(Utils.rowToTopPosition(starting_row));            
            this.rowAnimation = Animated.spring(this.state.animateTop, {
                toValue: Utils.rowToTopPosition(nextProps.row),                
                bounciness: 10,
                speed: 8
              });
              this.rowAnimation.start();
            this.setState({animated: true});
        } else if(this.props.explode != nextProps.explode) {
            this.setState({explode: true});
        } else if(this.props.hits != nextProps.hits) {            
            this.hitAnimation = Animated.timing(this.state.animateOpacity, {
                toValue: 0.6,
                easing: Easing.linear,
                duration: 50
            });
            this.hitAnimation.start(() => {
                this.hitAnimation = Animated.timing(this.state.animateOpacity, {
                    toValue: 0,
                    easing: Easing.linear,
                    duration: 50
                    }).start();    
            }); 
        }
    }

    render() {
        const {hits, col, row} = this.props;
        const {explode, animateTop, animateOpacity} = this.state;
        let opacity = 1;
        opacity = animateOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0]
        });  
        if(explode) {       
            return (     
                <Explosion 
                    backgroundColor={Utils.hitsToColor(hits)} 
                    count={50} 
                    origin={{x: Utils.colToLeftPosition(col), y: Utils.rowToTopPosition(row)}} />            
            );
        } else {
            return (               
                <Animated.View style={[styles.boxcontainer, {
                    backgroundColor: Utils.hitsToColor(hits),
                    top: animateTop,
                    left: Utils.colToLeftPosition(col),
                    opacity: opacity
                    }]}> 
                    <Text style={{color: "#262626", fontSize: 16}}>
                        {hits}
                    </Text>
                </Animated.View>
            );
        }
    }
}

class BallPowerUp extends PureComponent {

    state = {
        animateTop: new Animated.Value(Utils.rowToTopPosition(0)),
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
        this.state.anim_radius.removeAllListeners();
    }

    componentWillReceiveProps(nextProps) {
        // Animate down to the floor when hit by the ball
        if(nextProps.falling && this.props.falling != nextProps.falling) {
            this.state.animateTop = new Animated.Value(Utils.rowToTopPosition(this.props.row));
            this.animTopListener = this.state.animateTop.addListener(({value}) => {this.topPosition = value});  
            this.dropAnimation = Animated.timing(this.state.animateTop, {
                toValue: Constants.FLOOR_HEIGHT - Constants.BOX_TILE_SIZE + 10,
                easing: Easing.back(),
                duration: 700,
              });
              this.dropAnimation.start(); 
        // Animate into the next row when moving to next level       
        } else if(!this.state.animated || this.props.row != nextProps.row) {
            let starting_row = this.state.animated ? this.props.row : 0;
            this.state.animateTop = new Animated.Value(Utils.rowToTopPosition(starting_row));            
            this.rowAnimation = Animated.spring(this.state.animateTop, {
                toValue: Utils.rowToTopPosition(nextProps.row),                
                bounciness: 10,
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
                duration: Utils.randomValueRounded(600, 900)
            });
            this.collectAnimation.start();
        }
    }

    render() { 
        let color = !this.props.falling ? "white" : "#8CB453";   
        let topPosition = this.state.animateTop;
        let leftPosition = Utils.colToLeftPosition(this.props.col);
        let opacity = 1;
        let BOX_TILE_SIZE = Constants.BOX_TILE_SIZE;
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
    borderRadius: Constants.RADIUS * 2,
    width: Constants.RADIUS * 2,
    height: Constants.RADIUS * 2,
    position: "absolute"
  },
  boxcontainer: {
    position: "absolute",
    width: Constants.BOX_TILE_SIZE,
    height: Constants.BOX_TILE_SIZE,
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

export { Ball, Floor, ScoreBar, AimLine, BoxTile, BallPowerUp, SpeedUpButton };