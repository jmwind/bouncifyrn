import 'react-native';
import React from 'react';
import Game from '../src/game';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {GameMode} from '../src/config';

it('renders correctly', () => {
  renderer.create(
    <Game
      topScore={0}
      mode={GameMode.MODE_BRICKS}
      visible
      onClose={jest.fn()}
    />
  );
});
