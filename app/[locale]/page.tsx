import { redirect } from 'next/navigation';
import { APP_ROUTES } from '../../lib/routes';

export default function HomePage() {
  redirect(`/es/${APP_ROUTES.login}`);
}
