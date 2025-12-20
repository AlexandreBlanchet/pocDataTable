
import { Box, Breadcrumbs, Divider, Link, Typography } from '@mui/joy';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import { ObjectType } from '../utils/types';


export default function Sidebar({ objectType } : {objectType: ObjectType}) {

  return (
    <>
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
            {objectType.name}
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
                 <Box sx={{ mb: 1 }}>
            <Typography level="title-md">{objectType.name}</Typography>
            <Typography level="body-sm">
              {objectType.description}
            </Typography>
          </Box>
        </Box>
    </>
  );
}
