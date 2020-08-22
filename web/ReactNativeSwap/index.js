/**
 * @format
 */
import {AppRegistry} from 'react-native';
import 'react-native-get-random-values';
import './app/assets/theme/colors';
import './app/assets/theme/gStyle';
import './app/utils/common/unit';
import './app/utils/common/console';
import './app/utils/common/text';
import './app/utils/common/utils';
import './app/i18n';
import App from './app/App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);
