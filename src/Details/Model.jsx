import {makeAutoObservable} from 'mobx';

import {GridModel} from '../Grid/Model';
import {serializeable} from '../Serialize';

const defaultGridSection = {
  gridData: {
    cells:  [{}],
    values: [{}],
  },
};

const defaultMarkdown = 'Insert **markdown** _here_.';
const defaultMarkdownSection = {
  markdownData: defaultMarkdown,
};

class DetailSectionModel {
  id; // only used for rendering purposes as a react `key`, not persisted
  markdownData = null;
  gridData = null;

  constructor(raw) {
    this.id = crypto.randomUUID();
    this.markdownData = raw?.markdownData || null;
    this.gridData = raw?.gridData ? new GridModel(raw.gridData) : null;
    if (!this.markdownData && !this.gridData) {
      this.markdownData = defaultMarkdownSection.markdownData;
    }
    makeAutoObservable(this);
  }
}

serializeable(DetailSectionModel, [
  ['gridData', GridModel],
  ['markdownData'],
]);

class DetailsModel {
  description = defaultMarkdown;
  sections = [];

  constructor(raw) {
    this.description = raw?.description ?? this.description;
    this.sections = raw?.sections?.map((x) => new DetailSectionModel(x)) || this.sections;
    makeAutoObservable(this);
  }

  addMarkdownSection() {
    this.sections.push(new DetailSectionModel(defaultMarkdownSection));
  }

  addGridSection() {
    this.sections.push(new DetailSectionModel(defaultGridSection));
  }

  removeSection(section) {
    const index = this.sections.indexOf(section);
    if (index !== -1) {
      this.sections.splice(index, 1);
    }
  }
}

serializeable(DetailsModel, [
  ['description'],
  ['sections', [DetailSectionModel]],
]);

export {DetailsModel, defaultGridSection, defaultMarkdownSection};
