import {IconBadge} from './IconBadge';

const StaticGallery = ({groups, onChange, onApply}) => {
  return (
    <>
      {groups.map((group, i) => (
        <div key={i}>
          {group.map((id) => <IconBadge key={id} id={id} onApply={onApply} onChange={onChange} />)}
        </div>
      ))}
    </>
  );
};

export {StaticGallery};
