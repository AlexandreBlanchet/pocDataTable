import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import React from 'react';
import { getAllFlows, getDataTable, getDataTableInfos, getDataTableRow } from '../utils/genesysCloudUtils';
import { useParams } from 'react-router';
import { Models } from 'purecloud-platform-client-v2';
import { ObjectType } from '../utils/types';
import { Grid } from '@mui/joy';
import HeaderPath from './HeaderPath';


const hasRight = (property: string, objectType: ObjectType, rightType: "C" | "R" | "U" | "D") => {
  if(objectType.properties[property].rights != undefined) {
    return objectType.properties[property].rights.includes(rightType)
  } else {
    return objectType.rights?.includes(rightType)
  }
  
}


export default function ObjectTypeElement({ objectType } : { objectType: ObjectType}) {
    const { id } = useParams();
    const [element, setElement] = React.useState<any>()
    const [flows, setFlows] = React.useState<Models.Flow[]>([])



    React.useEffect(() => {
        getDataTableRow(objectType.id, id || '').then(elem => setElement(elem))
        getDataTableInfos("76dc6855-fc19-4de5-9d14-fbee2bf45843").then(dataTable => {
          console.log("datatable")
          console.log(dataTable)
        })
        getAllFlows().then(flows => setFlows(flows))
    }, [id])

     //   console.log(contactChannel)

  return (
    <>
    <HeaderPath objectType={objectType}/>
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
            <FormControl sx={{ width: 200 }}>
              <FormLabel>{objectType.properties.key.title}</FormLabel>{
                <Input disabled size="sm" value={element && element.key} />
              }
            </FormControl>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                 {Object.keys(objectType.properties).filter(property => property != "key" && hasRight(property, objectType, "R")).map(property =>
                 <Grid>
                  <FormControl sx={{ width: 200 }}>
                  <FormLabel>{objectType.properties[property].title}</FormLabel>{
                   objectType.properties[property].type == 'string' &&
                      <Input disabled={!hasRight(property, objectType, "U")} size="sm" 
                        onChange={(e) => setElement({...element, [property]: e.target.value})}
                        value={element && element[property]} />
                  }
                </FormControl>
                </Grid>
              )}
              
             
            </Grid>
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
      </Stack>
    </Box>
    </>
  );
}
