/**
 * This may be a terrible idea, but trying to build a game in react native that
 * will be fun to play. 
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { PureComponent } from "react";
import { StyleSheet, Modal } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { Ball, Floor, ScoreBar, FLOOR_HEIGHT, RADIUS } from "./renderers";
import { StartGame, MoveBall, SpawnBall, AimBallsStart, AimBallsRelease, CreateBallTail } from "./systems"
import utils from "./utils";

export default class BouncifyGame extends PureComponent {
  constructor() {
    super();
    this.state = {
      running: false,
      gameOver: false,
      lastScore: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      this.setState({
        running: true
      });
    }
  }

  gameOver = (score) => {
    this.setState({
      running: false,
      lastScore: score
    });

    setTimeout(() => {
      this.setState({
        gameOver: true
      });
      if (this.props.onClose) {
        this.props.onClose(this.state.lastScore);
      }
    }, 250);
  };

  handleEvent = ev => {
    if(ev.type == "game-over") {
        this.gameOver(ev.score);        
    }
  };

  render() {
    return (
      <Modal
        transparent={false}
        animationType="slide"
        visible={this.props.visible}        
      >
        <GameEngine
          style={styles.container}
          running={this.state.running}
          onEvent={this.handleEvent}
          // Systems are called during the animation loop and responsible for updating the game state (eg, entities)      
          systems={[StartGame, MoveBall, SpawnBall, AimBallsStart, AimBallsRelease, CreateBallTail]}
          // Entities are the objects in the game. The game emgine will iterate over the objects and call their renderer 
          // during each animation frame. Attributes are passed to each entity as props. This initial list of entities
          // is below but the bulk of the game happens witin the systems as they add/remove entities based on the 
          // state of the game.
          entities={{
            floor: { 
              height: FLOOR_HEIGHT, 
              renderer: <Floor /> },          
            scorebar: { 
              height: 90, 
              best: this.props.topScore, 
              state: "stopped", 
              level: 0, 
              balls: 1, 
              new_balls: 0, 
              balls_in_play: 0, 
              score: 0, 
              renderer: <ScoreBar />},               
            ball: { 
              color: "white", 
              state: "stopped", 
              start: utils.newPosition(300, FLOOR_HEIGHT - RADIUS*2), 
              position: utils.newPosition(300, FLOOR_HEIGHT - RADIUS*2), 
              speed: utils.newPosition(1.0, 1.0), 
              direction: utils.newPosition(0, 0), 
              renderer: <Ball />}          
            }}>
        </GameEngine>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020"
  }
});
