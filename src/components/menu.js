import React, { PureComponent } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Platform,
  StyleSheet
} from "react-native";
import Button from "./button";
import Item from "./item";

export default class MainMenu extends PureComponent {
  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Button onPress={this.props.onPlayGame}>Play</Button>
        <Item
          onPress={_ =>
            Linking.openURL(
              "https://github.com/jmwind/bouncifyrn"
            )}
        >
          Shopify React Native Game Hack
        </Item>               
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  contentContainer: {
    maxWidth: 500,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: "center",
    alignItems: "center"
  }
});
