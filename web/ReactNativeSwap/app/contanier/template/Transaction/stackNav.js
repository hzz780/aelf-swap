import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';
import CreatePool from './CreatePool';
import DefaultSwap from './DefaultSwap';
const stackNav = [
  {name: 'AddLiquidity', component: AddLiquidity},
  {name: 'RemoveLiquidity', component: RemoveLiquidity},
  {name: 'CreatePool', component: CreatePool},
  {name: 'DefaultSwap', component: DefaultSwap},
];

export default stackNav;
