import {allItems, statIcons} from './Common';

const itemIcons = allItems.map((x) => x.icon);
const allIcons = itemIcons.concat(statIcons);

const nextPreload = (i) => {
  if (i < allIcons.length) {
    const img = new Image();
    img.addEventListener('load', () => nextPreload(i + 1));
    img.src = `${import.meta.env.BASE_URL}icon/${allIcons[i]}.png`;
  }
};
nextPreload(0);
