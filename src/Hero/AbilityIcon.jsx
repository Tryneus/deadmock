import {observer} from 'mobx-react-lite';

import {useAction} from '/src/Common';
import {Icon} from '/src/Icon';
import {ImageModalTrigger} from '/src/ImageModal';
import {StoredImage} from '/src/ImageStorage';

const AbilityIcon = ({id, number}) => {
  return (
    <div className="mock-hero-ability-icon-container">
      <div className="mock-hero-ability-icon">
        <StoredImage id={id}>
          <Icon color="dark-grey" />
        </StoredImage>
      </div>
      <div className="mock-hero-ability-number">
        {number}
      </div>
    </div>
  );
};

const EditableAbilityIcon = observer(({model, number}) => {
  const {image} = model;
  const onChange = useAction((key) => (model.image = key));

  return (
    <div className="mock-hero-ability-button">
      <ImageModalTrigger image={image} type="icon" onChange={onChange}>
        <AbilityIcon id={image} number={number} />
      </ImageModalTrigger>
    </div>
  );
});

export {AbilityIcon, EditableAbilityIcon};
