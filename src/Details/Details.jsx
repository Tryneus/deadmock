import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {isString, useAction} from '../Common';
import {DragList, DragListGrip} from '../DragList';
import {Grid} from '../Grid';
import {SidebarButton, SidebarButtons} from '../SidebarButtons';
import {EditableMarkdown} from '../Text';

import './Details.css';

const DetailsSection = observer(({details, section}) => {
  const onDelete = useAction(() => {
    details.removeSection(section)
  }, [details, section]);
  const onChangeMarkdown = useAction((x) => {
    if (x.length === 0) {
      onDelete();
    } else {
      section.markdownData = x;
    }
  }, [section, onDelete]);

  const inner = section.gridData ?
    <Grid data={section.gridData} onEmpty={onDelete} /> :
    <EditableMarkdown text={section.markdownData} onChange={onChangeMarkdown} />;

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

  const renderSection = useCallback((section) => (
    <DetailsSection sections={model.sections} section={section} />
  ), [model]);
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
        <DragList items={model.sections} renderItem={renderSection} />
      </div>
    </SidebarButtons>
  );
});

export {Details, DetailsSection};
