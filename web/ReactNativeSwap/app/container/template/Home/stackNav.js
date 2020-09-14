import PairDetails from './PairDetails';
import TokenDetails from './TokenDetails';
import AccountDetails from './AccountDetails';
import AccountPairList from './AccountDetails/AccountPairList';
import TokenMore from './TokenDetails/TokenMore';
const stackNav = [
  {name: 'PairDetails', component: PairDetails},
  {name: 'TokenDetails', component: TokenDetails},
  {name: 'AccountDetails', component: AccountDetails},
  {name: 'TokenMore', component: TokenMore},
  {name: 'AccountPairList', component: AccountPairList},
];

export default stackNav;
