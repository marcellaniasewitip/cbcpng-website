import Photo from './Photo';
import { Fill } from './Fill';

export default function Person({ name, role, photo, roleHint = 'Title' }) {
  return (
    <div className="person">
      <Photo src={photo} round caption="Photo" alt={name ? `Portrait of ${name}` : undefined} />
      <Fill as="b" value={name} hint="Full name" />
      <span className="role"><Fill value={role} hint={roleHint} /></span>
    </div>
  );
}
