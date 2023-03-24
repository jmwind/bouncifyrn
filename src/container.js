import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import MainMenu from './components/menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncifyGame from './game';
import {Config} from './config';
import utils from './utils';

const TOP_SCORE_KEY = 'topScore';
const TOP_SCORE_BRICKS_KEY = 'topScoreBricks';

export default class Container extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      lastScore: 0,
      topScore: 0,
      topScoreBricks: 0,
      gamesPlayed: 0,
      mode: Config.MODE_LINES,
    };
    utils.initializeGameSizing();
  }

  componentDidMount() {
    AsyncStorage.getItem(TOP_SCORE_KEY).then(val => {
      if (val != null) {
        this.setState({topScore: parseInt(val, 10)});
      }
    });
    AsyncStorage.getItem(TOP_SCORE_BRICKS_KEY).then(val => {
      if (val != null) {
        this.setState({topScoreBricks: parseInt(val, 10)});
      }
    });
  }

  toggleGame = (gameStarted, lastScore, mode) => {
    this.setState({
      gameStarted,
      mode,
    });
    if (!gameStarted) {
      this.setState({
        gamesPlayed: this.state.gamesPlayed + 1,
        lastScore: lastScore,
      });
      if (mode === Config.MODE_LINES && lastScore > this.state.topScore) {
        this.setState({
          topScore: lastScore,
        });
        AsyncStorage.setItem(TOP_SCORE_KEY, lastScore.toString());
      } else if (
        mode === Config.MODE_BRICKS &&
        lastScore > this.state.topScoreBricks
      ) {
        this.setState({
          topScoreBricks: lastScore,
        });
        AsyncStorage.setItem(TOP_SCORE_BRICKS_KEY, lastScore.toString());
      }
    }
  };

  render() {
    const {
      gamesPlayed,
      lastScore,
      topScore,
      topScoreBricks,
      gameStarted,
      mode,
    } = this.state;
    return (
      <View style={styles.container}>
        <MainMenu
          onPlayGame={new_mode => this.toggleGame(true, lastScore, new_mode)}
          gamesPlayed={gamesPlayed}
          lastScore={lastScore}
          topScore={topScore}
          topScoreBricks={topScoreBricks}
        />
        <BouncifyGame
          visible={gameStarted}
          topScore={mode === Config.MODE_LINES ? topScore : topScoreBricks}
          mode={mode}
          onClose={score => this.toggleGame(false, score, mode)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
