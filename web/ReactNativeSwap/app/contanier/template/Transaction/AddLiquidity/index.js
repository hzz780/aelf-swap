import React, {memo, useCallback, useMemo} from 'react';
import {
  CommonHeader,
  Input,
  CommonButton,
  ListItem,
  CommonToast,
} from '../../../../components/template';
import {View} from 'react-native';
import {GStyle} from '../../../../assets/theme';
import {ChooseToken, MAXComponent} from '../MAXComponent';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import {TextL, TextM} from '../../../../components/template/CommonText';
import ChooseTokenModal from '../ChooseTokenModal';
import {pTd} from '../../../../utils/common';
import Entypo from 'react-native-vector-icons/Entypo';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import swapActions from '../../../../redux/swapRedux';
import swapUtils from '../../../../utils/pages/swapUtils';
import reduxUtils from '../../../../utils/pages/reduxUtils';
import TransactionVerification from '../../../../utils/pages/TransactionVerification';
import styles from './styles';
import MySingleLiquidity from '../MySingleLiquidity';
const defaultState = {
  firstToken: {
    input: '',
    token: '',
    balance: '',
  },
  secondToken: {
    input: '',
    token: '',
    balance: '',
  },
};
const AddLiquidity = props => {
  const {pairData} = props.route.params || {};
  const dispatch = useDispatch();
  const {userBalances, pairs, tokenUSD} = useStateToProps(base => {
    const {user, swap} = base;
    return {
      userBalances: user.userBalances,
      pairs: swap.pairs,
      tokenUSD: user.tokenUSD,
    };
  });
  const [state, setState] = useSetState({
    firstToken: {
      input: '',
      token: pairData?.symbolA,
      balance: userBalances[(pairData?.symbolA)] || '',
      reserve: pairData?.reserveA,
    },
    secondToken: {
      input: '',
      token: pairData?.symbolB,
      balance: userBalances[(pairData?.symbolB)] || '',
      reserve: pairData?.reserveB,
    },
  });
  const {firstToken, secondToken} = state;
  const getPairs = useCallback(
    (pair, callBack) => dispatch(swapActions.getPairs(pair, callBack)),
    [dispatch],
  );
  const pair = swapUtils.getPair(firstToken, secondToken, pairs);
  const addLiquidity = useCallback(
    data => dispatch(swapActions.addLiquidity(data)),
    [dispatch],
  );

  useFocusEffect(
    useCallback(() => {
      getPairs();
    }, [getPairs]),
  );
  const onModal = useCallback(
    (item, type) => {
      let obj = {[type]: item};
      if (type === 'firstToken' && secondToken?.token) {
        const {rA, rB} = swapUtils.getReserve(item, secondToken, pairs);
        obj = {
          ...obj,
          firstToken: {
            ...item,
            reserve: rA,
          },
          secondToken: {
            ...secondToken,
            reserve: rB,
          },
        };
      } else if (firstToken?.token) {
        const {rA, rB} = swapUtils.getReserve(item, firstToken, pairs);
        obj = {
          ...obj,
          secondToken: {
            ...item,
            reserve: rA,
          },
          firstToken: {
            ...firstToken,
            reserve: rB,
          },
        };
      }
      setState(obj);
    },
    [firstToken, pairs, secondToken, setState],
  );
  const NonInitial = firstToken?.reserve && secondToken?.reserve;
  const showTokenModal = useCallback(
    type => {
      const tokenList = swapUtils.getTokenList(
        pairs,
        userBalances,
        type,
        type === 'firstToken' ? secondToken : firstToken,
      );
      ChooseTokenModal.show({
        tokenList,
        onPress: item => onModal(item, type),
      });
    },
    [firstToken, onModal, pairs, secondToken, userBalances],
  );
  const onMAX = useCallback(
    (type, item) => {
      let obj = {[type]: {...item, input: item.balance}};
      if (NonInitial) {
        if (type === 'firstToken') {
          obj = {
            [type]: {...item, input: item.balance},
            secondToken: {
              ...secondToken,
              input: swapUtils.getAmounB(
                item.balance,
                item?.reserve,
                secondToken?.reserve,
              ),
            },
          };
        } else {
          obj = {
            [type]: {...item, input: item.balance},
            firstToken: {
              ...firstToken,
              input: swapUtils.getAmounB(
                item.balance,
                item?.reserve,
                firstToken?.reserve,
              ),
            },
          };
        }
      }
      setState(obj);
    },
    [NonInitial, firstToken, secondToken, setState],
  );
  const rightElement = useCallback(
    (item, type, hideMax) => {
      const {token} = item;
      if (token) {
        return (
          <View style={styles.rightBox}>
            {hideMax ? null : (
              <MAXComponent onPress={() => onMAX(type, item)} />
            )}
            <TextL onPress={() => showTokenModal(type)}>
              {token} <Entypo size={pTd(30)} name="chevron-thin-down" />
            </TextL>
          </View>
        );
      }
      return (
        <ChooseToken
          onPress={() => {
            showTokenModal(type);
          }}
        />
      );
    },
    [onMAX, showTokenModal],
  );
  const onChangeFirst = useCallback(
    v => {
      if (NonInitial) {
        setState({
          firstToken: {...firstToken, input: v},
          secondToken: {
            ...secondToken,
            input: swapUtils.getAmounB(
              v,
              firstToken?.reserve,
              secondToken?.reserve,
            ),
          },
        });
      } else {
        setState({
          firstToken: {...firstToken, input: v},
        });
      }
    },
    [NonInitial, firstToken, secondToken, setState],
  );
  const firstItem = useMemo(() => {
    return (
      <View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.input')}</TextM>
          <TextM>
            {i18n.t('mineModule.balance')}: {firstToken?.balance}
          </TextM>
        </View>
        <Input
          keyboardType="numeric"
          value={firstToken?.input}
          onChangeText={onChangeFirst}
          style={styles.inputStyle}
          rightElement={rightElement(firstToken, 'firstToken')}
          placeholder="0.0"
        />
      </View>
    );
  }, [firstToken, onChangeFirst, rightElement]);
  const onChangeSecond = useCallback(
    v => {
      if (NonInitial) {
        setState({
          secondToken: {...secondToken, input: v},
          firstToken: {
            ...firstToken,
            input: swapUtils.getAmounB(
              v,
              secondToken?.reserve,
              firstToken?.reserve,
            ),
          },
        });
      } else {
        setState({secondToken: {...secondToken, input: v}});
      }
    },
    [NonInitial, firstToken, secondToken, setState],
  );
  const secondItem = useMemo(() => {
    return (
      <View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.input')}</TextM>
          <TextM>
            {i18n.t('mineModule.balance')}: {secondToken?.balance}
          </TextM>
        </View>
        <Input
          keyboardType="numeric"
          value={secondToken?.input}
          onChangeText={onChangeSecond}
          style={styles.inputStyle}
          rightElement={rightElement(secondToken, 'secondToken')}
          placeholder="0.0"
        />
      </View>
    );
  }, [secondToken, onChangeSecond, rightElement]);
  const judgmentToken = useCallback(token => {
    if (
      token &&
      Number(token.input) > 0 &&
      Number(token.balance) >= Number(token.input)
    ) {
      return true;
    }
  }, []);
  const onAddLiquidit = useCallback(() => {
    if (judgmentToken(firstToken) && judgmentToken(secondToken)) {
      TransactionVerification.show(value => {
        if (!value) {
          return;
        }
        const amountADesired = reduxUtils.getDecimalTokenHigher(
          firstToken.input,
          firstToken.token,
        );
        const amountBDesired = reduxUtils.getDecimalTokenHigher(
          secondToken.input,
          secondToken.token,
        );
        addLiquidity({
          symbolA: firstToken.token,
          symbolB: secondToken.token,
          amountADesired,
          amountBDesired,
          amountAMin: swapUtils.getSwapMinFloat(amountADesired),
          amountBMin: swapUtils.getSwapMinFloat(amountBDesired),
          deadline: swapUtils.getDeadline(),
        });
      });
    } else {
      CommonToast.fail(i18n.t('swap.inputError'));
    }
  }, [addLiquidity, firstToken, judgmentToken, secondToken]);
  const Add = useMemo(() => {
    let disabled = true;
    if (judgmentToken(firstToken) && judgmentToken(secondToken)) {
      disabled = false;
    }
    return (
      <>
        <CommonButton
          onPress={onAddLiquidit}
          disabled={disabled}
          title={i18n.t('swap.addLiquidity')}
          style={styles.buttonStyles}
        />
        <TextM style={styles.tipText}>
          {i18n.t('swap.notFound')}
          <TextM
            onPress={() => navigationService.navigate('CreatePool')}
            style={styles.themeColor}>
            {i18n.t('swap.createIt')}
          </TextM>
        </TextM>
      </>
    );
  }, [firstToken, judgmentToken, onAddLiquidit, secondToken]);
  const firstTip = useMemo(() => {
    if (firstToken?.token && secondToken?.token) {
      return (
        <TextM style={styles.redColor}>{i18n.t('swap.addFirstTip')}</TextM>
      );
    }
  }, [firstToken, secondToken]);
  const secondTip = useMemo(() => {
    return (
      <TextM style={styles.grayColor}>{i18n.t('swap.addSecondTip')}</TextM>
    );
  }, []);
  const prices = useMemo(() => {
    return (
      <>
        <TextL style={[styles.themeColor, styles.mrginText]}>
          {i18n.t('swap.price')}
        </TextL>
        <View style={[styles.splitLine]} />
        <ListItem
          disabled
          style={styles.itemBox}
          title={firstToken?.token}
          subtitle={`≈ ${swapUtils.detailsPrice(
            firstToken?.reserve,
            secondToken?.reserve,
          )} ${secondToken?.token} ($ ${swapUtils.getUSD(
            firstToken?.token,
            tokenUSD,
          )})`}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <ListItem
          disabled
          title={secondToken?.token}
          style={styles.itemBox}
          subtitle={`≈ ${swapUtils.detailsPrice(
            secondToken?.reserve,
            firstToken?.reserve,
          )} ${firstToken?.token} ($ ${swapUtils.getUSD(
            secondToken?.token,
            tokenUSD,
          )})`}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
      </>
    );
  }, [firstToken, secondToken, tokenUSD]);
  const willReceive = useMemo(() => {
    const poolToken = swapUtils.willPoolTokens(firstToken, secondToken, pair);
    return (
      <>
        <TextL style={[styles.themeColor, styles.mrginText]}>
          {i18n.t('swap.willReceive')}
        </TextL>
        <View style={[styles.splitLine]} />
        <ListItem
          disabled
          title={`${firstToken?.token}-${secondToken?.token} ${i18n.t(
            'swap.poolTokens',
          )}`}
          style={styles.itemBox}
          subtitle={poolToken || '-'}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <ListItem
          disabled
          title={i18n.t('swap.sharePool')}
          style={styles.itemBox}
          subtitle={swapUtils.getSharePool(poolToken, pair?.totalSupply) || '-'}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
      </>
    );
  }, [firstToken, pair, secondToken]);
  const MyLiquidity = useMemo(() => {
    return <MySingleLiquidity pair={pair} />;
  }, [pair]);
  const upPullRefresh = useCallback(
    callBack => {
      getPairs(undefined, () => {
        setState(defaultState);
        callBack && callBack();
      });
    },
    [getPairs, setState],
  );
  return (
    <View style={GStyle.container}>
      <CommonHeader
        title={i18n.t('swap.addLiquidity')}
        canBack
        scrollViewProps={{upPullRefresh}}>
        {NonInitial ? (
          <View style={styles.container}>
            {firstItem}
            {secondItem}
            {prices}
            {willReceive}
            {secondTip}
            {Add}
            {MyLiquidity}
          </View>
        ) : (
          <View style={styles.container}>
            {firstItem}
            {secondItem}
            {firstTip}
            {Add}
          </View>
        )}
      </CommonHeader>
    </View>
  );
};

export default memo(AddLiquidity);
