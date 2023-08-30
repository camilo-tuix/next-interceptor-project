import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';

import {
  getRequestedLocales,
  isPathnameMissingValidLocale,
  getLocaleInPathname,
} from './utils/localization';

import i18nConfig from './locales.config';

let isIntendedUserLocaleEn = false;

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const localeInPathname = getLocaleInPathname(pathname);
  const requestedLocales = getRequestedLocales(request);
  const matchedLocale = match(
    requestedLocales,
    i18nConfig.locales,
    i18nConfig.defaultLocale
  );
  console.log('matchedLocale', matchedLocale)

  // Check if the default locale is in the pathname
  if (localeInPathname === i18nConfig.defaultLocale) {
    // If the user's locale is not English, we want to redirect them to the English version of the site when they explicitly request the en locale
    if (matchedLocale !== i18nConfig.defaultLocale) {
      isIntendedUserLocaleEn = true;
    }

    // we want to REMOVE the default locale from the pathname,
    // and later use a rewrite so that Next will still match
    // the correct code file as if there was a locale in the pathname
    return NextResponse.redirect(
      new URL(pathname.replace(`/${i18nConfig.defaultLocale}`, ''), request.url)
    );
  }

  // catch request to a path that is missing a locale in the pathname
  if (isPathnameMissingValidLocale(i18nConfig.locales, pathname)) {
    // if the user's locale is not English and the use didn't explicitly request the en locale, we want to redirect them the matching locale version of the site
    if (matchedLocale !== i18nConfig.defaultLocale && !isIntendedUserLocaleEn) {
      return NextResponse.redirect(
        new URL(`/${matchedLocale}${pathname}`, request.url)
      );
    } else {
      // catch request to english locale, the locale at this point was delete from the pathname in the first if statement
      // rewrite it so next.js will render `/` as if it was `/en`
      return NextResponse.rewrite(
        new URL(`/${i18nConfig.defaultLocale}${pathname}`, request.url)
      );
    }
  } else {
    // the request have a valid locale in the pathname
    // reset the flag if the user is not requesting the en locale
    isIntendedUserLocaleEn = false;
  }
}

export const config = {
  // do not localize next.js paths
  matcher: ['/((?!api|_next|admin|.*\\..*).*)'],
};
