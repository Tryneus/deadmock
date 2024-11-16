import {SemiBold, Bold} from './text';

const Value = ({value, units, noPos}) => {
  const signStr = value > 0 ? '+' : '-';
  const sign = (value >= 0 && noPos) ? null : (<SemiBold bright={value < 0}>{signStr}</SemiBold>);
  return (
    <span>
      {sign}
      <Bold bright>{Math.abs(value)}</Bold>
      {units ? (<Bold>{units}</Bold>) : null}
    </span>
  );
};

export {Value};
export default Value;
