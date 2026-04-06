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

import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

import EmailIcon from '@mui/icons-material/Email';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import React from 'react';
import { getAllFlows,  getDataTableInfos, getDataTableRow } from '../utils/genesysCloudUtils';
import { useParams } from 'react-router';
import { Models } from 'purecloud-platform-client-v2';

export default function UserProfile() {
    const { id } = useParams();
    const [contactChannel, setContactChannel] = React.useState<any>()
    const [flows, setFlows] = React.useState<Models.Flow[]>([])

    React.useEffect(() => {
        getDataTableRow("d1571698-b5ca-4b7d-a1ac-d3a849d7968f", id || '').then(user => setContactChannel(user))
        getDataTableInfos("76dc6855-fc19-4de5-9d14-fbee2bf45843").then(dataTable => {
          console.log("datatable")
          console.log(dataTable)
        })
        getAllFlows().then(flows => setFlows(flows))
    }, [id])

     //   console.log(contactChannel)

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
            <Typography level="title-md">Contact channel</Typography>
            <Typography level="body-sm">
              Configure the information related to the contact channel
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormLabel>Point of contact</FormLabel>
                <FormControl
                  sx={{ display: { sm: 'flex-column', md: 'flex-row' }, width: 350, gap: 2 }}
                >
                  <Input size="sm" value={contactChannel?.key} />
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl  sx={{width: 300}}>
                  <FormLabel>Flow</FormLabel>
                    <Select
                        size="sm"
                        value={contactChannel?.FLOW}
                        >
                        {
                            flows.map(flow => 
                                <Option value="welcome_commercial_service">
                                    {flow.name}
                                </Option>
                            )
                        }
                        <Option value="welcome_commercial_service">
                            Welcome service commercial
                        </Option>
                        <Option value="welcome_sav">
                        Welcome service SAV
                        </Option>
                        <Option value="promotion143">
                            Promotion 1
                        </Option>
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 200 }}>
                  <FormLabel>Type</FormLabel>
                    <Select
                    size="sm"
                    startDecorator={contactChannel?.TYPE == "Appel entrant" ? <LocalPhoneIcon /> : <EmailIcon /> }
                    value={contactChannel?.TYPE}
                    >
                    <Option value="Appel entrant">
                      Appel entrant
                    </Option>
                    <Option value="Email entrant">
                      Email entrant
                    </Option>
                    </Select>
                </FormControl>
              </Stack>
               <Stack direction="row" spacing={2}>
                <FormControl sx={{width: 300}}>
                  <FormLabel>Welcome prompt</FormLabel>
                   <Select
                    size="sm"
                    startDecorator={<AudiotrackIcon /> }
                    value={contactChannel?.WELCOME_PROMPT}
                    >
                    <Option value="welcome_commercial_service">
                        Welcome service commercial
                    </Option>
                    <Option value="welcome_sav">
                      Welcome service SAV
                    </Option>
                    <Option value="promotion143">
                        Promotion 1
                    </Option>
                    </Select>
                </FormControl>
                <FormControl sx={{ width: 300 }}>
                  <FormLabel>Optional prompt</FormLabel>
                    <Select
                    size="sm"
                    startDecorator={<AudiotrackIcon /> }
                    value={contactChannel?.OPTIONAL_PROMPT}
                    >
                    <Option value="welcome_commercial_service">
                        Welcome service commercial
                    </Option>
                    <Option value="welcome_sav">
                      Welcome service SAV
                    </Option>
                    <Option value="promotion143">
                        Promotion 1
                    </Option>
                    </Select>
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
      </Stack>
    </Box>
  );
}
