import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import Meta from './Meta';
import Sidebar from './Sidebar';

import { useEffect, useState } from 'react';
import PageLoader from './PageLoader';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  if (loading) return <PageLoader />;
  return (
    <Box>
      <Meta />
      <Sidebar>
        <Box margin="0 auto" transition="0.5s ease-out">
          {children}
        </Box>
      </Sidebar>
    </Box>
  );
};

export default Layout;
