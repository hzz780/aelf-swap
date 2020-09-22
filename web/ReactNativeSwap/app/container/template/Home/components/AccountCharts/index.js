import React, {memo, useMemo, useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import {Charts, ListItem, Touchable} from '../../../../../components/template';
import {Colors} from '../../../../../assets/theme';
import {TextS} from '../../../../../components/template/CommonText';
import {pTd} from '../../../../../utils/common';
import swapUtils from '../../../../../utils/pages/swapUtils';
import {useDispatch} from 'react-redux';
import swapActions from '../../../../../redux/swapRedux';
import {useFocusEffect} from '@react-navigation/native';
import ToolMemo from '../../components/ToolMemo';
import LoadView from '../LoadView';
import i18n from 'i18n-js';
const periodConfig = ['week', 'month', 'all'];
const defaultPeriod = periodConfig[0];
const AccountCharts = props => {
  const {address, symbolPair} = props;
  const dispatch = useDispatch();
  const onGetAccountChart = useCallback(
    range => dispatch(swapActions.getAccountChart(address, range, symbolPair)),
    [address, dispatch, symbolPair],
  );
  useFocusEffect(
    useCallback(() => {
      onGetAccountChart(defaultPeriod);
    }, [onGetAccountChart]),
  );
  const {accountChart} = useStateToProps(base => {
    const {swap} = base;
    return {
      accountChart: swap.accountChart?.[address],
    };
  });
  const periodList = ['1W', '1M', 'All'];
  const list = ['Liquidity'];
  const [toolIndex, setToolIndex] = useState(0);
  const [period, setPeriod] = useState(0);
  const onSetToolIndex = useCallback(
    index => {
      onGetAccountChart(periodConfig[period]);
      setToolIndex(index);
    },
    [onGetAccountChart, period],
  );
  console.log(symbolPair, '====symbolPair');
  const chartObj = accountChart?.[symbolPair || 'all']?.[periodConfig[period]];
  console.log(chartObj, accountChart, '====accountChart');
  const {list: chartsList, liquidityInPrice} = chartObj || {};
  const charts = chartsList || chartObj;
  const toolMemo = useMemo(() => {
    return (
      <ToolMemo
        list={list}
        toolIndex={toolIndex}
        onSetToolIndex={onSetToolIndex}
      />
    );
  }, [list, onSetToolIndex, toolIndex]);
  const onSetPeriod = useCallback(
    index => {
      onGetAccountChart(periodConfig[index]);
      setPeriod(index);
    },
    [onGetAccountChart],
  );
  const PeriodMemo = useMemo(() => {
    return (
      <View style={styles.toolBox}>
        {periodList.map((item, index) => {
          let periodItem = [styles.periodItem];
          let textStyles = styles.grayColor;
          if (index === period) {
            periodItem.push(styles.borderColor);
            textStyles = styles.primaryColor;
          }
          return (
            <Touchable
              onPress={() => onSetPeriod(index)}
              key={index}
              style={periodItem}>
              <TextS style={textStyles}>{item}</TextS>
            </Touchable>
          );
        })}
      </View>
    );
  }, [onSetPeriod, period, periodList]);
  const BodyMemo = useMemo(() => {
    let series, boundaryGap;
    let loading = true;
    if (charts) {
      loading = false;
    }
    let timeDates = [],
      chartData = [];
    if (toolIndex === 0) {
      const {data, dates} = swapUtils.arrayMap(
        charts,
        'liquidity',
        'YYYY-MM-DD',
      );
      timeDates = dates;
      chartData = data;
      series = {
        data: chartData,
        type: 'line',
        areaStyle: {},
        showSymbol: false,
        name: list[toolIndex],
      };
      boundaryGap = false;
    } else if (toolIndex === 1) {
      const {data, dates} = swapUtils.arrayMap(charts, 'volume', 'YYYY-MM-DD');
      timeDates = dates;
      chartData = data;
      series = {
        data: chartData,
        type: 'bar',
        name: list[toolIndex],
      };
      boundaryGap = true;
    }
    return (
      <View>
        {loading && <LoadView />}
        <Charts series={series} dates={timeDates} boundaryGap={boundaryGap} />
      </View>
    );
  }, [charts, list, toolIndex]);
  return (
    <>
      <ListItem
        disabled
        rightElement={null}
        title={i18n.t('swap.account.liquidityInPrice')}
        subtitle={`$ ${swapUtils.USDdigits(liquidityInPrice)}`}
        subtitleStyle={styles.subtitleStyle}
      />
      <View style={styles.container}>
        {toolMemo}
        {PeriodMemo}
        {BodyMemo}
      </View>
    </>
  );
};

export default memo(AccountCharts);
const styles = StyleSheet.create({
  container: {
    marginTop: pTd(20),
    paddingTop: pTd(10),
    backgroundColor: 'white',
  },
  toolBox: {
    paddingLeft: pTd(20),
    flexDirection: 'row',
  },
  periodItem: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  borderColor: {
    borderBottomWidth: 2,
    borderColor: Colors.primaryColor,
  },
  primaryColor: {
    color: Colors.primaryColor,
  },
  grayColor: {
    color: Colors.fontGray,
  },
  subtitleStyle: {
    maxWidth: '70%',
    fontSize: pTd(28),
    fontWeight: 'bold',
    color: Colors.fontBlack,
  },
});
