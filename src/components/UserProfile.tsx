import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

import React from 'react';
import { getDataTableRow, getUser, postDataTableRow, putDataTableRow } from '../utils/genesysCloudUtils';
import { Models } from 'purecloud-platform-client-v2';
import { useParams } from 'react-router';
import { ObjectType } from '../utils/types';
import {  List, ListDivider, ListItem,  Switch } from '@mui/joy';


const updateRights = (rights: string, rightToUpdate: string) => {
  rights = rights || ""
  return rights.includes(rightToUpdate) ? rights.replace(rightToUpdate, "") : (rights + rightToUpdate) 

}

export default function UserProfile({ objectsTypes } : { objectsTypes: ObjectType[]}) {
    const { id } = useParams();
    const [user, setUser] = React.useState<Models.User>()
    const [localObjectsTypes, setLocalObjectsTypes] = React.useState<ObjectType[]>([])
    const [userKey, setUserKey] = React.useState<string>()

    React.useEffect(() => {
        getUser(id || '').then(user => setUser(user))

        objectsTypes.map(objectsTypes => {
          objectsTypes.rights =  ""
          Object.keys(objectsTypes.properties).map(property => {
            delete objectsTypes.properties[property].rights
          })
        })


        getDataTableRow("d0129b44-f0aa-48ce-a30f-a798954e3de3", id || "").then( (rgts: any) => {
          setUserKey(rgts.key || "")
          const rights = JSON.parse(rgts.rights.toString())
          setLocalObjectsTypes(objectsTypes.map(objType => {
            let properties = objType.properties
            Object.keys(properties).map(property => properties[property].rights = rights[objType.id || ""] ? rights[objType.id || ""][properties[property].title] : undefined)
            return {...objType, rights: rights[objType.id || ""] ? rights[objType.id || ""].all : "" , properties }
          }))
        }).catch(error => {
          setLocalObjectsTypes(objectsTypes)
        })
    }, [id])

  const save = () => {
    let createRightsRow: any = {}
    localObjectsTypes.map((obj: ObjectType) => {
      createRightsRow[obj.id] = {all:obj.rights}
      Object.keys(obj.properties).map(key => {
        if(obj.properties[key].rights) {
          createRightsRow[obj.id][obj.properties[key].title] = obj.properties[key].rights
        }
      })
    })
    console.log(JSON.stringify(createRightsRow))
    if(userKey) {
      putDataTableRow("d0129b44-f0aa-48ce-a30f-a798954e3de3", userKey, {body: {key: userKey, rights: JSON.stringify(createRightsRow)}})
    } else {
      postDataTableRow("d0129b44-f0aa-48ce-a30f-a798954e3de3", {key: id, rights: JSON.stringify(createRightsRow)})
    }


  }


  return (
    <Box sx={{ flex: 1, width: '100%', overflow: 'auto' }}>
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
              <Button size="sm" variant="solid" onClick={() => save()}>
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
        {localObjectsTypes.sort((a, b) => {
          return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1 
        }).map(objectType => 
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
                          onChange={(e) => {
                            let elems: ObjectType[] = []
                            elems = [...localObjectsTypes.filter(objType =>  objType.name != objectType.name), {
                              ...objectType,
                              rights: updateRights(objectType.rights, value.charAt(0))
                            }]

                            if(value == "Create" || value == "Delete") {
                              setLocalObjectsTypes([...elems])
                              return
                            }

                            console.log("heeere")

                            Object.keys(objectType.properties).map(property => {
                              const rights = objectType.properties[property].rights
                              if(rights != undefined) {
                                console.log(rights)
                                let selectedObj = elems.find(objType =>  objType.name == objectType.name) || objectType
                                const newRights = rights.includes(value.charAt(0)) ? (!e.target.checked ? updateRights(rights, value.charAt(0)) : rights) : (e.target.checked ? updateRights(rights, value.charAt(0)) : rights )
                                console.log(newRights)

                                elems = [...elems.filter(objType =>  objType.name != objectType.name), {
                                ...selectedObj,
                                properties: {
                                  ...selectedObj.properties,
                                  [property]: {
                                    ...selectedObj.properties[property],
                                    rights: newRights
                                  }
                                }
                              }]

                              selectedObj = elems.find(objType =>  objType.name == objectType.name) || objectType
                              if(newRights.length == selectedObj.rights.replace("C", "").replace("D", "").length && newRights.split("").every(char => selectedObj.rights.includes(char))) {
                                  delete selectedObj.properties[property].rights;
                                }
                              }
                            })

                            setLocalObjectsTypes([...elems])

                          }}
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
                 {Object.keys(objectType.properties).map(property =>
                  <FormControl sx={{ width: 200 }} key={property}>
                  <FormLabel>{objectType.properties[property].title}</FormLabel>{
                    <Stack
                    gap={1}
                    direction={"row"}
                    >
                  {['Read', 'Update'].map((value, index) => {
                    
                    const rights = objectType.properties[property].rights != undefined ? objectType.properties[property].rights : objectType.rights.replace("C", "").replace("D", "")
                    return (
                    <Button
                      size='sm'
                      onClick={() => {
                        setLocalObjectsTypes([...localObjectsTypes.filter(objType =>  objType.name != objectType.name), {
                          ...objectType,
                          properties: {
                            ...objectType.properties,
                            [property]: {
                              ...objectType.properties[property],
                              rights: updateRights(rights, value.charAt(0))
                            }
                          }
                        }])
                      }}
                      color={rights?.includes(value.charAt(0)) ? "primary" : "neutral"} variant={rights?.includes(value.charAt(0)) ? "outlined" : "soft"}>
                    {value}
                  </Button>
                  )}
                  )}
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
