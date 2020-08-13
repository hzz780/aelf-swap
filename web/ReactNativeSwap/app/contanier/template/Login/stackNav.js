import Registered from './Registered';
import Entrance from './Entrance';
import GenerateQRCode from './GenerateQRCode';
import SetTransactionPwd from './SetTransactionPwd';
import QRCodeScan from './QRCodeScan';
import EnterPassword from './EnterPassword';
import AdvancedLogin from './AdvancedLogin';
import LoginAccountLogin from './LoginAccountLogin';
const stackNav = [
  {name: 'Registered', component: Registered},
  {name: 'Entrance', component: Entrance},
  {
    name: 'GenerateQRCode',
    component: GenerateQRCode,
    options: {
      gestureEnabled: false,
    },
  },
  {
    name: 'SetTransactionPwd',
    component: SetTransactionPwd,
    options: {
      gestureEnabled: false,
    },
  },
  {name: 'QRCodeScan', component: QRCodeScan},
  {name: 'EnterPassword', component: EnterPassword},
  {name: 'AdvancedLogin', component: AdvancedLogin},
  {name: 'LoginAccountLogin', component: LoginAccountLogin},
];

export default stackNav;
