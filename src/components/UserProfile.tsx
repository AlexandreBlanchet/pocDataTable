import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import DropZone from './DropZone';
import FileUpload from './FileUpload';
import CountrySelector from './CountrySelector';
import EditorToolbar from './EditorToolbar';
import React from 'react';
import { getDataTableRow, getUser } from '../utils/genesysCloudUtils';
import { Models } from 'purecloud-platform-client-v2';
import { useParams } from 'react-router';
import { ObjectType } from '../utils/types';
import { Grid, List, ListDivider, ListItem, ListItemButton, Radio, RadioGroup, Switch } from '@mui/joy';

export default function UserProfile({ objectsTypes } : { objectsTypes: ObjectType[]}) {
    const { id } = useParams();
    const [user, setUser] = React.useState<Models.User>()
    const [localObjectsTypes, setLocalObjectsTypes] = React.useState<ObjectType[]>(objectsTypes)

    React.useEffect(() => {
        getUser(id || '').then(user => setUser(user))
        getDataTableRow("d0129b44-f0aa-48ce-a30f-a798954e3de3", id || "").then( rgts => {
          const rights = JSON.parse(rgts.rights.toString())
          setLocalObjectsTypes(localObjectsTypes.map(objType => {
            let properties = objType.properties
            Object.keys(properties).map(property => properties[property].rights = rights[objType.id || ""] ? rights[objType.id || ""][properties[property].title] : "")
            return {...objType, rights: "", properties }
          }))
        }).catch(error => {
          setLocalObjectsTypes(localObjectsTypes.map(objType => {
            let properties = objType.properties
            Object.keys(properties).map(property => properties[property].rights = "")
            return {...objType, rights: "", properties }
          }))
        })
    }, [id])


  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Stack
        spacing={4}
        sx={{
          display: 'flex',
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Personal info</Typography>
            <Typography level="body-sm">
              Customize how your profile information will apper to the networks.
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
          >
            <Stack direction="column" spacing={1}>
              <AspectRatio
                ratio="1"
                maxHeight={200}
                sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                  srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                  loading="lazy"
                  alt=""
                />
              </AspectRatio>
              <IconButton
                aria-label="upload new picture"
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{
                  bgcolor: 'background.body',
                  position: 'absolute',
                  zIndex: 2,
                  borderRadius: '50%',
                  left: 100,
                  top: 170,
                  boxShadow: 'sm',
                }}
              >
                <EditRoundedIcon />
              </IconButton>
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormLabel>Name</FormLabel>
                <FormControl
                  sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                >
                  <Input disabled size="sm" placeholder="Name" value={user?.name} />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input size="sm" defaultValue="UI Developer" />
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    disabled
                    size="sm"
                    type="email"
                    value={user?.email}
                    startDecorator={<EmailRoundedIcon />}
                    placeholder="email"
                    defaultValue="siriwatk@test.com"
                    sx={{ flexGrow: 1 }}
                  />
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" variant="solid">
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
        {objectsTypes.map(objectType => 
          <Card>
            <Box sx={{ mb: 1 }}>
              <Typography level="title-md">{objectType.name}</Typography>
              <Typography level="body-sm">
                {objectType.description}
              </Typography>
              <Stack>
                    <List
                  component="div"
                  variant="outlined"
                  orientation='horizontal'
                  sx={{ borderRadius: 'sm', boxShadow: 'sm', mr: 'auto', mt: 2 }}
                >
                  {['Create', 'Read', 'Update', 'Delete'].map((value, index) => (
                    <React.Fragment key={value}>
                      {index !== 0 && <ListDivider />}
                      <ListItem>
                        <Switch
                          component="label"
                          size="sm"
                          startDecorator={value}
                          checked={objectType.rights.includes(value.charAt(0))}
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
                </Stack>
            </Box>
            <Divider />
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack  spacing={2} >
                 {Object.keys(objectType.properties).map(proprety =>
                  <FormControl sx={{ width: 200 }}>
                  <FormLabel>{objectType.properties[proprety].title}</FormLabel>{
                    <Stack
                    gap={1}
                    direction={"row"}
                    >
                  {['Create', 'Read', 'Update', 'Delete'].map((value, index) => (

                    <Button
                      size='sm'
                      color={objectType.properties[proprety].rights?.includes(value.charAt(0)) ? "primary" : "neutral"} variant={objectType.properties[proprety].rights?.includes(value.charAt(0)) ? "outlined" : "soft"}>
                    {value}
                  </Button>
                  ))}
                </Stack>
                  }
                </FormControl>
              )}
              
             
            </Stack>
            </Stack>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
