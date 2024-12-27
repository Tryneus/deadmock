import {allIconFiles} from '/src/Icon';

const remaining = [...allIconFiles];
const parallel = 10;

const nextPreload = () => {
  if (remaining.length > 0) {
    const path = remaining.pop();
    const img = new Image();
    img.addEventListener('load', () => nextPreload());
    img.src = `${import.meta.env.BASE_URL}icon/${path}`;
  }
};

for (let i = 0; i < parallel; i++) {
  nextPreload();
}
