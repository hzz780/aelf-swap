import React, {memo, useMemo, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../../assets/theme';
import {
  CommonHeader,
  BounceSpinner,
  CommonToast,
  Communication,
  CommonButton,
} from '../../../../../components/template';
import {pTd} from '../../../../../utils/common';
import {useFocusEffect} from '@react-navigation/native';
import {aelfInstance} from '../../../../../utils/common/aelfProvider';
import {
  useFetchSetState,
  useStateToProps,
} from '../../../../../utils/pages/hooks';
import {TextL} from '../../../../../components/template/CommonText';
import unitConverter from '../../../../../utils/pages/unitConverter';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {onCopyText} from '../../../../../utils/pages';
import aelfUtils from '../../../../../utils/pages/aelfUtils';
import i18n from 'i18n-js';
const NetworkManagement = props => {
  const [state, setState] = useFetchSetState({
    result: null,
    details: null,
    time: null,
  });
  const {address} = useStateToProps(base => {
    const {user} = base;
    return {
      address: user.address,
    };
  });
  const {result, details, time} = state;
  const {params} = props.route || {};
  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        const {TransactionId} = params || {};
        if (TransactionId) {
          try {
            const txResult = await aelfInstance.chain.getTxResult(
              TransactionId,
            );
            setState({
              result: txResult,
              details: JSON.parse(txResult.Transaction.Params),
            });
            const blockByHeight = await aelfInstance.chain.getBlockByHeight(
              txResult.BlockNumber || txResult.Transaction.RefBlockNumber,
              true,
            );
            const {Time} = blockByHeight.Header;
            setState({
              time: Time,
            });
          } catch (error) {
            console.log(error, '=====error');
            CommonToast.fail(i18n.t('mineModule.transactionFailed'));
          }
        }
      };
      fetch();
    }, [params, setState]),
  );
  const Element = useMemo(() => {
    if (!(details && result)) {
      return null;
    }
    const {amount, symbol, to} = details || {};
    const {Status, TransactionId, Logs} = result || {};
    const free = aelfUtils.getTransactionFee(Logs || {});
    const List = [
      {
        title: i18n.t('mineModule.transferM.from'),
        details: address,
        copy: true,
      },
      {
        title: i18n.t('mineModule.transferM.to'),
        details: aelfUtils.formatAddress(to),
        copy: true,
      },
      {title: i18n.t('mineModule.transferM.memo'), details: details.memo},
      {
        title: i18n.t('mineModule.status'),
        details: Status,
        color: Colors.green,
      },
      {
        title: i18n.t('mineModule.transactionID'),
        details: TransactionId,
        copy: true,
        onPress: () => {
          Communication.web(aelfUtils.webURLTx(TransactionId));
        },
      },
      time ? {title: 'time', details: aelfUtils.timeConversion(time)} : {},
      {title: i18n.t('mineModule.fee'), details: `${free.cost} ${free.symbol}`},
    ];
    return (
      <View style={styles.container}>
        <View style={styles.amountBox}>
          {amount > 0 ? (
            <FontAwesome5 name="arrow-circle-up" size={30} color={Colors.red} />
          ) : (
            <FontAwesome5
              name="arrow-circle-down"
              size={30}
              color={Colors.green}
            />
          )}
          <TextL style={styles.amount}>
            {unitConverter.toLower(amount)} {symbol}
          </TextL>
        </View>
        {List.map((item, index) => {
          const {copy, title, onPress, color} = item;
          return (
            <View key={index} style={styles.itemBox}>
              <TextL style={{color: Colors.fontGray}}>{title}</TextL>
              {copy ? (
                <TextL
                  onPress={() =>
                    onPress ? onPress(item) : onCopyText(item.details)
                  }
                  style={styles.detailsStyle}>
                  {item.details}
                  {onPress ? (
                    <FontAwesome name="share-square-o" size={pTd(30)} />
                  ) : (
                    <Icon name="copy1" size={pTd(32)} />
                  )}
                </TextL>
              ) : (
                <TextL style={[styles.details, {color: color}]}>
                  {item.details}
                </TextL>
              )}
            </View>
          );
        })}
        <View style={styles.buttonBox}>
          <CommonButton
            title={i18n.t('mineModule.turnExplorer')}
            onPress={() => Communication.web(aelfUtils.webURLTx(TransactionId))}
          />
        </View>
      </View>
    );
  }, [details, address, result, time]);
  const Loading = useMemo(() => {
    return (
      <View style={styles.loadingBox}>
        <BounceSpinner />
      </View>
    );
  }, []);
  return (
    <View style={GStyle.container}>
      <CommonHeader
        title={i18n.t('mineModule.transferM.transactionDetails')}
        canBack>
        {result && details ? Element : Loading}
      </CommonHeader>
    </View>
  );
};

export default memo(NetworkManagement);
const styles = StyleSheet.create({
  container: {
    marginTop: pTd(50),
    marginHorizontal: pTd(50),
  },
  itemBox: {
    marginTop: pTd(30),
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    paddingTop: pTd(300),
  },
  amountBox: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  amount: {
    marginLeft: pTd(30),
  },
  details: {
    marginTop: pTd(10),
  },
  detailsStyle: {
    marginTop: pTd(10),
    color: Colors.fontColor,
  },
  buttonBox: {
    marginTop: pTd(50),
  },
});
