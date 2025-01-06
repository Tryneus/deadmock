import {Icon} from '/src/Icon';
import {StoredImage} from '/src/ImageStorage';
import './Portrait.css';

const PortraitDisplay = ({image}) => {
  if (image === 'error') {
    return <Icon color="orange" image="error" />;
  }

  const style = {backgroundImage: `url("${image}")`};
  return <div className="mock-hero-portrait" style={style} />;
};

const Portrait = ({id}) => {
  return (
    <StoredImage id={id}>
      <PortraitDisplay />
    </StoredImage>
  );
};

export {Portrait};
