import PersonalCenter from './PersonalCenter';
import EditUserName from './PersonalCenter/EditUserName';

import Receive from './Receive';
import Transfer from './Transfer';
import TransactionDetails from './Transfer/TransactionDetails';

import SecurityCenter from './SecurityCenter';
import PaymentSettings from './SecurityCenter/PaymentSettings';
import ChangePaymentPwd from './SecurityCenter/ChangePaymentPwd';
import SecondChangePaymentPwd from './SecurityCenter/SecondChangePaymentPwd';

import GeneralSettings from './GeneralSettings';
import Language from './GeneralSettings/Language';
import CurrencyUnit from './GeneralSettings/CurrencyUnit';
import NetworkManagement from './GeneralSettings/NetworkManagement';

import AccountManagement from './AccountManagement';
import AboutUs from './AboutUs';
import HelpCenter from './HelpCenter';
import TransactionManagement from './TransactionManagement';
import AuthorizeManagement from './AuthorizeManagement';
import ApproveDetails from './AuthorizeManagement/ApproveDetails';

import MyLiquidity from './MyLiquidity';
const stackNav = [
  {name: 'PersonalCenter', component: PersonalCenter},
  {name: 'EditUserName', component: EditUserName},

  {name: 'Receive', component: Receive},
  {name: 'Transfer', component: Transfer},
  {name: 'TransactionDetails', component: TransactionDetails},

  {name: 'SecurityCenter', component: SecurityCenter},
  {name: 'PaymentSettings', component: PaymentSettings},
  {name: 'ChangePaymentPwd', component: ChangePaymentPwd},
  {name: 'SecondChangePaymentPwd', component: SecondChangePaymentPwd},

  {name: 'GeneralSettings', component: GeneralSettings},
  {name: 'Language', component: Language},
  {name: 'CurrencyUnit', component: CurrencyUnit},
  {name: 'NetworkManagement', component: NetworkManagement},

  {name: 'AccountManagement', component: AccountManagement},
  {name: 'AboutUs', component: AboutUs},
  {name: 'HelpCenter', component: HelpCenter},
  {name: 'TransactionManagement', component: TransactionManagement},
  {name: 'AuthorizeManagement', component: AuthorizeManagement},
  {name: 'ApproveDetails', component: ApproveDetails},

  {name: 'MyLiquidity', component: MyLiquidity},
];

export default stackNav;
