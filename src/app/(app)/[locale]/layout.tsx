import './global.css'
import GithubCorner from '../../../components/github-corner/GithubCorner'
import i18nConfig from '../../../../locales.config';

export const metadata = {
  title: 'NextGram',
  description:
    'A sample Next.js app showing dynamic routing with modals as a route.',
  metadataBase: new URL('https://nextgram.vercel.app'),
}


const getLocalesForStaticParams = (locales: string[]) => {
  return locales.map((locale) => {
    return {
      locale,
    };
  });
};


export function generateStaticParams() {
  return getLocalesForStaticParams(i18nConfig.locales);
}

export default function Layout(props: { children: React.ReactNode, modal: React.ReactNode }) {
  return (
    <html>
      <body>
        <GithubCorner />
        {props.children}
        {props.modal}
      </body>
    </html>
  )
}
