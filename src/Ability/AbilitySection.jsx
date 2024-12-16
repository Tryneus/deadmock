import {observer} from 'mobx-react-lite';

import {isString, useAction} from '../Common';
import {Grid} from '../Grid';
import {EditableMarkdown} from '../Text';

const AbilitySection = observer(({model, index}) => {
  const value = model.sections[index];

  // onChange is only used for markdown sections, as the grid is given its own model for updating
  const onDelete = useAction(() => model.removeSection(index), [index, model]);
  const onChangeMarkdown = useAction((x) => {
    if (x.length === 0) {
      onDelete();
    } else {
      model.sections[index] = x;
    }
  }, [index, model, onDelete]);

  if (isString(value)) {
    return (
      <div className="mock-ability-markdown mock-ability-body-section">
        <EditableMarkdown text={value} onChange={onChangeMarkdown} />
      </div>
    );
  }
  return (
    <div className="mock-ability-body-section">
      <Grid data={value} onEmpty={onDelete} />
    </div>
  );
});

export {AbilitySection};
