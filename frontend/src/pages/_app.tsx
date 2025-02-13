import { useRef } from 'react';
import { AppProps as NextAppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { appWithTranslation } from 'next-i18next';
import { Hydrate } from 'react-query/hydration'; // import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CookiesProvider } from 'react-cookie';
const ToastContainer = dynamic(
  () => import('react-toastify').then((module) => module.ToastContainer),
  {
    ssr: false,
  },
);
import { ThemeProvider } from 'src/theme';
import { ConfirmBox } from '@components/common/ConfirmBox';

import 'src/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'src/styles/tailwind.scss';
import 'src/styles/_core.scss';
import 'src/styles/_app.scss';

type AppInitialProps = {
  pageProps: {
    user: any;
    dehydratedState: unknown;
  };
};
type AppProps = AppInitialProps & Omit<NextAppProps, 'pageProps'>;

function MyApp({ Component, pageProps }: AppProps) {
  const queryClientRef = useRef<QueryClient>(null);

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnReconnect: 'always',
          retry: 0,
          staleTime: 0,
          cacheTime: 0,
        },
      },
    });
  }

  return (
    <>
      {/*<SessionProvider session={pageProps.session} refetchInterval={0}>*/}
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <CookiesProvider>
            <ThemeProvider>
              <Component {...pageProps} />
              <ConfirmBox />
            </ThemeProvider>
          </CookiesProvider>
          <ToastContainer
            className="global-toast"
            position="top-right"
            hideProgressBar
            newestOnTop
            pauseOnHover
            closeOnClick={false}
            limit={1}
          />
        </Hydrate>
      </QueryClientProvider>
      {/*</SessionProvider>*/}
    </>
  );
}

export default appWithTranslation(MyApp);
