'use client';
import { FirebaseProvider, initializeFirebase } from '@/lib/firebase';

// Note: This pattern is required to avoid re-initializing firebase on every hot-reload.
const { app, firestore, auth } = initializeFirebase();

/**
 * A client-side component that initializes Firebase and provides it to the rest of the app.
 *
 * This component is responsible for initializing Firebase on the client-side
 * and providing the Firebase app, Firestore, and Auth instances to the rest of the app
 * through the `FirebaseProvider`.
 *
 * @param {Readonly<{ children: React.ReactNode }>} props - The component props.
 * @param {React.ReactNode} props.children - The children to render within the provider.
 * @returns {JSX.Element} The rendered component.
 */
export default function FirebaseClientProvider({
  children,
}: Readonly<{ children: React.ReactNode }>): JSX.Element {
  return (
    <FirebaseProvider
      firebaseApp={app}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
