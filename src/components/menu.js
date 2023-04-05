import React, {PureComponent} from 'react';
import {ScrollView, View, Linking, StyleSheet, Text} from 'react-native';
import Button from './button';
import Item from './item';
import {Config} from '../config';
import * as Animatable from 'react-native-animatable';
import Utils from './../utils';

export default class MainMenu extends PureComponent {
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {this.props.gamesPlayed === 0 && (
          <Animatable.Text
            style={styles.title}
            animation="pulse"
            iterationCount="infinite"
            direction="alternate">
            Bouncify
          </Animatable.Text>
        )}
        {this.props.gamesPlayed > 0 && (
          <View>
            <View style={styles.lastScoreContainer}>
              <Text style={styles.bestScoreTitle}>Last Score</Text>
              <Text style={styles.bestScoreValue}>{this.props.lastScore}</Text>
            </View>
            <View style={styles.bestcontainer}>
              <View
                style={[
                  styles.scoreContainer,
                  {backgroundColor: Utils.hitsToColor(0)},
                ]}>
                <Text style={styles.scoreTitle}>Top Lines</Text>
                <Text style={styles.scoreValue}>{this.props.topScore}</Text>
              </View>
              <View
                style={[
                  styles.scoreContainer,
                  {backgroundColor: Utils.hitsToColor(20)},
                ]}>
                <Text style={styles.scoreTitle}>Top Bricks</Text>
                <Text style={styles.scoreValue}>
                  {this.props.topScoreBricks}
                </Text>
              </View>
            </View>
          </View>
        )}
        <Button onPress={_ => this.props.onPlayGame(Config.MODE_LINES)}>
          {this.props.gamesPlayed ? 'Restart Lines' : 'Play Lines'}
        </Button>
        <Button onPress={_ => this.props.onPlayGame(Config.MODE_BRICKS)}>
          {this.props.gamesPlayed ? 'Restart Bricks' : 'Play Bricks'}
        </Button>

        <Item
          style={styles.madeby}
          onPress={_ =>
            Linking.openURL('https://github.com/jmwind/bouncifyrn')
          }>
          by @jmwind
        </Item>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    maxWidth: 400,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  madeby: {
    marginTop: 40,
    backgroundColor: 'red',
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    fontSize: 70,
    color: '#FFF',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    elevation: 5,
  },
  lastScoreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,

    borderRadius: 10,
    elevation: 5,
    flexGrow: 0,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#262626',
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#262626',
  },
  bestScoreTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  bestScoreValue: {
    fontSize: 92,
    fontWeight: 'bold',
    color: 'white',
  },
  bestcontainer: {
    flex: 1,
    flexGrow: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
