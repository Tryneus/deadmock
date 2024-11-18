import {Text, SemiBold, Bold} from './text';

const Value = ({value, units, signed}) => {
  const signStr = value > 0 ? '+' : '-';
  const sign = (signed || (value < 0)) ? (<SemiBold bright={value < 0}>{signStr}</SemiBold>) : null;
  return (
    <>
      {sign}
      <Bold bright>{Math.abs(value)}</Bold>
      {units ? (<Bold>{units}</Bold>) : null}
    </>
  );
};

export {Value};
export default Value;
