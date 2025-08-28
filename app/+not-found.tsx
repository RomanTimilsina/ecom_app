import { Redirect } from 'expo-router';

export default function NotFoundScreen() {
  // just redirect straight away
  return <Redirect href="/login" />;
}