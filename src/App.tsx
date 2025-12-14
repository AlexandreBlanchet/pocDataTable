
import { useEffect, useState } from 'react';
import { authenticate, getUserMe } from './utils/genesysCloudUtils';
import { Models } from 'purecloud-platform-client-v2';
import { Box, Breadcrumbs, Button, CssBaseline, CssVarsProvider, Link, Typography } from '@mui/joy';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import UserTable from './components/UserTable';
import UserProfile from './components/UserProfile';
import { Route, Routes } from 'react-router';
import ContactChannelsTable from './components/ContactChannelsTable';
import ContactChannel from './components/ContactChannel';

function App() {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticadUser] = useState<Models.User>({version: 1})

  useEffect(() => {
    getPlatformClientData();
  }, []);

  async function getPlatformClientData() {
    await authenticate()
      .then(() => {
        return getUserMe();
      })
      .then((userDetailsResponse: any) => {
        setAuthenticadUser(userDetailsResponse)
        setInitialized(true)
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  
  return (
    <>{
      initialized && 
       <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Sidebar authenticatedUser={authenticatedUser}/>
        <Header />
         <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon />}
              sx={{ pl: 0 }}
            >
              <Link
                underline="none"
                color="neutral"
                href="#some-link"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="#some-link"
                sx={{ fontSize: 12, fontWeight: 500 }}
              >
                General
              </Link>
              <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
                Contact channel
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: 'flex',
              mb: 1,
              gap: 1,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'start', sm: 'center' },
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Typography level="h2" component="h1">
              Contact channel
            </Typography>
          </Box>
           <Routes>
            <Route path="/users" element={<UserTable />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/contactChannels" element={<ContactChannelsTable />} />
            <Route path="/contactChannels/:id" element={<ContactChannel />} />
            <Route path="/about" element={<UserProfile />} />
            <Route path="*" element={<UserProfile />} />
          </Routes>
        </Box>
      </Box>
    </CssVarsProvider>
      }
    </>
  );
}

export default App;
