import {observer} from 'mobx-react-lite';
import {useCallback} from 'preact/hooks';

import {useAction} from '/src/Common';
import {DragList, DragListGrip} from '/src/DragList';
import {Grid} from '/src/Grid';
import {SidebarButton, SidebarButtons} from '/src/SidebarButtons';
import {EditableMarkdown} from '/src/Text';

import './Details.css';

const DetailsSection = observer(({details, section}) => {
  const onDelete = useAction(() => {
    details.removeSection(section);
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
          {model.sections.map((x) => <DetailsSection key={x.id} details={model} section={x} />)}
        </DragList>
      </div>
    </SidebarButtons>
  );
});

export {Details, DetailsSection};
