/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import {AppRegistry} from 'react-native';
import Container from './src/container';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Container);
