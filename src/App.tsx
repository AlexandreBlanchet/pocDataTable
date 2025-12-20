
import { useEffect, useState } from 'react';
import { authenticate, getDataTable, getDataTableInfos, getUserMe } from './utils/genesysCloudUtils';
import { Models } from 'purecloud-platform-client-v2';
import { Box, Breadcrumbs, Button, CssBaseline, CssVarsProvider, Link, Typography } from '@mui/joy';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import UserTable from './components/UserTable';
import UserProfile from './components/UserProfile';
import { Route, Routes } from 'react-router';
import ContactChannelsTable from './components/ContactChannelsTable';
import ContactChannel from './components/ContactChannel';
import ObjectTypeTable from './components/ObjectTypeTable';
import ObjectTypeElement from './components/ObjectTypeElement';
import { ObjectType } from './utils/types';

function App() {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [authenticatedUser, setAuthenticadUser] = useState<Models.User>({version: 1})
  const [objectsTypes, setObjectsTypes] = useState<ObjectType[]>([])

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
        getDataTable("61981ec5-b713-4e71-b79f-9504de684e00").then(objectTypes => {
          Promise.all(objectTypes.entities?.map((objectType: any) => {
            return getDataTableInfos(objectType.key).then(elem => {
              console.log(elem)
              return {id: elem.id, division: elem.division, name: elem.name, path: objectType.path, description: elem.description, properties: elem.schema?.properties }})}) || []).then((elems: any) => setObjectsTypes(elems))
        })
        setInitialized(true)
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  console.log(objectsTypes)

  return (
    <>{
      initialized && 
       <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Sidebar authenticatedUser={authenticatedUser} objectsTypes={objectsTypes} />
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

           <Routes>
            <Route path="/users" element={<UserTable />} />
            <Route path="/users/:id" element={<UserProfile />} />
            {objectsTypes.map(objectType => <Route path={objectType.path} element={<ObjectTypeTable objectType={objectType} />} />)}
            {objectsTypes.map(objectType => <Route path={objectType.path + "/:id"} element={<ObjectTypeElement objectType={objectType} />} />)}
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
