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
const AddLiquidity = props => {
  const dispatch = useDispatch();
  const {userBalances, pairs, tokenUSD} = useStateToProps(base => {
    const {user, swap} = base;
    return {
      userBalances: user.userBalances,
      pairs: swap.pairs,
      tokenUSD: user.tokenUSD,
    };
  });
  const {pairData} = props.route.params || {};
  const [state, setState] = useSetState({
    firstToken: {
      input: '',
      token: pairData?.symbolA,
    },
    secondToken: {
      input: '',
      token: pairData?.symbolB,
    },
  });
  const getPairs = useCallback(
    (pair, callBack) => dispatch(swapActions.getPairs(pair, callBack)),
    [dispatch],
  );
  const {firstToken, secondToken} = state;
  const firstBalance = userBalances[(firstToken?.token)] || 0;
  const secondBalance = userBalances[(secondToken?.token)] || 0;
  const currentPair = swapUtils.getPair(firstToken, secondToken, pairs);
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
      setState({[type]: item});
    },
    [setState],
  );
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
      if (currentPair) {
        if (type === 'firstToken') {
          obj = {
            [type]: {...item, input: item.balance},
            secondToken: {
              ...secondToken,
              input: swapUtils.getAmounB(
                firstBalance,
                swapUtils.getCurrentReserve(firstToken.token, currentPair),
                swapUtils.getCurrentReserve(secondToken.token, currentPair),
                reduxUtils.getTokenDecimals(secondToken?.token),
              ),
            },
          };
        } else {
          obj = {
            [type]: {...item, input: item.balance},
            firstToken: {
              ...firstToken,
              input: swapUtils.getAmounB(
                secondBalance,
                swapUtils.getCurrentReserve(secondToken.token, currentPair),
                swapUtils.getCurrentReserve(firstToken.token, currentPair),
                reduxUtils.getTokenDecimals(firstToken?.token),
              ),
            },
          };
        }
      }
      setState(obj);
    },
    [
      currentPair,
      firstBalance,
      firstToken,
      secondBalance,
      secondToken,
      setState,
    ],
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
      if (currentPair) {
        setState({
          firstToken: {...firstToken, input: v},
          secondToken: {
            ...secondToken,
            input: swapUtils.getAmounB(
              v,
              swapUtils.getCurrentReserve(firstToken?.token, currentPair),
              swapUtils.getCurrentReserve(secondToken?.token, currentPair),
              reduxUtils.getTokenDecimals(secondToken?.token),
            ),
          },
        });
      } else {
        setState({
          firstToken: {...firstToken, input: v},
        });
      }
    },
    [currentPair, firstToken, secondToken, setState],
  );
  const firstItem = useMemo(() => {
    return (
      <View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.input')}</TextM>
          <TextM>
            {i18n.t('mineModule.balance')}: {firstBalance}
          </TextM>
        </View>
        <Input
          decimals={reduxUtils.getTokenDecimals(firstToken?.token)}
          keyboardType="numeric"
          value={firstToken?.input}
          onChangeText={onChangeFirst}
          style={styles.inputStyle}
          rightElement={rightElement(
            {...firstToken, balance: String(firstBalance)},
            'firstToken',
          )}
          placeholder="0.0"
        />
      </View>
    );
  }, [firstBalance, firstToken, onChangeFirst, rightElement]);
  const onChangeSecond = useCallback(
    v => {
      if (currentPair) {
        setState({
          secondToken: {...secondToken, input: v},
          firstToken: {
            ...firstToken,
            input: swapUtils.getAmounB(
              v,
              swapUtils.getCurrentReserve(secondToken?.token, currentPair),
              swapUtils.getCurrentReserve(firstToken?.token, currentPair),
              reduxUtils.getTokenDecimals(firstToken?.token),
            ),
          },
        });
      } else {
        setState({secondToken: {...secondToken, input: v}});
      }
    },
    [currentPair, firstToken, secondToken, setState],
  );
  const secondItem = useMemo(() => {
    return (
      <View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.input')}</TextM>
          <TextM>
            {i18n.t('mineModule.balance')}: {secondBalance}
          </TextM>
        </View>
        <Input
          decimals={reduxUtils.getTokenDecimals(secondToken?.token)}
          keyboardType="numeric"
          value={secondToken?.input}
          onChangeText={onChangeSecond}
          style={styles.inputStyle}
          rightElement={rightElement(
            {...secondToken, balance: String(secondBalance)},
            'secondToken',
          )}
          placeholder="0.0"
        />
      </View>
    );
  }, [secondBalance, secondToken, onChangeSecond, rightElement]);
  const onAddLiquidit = useCallback(() => {
    if (
      swapUtils.judgmentToken({...firstToken, balance: firstBalance}) &&
      swapUtils.judgmentToken({...secondToken, balance: secondBalance})
    ) {
      TransactionVerification.show(value => {
        if (!value) {
          return;
        }
        const {
          symbolA,
          symbolB,
          amountADesired,
          amountBDesired,
        } = reduxUtils.getAddData(firstToken, secondToken, currentPair);
        addLiquidity({
          symbolA,
          symbolB,
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
  }, [
    addLiquidity,
    currentPair,
    firstBalance,
    firstToken,
    secondBalance,
    secondToken,
  ]);
  const Add = useMemo(() => {
    let disabled = true;
    if (
      swapUtils.judgmentToken({...firstToken, balance: firstBalance}) &&
      swapUtils.judgmentToken({...secondToken, balance: secondBalance})
    ) {
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
  }, [firstBalance, firstToken, onAddLiquidit, secondBalance, secondToken]);
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
            swapUtils.getCurrentReserve(firstToken?.token, currentPair),
            swapUtils.getCurrentReserve(secondToken?.token, currentPair),
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
            swapUtils.getCurrentReserve(secondToken?.token, currentPair),
            swapUtils.getCurrentReserve(firstToken?.token, currentPair),
          )} ${firstToken?.token} ($ ${swapUtils.getUSD(
            secondToken?.token,
            tokenUSD,
          )})`}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
      </>
    );
  }, [currentPair, firstToken, secondToken, tokenUSD]);
  const willReceive = useMemo(() => {
    const poolToken = swapUtils.willPoolTokens(
      firstToken,
      secondToken,
      currentPair,
    );
    console.log(swapUtils.getSharePool(poolToken, currentPair?.totalSupply));
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
          subtitle={
            swapUtils.getSharePool(poolToken, currentPair?.totalSupply) || '-'
          }
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
      </>
    );
  }, [firstToken, currentPair, secondToken]);
  const MyLiquidity = useMemo(() => {
    return <MySingleLiquidity pair={currentPair} />;
  }, [currentPair]);
  const upPullRefresh = useCallback(
    callBack => {
      getPairs(undefined, () => {
        callBack && callBack();
      });
    },
    [getPairs],
  );
  return (
    <View style={GStyle.container}>
      <CommonHeader
        title={i18n.t('swap.addLiquidity')}
        canBack
        scrollViewProps={{upPullRefresh}}>
        {currentPair ? (
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
