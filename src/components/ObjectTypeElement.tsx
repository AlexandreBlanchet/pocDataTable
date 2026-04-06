import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import React from 'react';
import { getAllFlows, getDataTableRow, getDataTableRows, putDataTableRow } from '../utils/genesysCloudUtils';
import { useParams } from 'react-router';
import { ObjectType } from '../utils/types';
import { Grid } from '@mui/joy';
import HeaderPath from './HeaderPath';


const hasRight = (property: string, objectType: ObjectType, rightType: "C" | "R" | "U" | "D") => {
  if(!property || !objectType || !objectType?.properties[property] || objectType?.properties[property].rights) {
    return
  }
  if(objectType?.properties[property].rights != undefined) {
    return objectType?.properties[property]?.rights?.includes(rightType) || false
  } else {
    return objectType?.rights?.includes(rightType)
  }
  
}


export default function ObjectTypeElement({ objectType } : { objectType: ObjectType}) {
    const { id } = useParams();
    const [element, setElement] = React.useState<any>()
    const [sources, setSources] = React.useState<{[key:string]: {label: string, key: string} []}>({})

    const save = () => {
      console.log(element)
      putDataTableRow(objectType.id, id || "", {body: {...element}})
    }
     
    React.useEffect(() => {
      getDataTableRows("d0557cdc-f954-4022-b72f-dbf2dfa3ddae").then(sourceFieds => {
        const fields: string [] = sourceFieds.entities?.filter((source:any) => Object.values(objectType.properties).find(prop => (objectType.id + "." + prop.title) == source.key)).map((source: any) => source.key) || []
        fields?.map(field => {
          const fieldId = field.split(".")[1]
          getDataTableRow("d0557cdc-f954-4022-b72f-dbf2dfa3ddae", field).then((sourceField: any) => {
            console.log(sourceField)
            if(sourceField.sourceType == "datatable") {
              setSources(sources => {return {...sources, [fieldId]:[]}})
              getDataTableRows(sourceField.source).then((sourceElems: any) => {
                sourceElems.entities?.map((sourceKey: any) => {
                  getDataTableRow(sourceField.source, sourceKey.key).then((sourceElem: any) => {
                    setSources(sources => { return {...sources, [fieldId]: [...sources[fieldId], {label: sourceElem[sourceField.sourceFieldLabel], key: sourceElem[sourceField.sourceFieldValue]}]}})
                  })
                })
              })
            }

            if(sourceField.sourceType == "genesysEndpoint") {
              switch(sourceField.source){
                case "flows": 
                  getAllFlows().then(flows => setSources(sources => { return {...sources, [fieldId]: flows.map((flow: any) => { return {label: flow[sourceField.sourceFieldLabel], key: flow[sourceField.sourceFieldValue]}})}}))
                  
                break;
              }
            }
          
          })
        })
      })
    }, [])
    
    React.useEffect(() => {
      if(!id) {
        return
      }
      getDataTableRow(objectType.id, id || '').then(elem => setElement(elem))
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
                    sources[objectType.properties[property].title] ? <>
                    <Select size='sm' disabled={!hasRight(property, objectType, "U")} value={element && element[property]} onChange={(_, value) => setElement({...element, [property]: value})}>
                      {sources[objectType.properties[property].title].map(sourceElem => <Option value={sourceElem.key}>{sourceElem.label}</Option>)}
                  </Select></> :
                  <>{objectType.properties[property].type == 'string' &&
                      <Input disabled={!hasRight(property, objectType, "U")} size="sm" 
                        onChange={(e) => setElement({...element, [property]: e.target.value})}
                        value={element && element[property]} />}</>
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
              <Button size="sm" variant="solid" onClick={() => save()}>
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
