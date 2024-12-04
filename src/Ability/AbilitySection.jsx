import {observer} from 'mobx-react-lite';
import PropTypes from 'prop-types';

import {useAction} from '../Common';
import {EditableMarkdown} from '../Editable';
import {Grid} from '../Grid';

const AbilitySection = observer(({model, index}) => {
  // onChange is only used for markdown sections, as the grid is given its own model for updating
  const section = model.sections[index];
  const onDelete = useAction(() => model.removeSection(index), [index, model]);
  const onChangeMarkdown = useAction((x) => {
    if (x.length === 0) {
      onDelete();
    } else {
      section.data = x;
    }
  }, [section, onDelete]);

  if (section.type === 'markdown') {
    return (
      <div className="mock-ability-markdown">
        <EditableMarkdown text={section.data} onChange={onChangeMarkdown} />
      </div>
    );
  } else if (section.type === 'grid') {
    return <Grid data={section.data} onEmpty={onDelete} />;
  }
  return null;
});

AbilitySection.propTypes = {
  model: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export {AbilitySection};
