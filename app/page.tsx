import { redirect } from 'next/navigation';
import { APP_ROUTES } from '../lib/routes';

export default function RootPage() {
  redirect(`/es/${APP_ROUTES.login}`);
}
