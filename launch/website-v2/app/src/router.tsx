import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './site';
import {
  AboutPage,
  AvailabilityPage,
  ComparePage,
  ContactPage,
  FaqPage,
  HomePage,
  NotFoundPage,
  PrivacyPage,
  TermsPage,
  ThankYouPage,
  TrustPage,
  WhitepaperPage,
} from './site';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'trust', element: <TrustPage /> },
      { path: 'faq', element: <FaqPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'availability', element: <AvailabilityPage /> },
      { path: 'whitepaper', element: <WhitepaperPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'thank-you', element: <ThankYouPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
