const D = ['1', 'open', 'close', 'lowest', 'highest'];
// handle functions in option
const stringify = obj => {
  let result = JSON.stringify(obj, (key, val) => {
    if (typeof val === 'function') {
      return `~--example--~${val}~--example--~`;
    }
    return val;
  });
  do {
    result = result
      .replace('"~--example--~', '')
      .replace('~--example--~"', '')
      .replace(/\\n/g, '')
      .replace(/\\\"/g, '"');
  } while (result.includes('~--example--~'));
  return result;
};
// window.document.addEventListener('message', function(e) {
//   var option = JSON.parse(e.data);
//   myChart.setOption(option);
// });
const renderChart = props => {
  const height = `${props.height || 500}px`;
  const width = props.width ? `${props.width}px` : 'auto';
  let typeName = `var typeName = ${JSON.stringify(D)};`;
  if (props.typeName) {
    typeName = `var typeName = ${JSON.stringify(props.typeName)};`;
  }
  return `
    var aelfDigits = count => {
    const floatPart = String(count).split('.')[1];
    if (count && floatPart && floatPart.length > 5) {
      count = count.toFixed(5);
    }
      return count;
    };
    ${typeName}
    document.getElementById('main').style.height = "${height}";
    document.getElementById('main').style.width = "${width}";
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption(${stringify(props.option)},true);
    myChart.on('click', function(params) {
      var seen = [];
      var paramsString = JSON.stringify(params, function(key, val) {
        if (val != null && typeof val == "object") {
          if (seen.indexOf(val) >= 0) {
            return;
          }
          seen.push(val);
        }
        return val;
      });
      window.ReactNativeWebView.postMessage(paramsString);
    });
  `;
};
const setOpctios = props => {
  return `myChart && myChart.setOption(${stringify(props.option)},true);`;
};
export default {renderChart, defaultHeight: 350, setOpctios};
