import { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="de">
      <head>
        <title>Fetisch Dating Plattform</title>
        <meta name="description" content="Diskrete Fetisch-Dating-Plattform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
