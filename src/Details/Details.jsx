import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {isString, useAction} from '../Common';
import {DragList, DragListGrip} from '../DragList';
import {Grid} from '../Grid';
import {SidebarButton, SidebarButtons} from '../SidebarButtons';
import {EditableMarkdown} from '../Text';

import './Details.css';

const DetailsSection = observer(({index, sections}) => {
  const onDelete = useAction(() => sections.splice(index, 1), [index, sections]);
  const onChangeMarkdown = useAction((x) => {
    if (x.length === 0) {
      onDelete();
    } else {
      sections[index] = x;
    }
  }, [index, sections, onDelete]);

  const value = sections[index];
  const inner = isString(value) ?
    <EditableMarkdown text={value} onChange={onChangeMarkdown} /> :
    <Grid data={value} onEmpty={onDelete} />;

  return (
    <div className="mock-details-section">
      <DragListGrip />
      {inner}
    </div>
  );
});

const Details = observer(({model}) => {
  const onAddMarkdown = useAction(() => model.addMarkdownSection(), [model]);
  const onAddGrid = useAction(() => model.addGridSection(), [model]);

  const onChangeDescription = useAction((x) => (model.description = x), [model]);
  const onMove = useAction((mutation) => mutation(model.sections), [model]);

  const renderSidebarButtons = useCallback(() => (
    <>
      <SidebarButton label="Markdown" onClick={onAddMarkdown} />
      <SidebarButton label="Grid" onClick={onAddGrid} />
    </>
  ), [onAddGrid, onAddMarkdown]);

  return (
    <SidebarButtons renderButtons={renderSidebarButtons}>
      <div className="mock-details">
        <div className="mock-details-description">
          <EditableMarkdown text={model.description} onChange={onChangeDescription} />
        </div>
        <DragList onMove={onMove}>
          {model.sections.map((x, i) => <DetailsSection key={i} index={i} sections={model.sections} />)}
        </DragList>
      </div>
    </SidebarButtons>
  );
});

export {Details, DetailsSection};
