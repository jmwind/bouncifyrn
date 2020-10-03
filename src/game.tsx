import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Modal} from 'react-native';
// @ts-ignore - react-native-game-engine has no TS definitions
import {GameEngine} from 'react-native-game-engine';
// import {Ball, Floor, ScoreBar, SpeedUpButton} from './renderers';
import {
  StartGame,
  MoveBall,
  SpawnBall,
  AimBallsStart,
  AimBallsRelease,
  CreateBallTail,
  SpeedUp,
} from './systems';
import Utils from './utils';
import {GameMode} from './config';

interface GameProps {
  topScore: number;
  mode: GameMode;
  visible: boolean;
  onClose: (lastScore: number) => unknown;
}

export default function BouncifyGame(props: GameProps) {
  const [running, setRunning] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const entities = useRef(Utils.newGameEntities(props.topScore, props.mode));

  useEffect(() => {
    setRunning(props.visible);
  }, [props.visible]);

  useEffect(() => {
    entities.current.scorebar.mode = props.mode;
    if (props.mode === GameMode.MODE_BRICKS) {
      entities.current.scorebar.balls = 75;
    } else {
      entities.current.scorebar.balls = 1;
    }
  }, [props.mode]);

  useEffect(() => {
    entities.current.scorebar.best = props.topScore;
  }, [props.topScore]);

  const gameOver = (score: number) => {
    setLastScore(score);

    setTimeout(() => {
      setRunning(false);
      entities.current.scorebar.level = 0;
      entities.current.scorebar.balls = 1;
      if (props.onClose) {
        props.onClose(lastScore);
      }
    }, 250);
  };

  // FIXME: add type definitions for event
  const handleEvent = (ev: any) => {
    if (ev.type === 'game-over') {
      gameOver(ev.score);
    }
  };

  return (
    <Modal transparent={false} animationType="slide" visible={running}>
      <GameEngine
        style={styles.container}
        running={running}
        onEvent={handleEvent}
        // Systems are called during the animation loop and responsible for updating the game state (eg, entities)
        systems={[
          StartGame,
          MoveBall,
          SpawnBall,
          AimBallsStart,
          AimBallsRelease,
          CreateBallTail,
          SpeedUp,
        ]}
        // Entities are the objects in the game. The game engine will iterate over the objects and call their renderer
        // during each animation frame. Attributes are passed to each entity as props. This initial list of entities
        // is below but the bulk of the game happens within the systems as they add/remove entities based on the
        // state of the game.
        entities={entities.current}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
  },
});
