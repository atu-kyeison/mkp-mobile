import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './site';
import {
  ContactPage,
  HomePage,
  NotFoundPage,
  PrivacyPage,
  TermsPage,
  WhitepaperPage,
} from './site';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'whitepaper', element: <WhitepaperPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
