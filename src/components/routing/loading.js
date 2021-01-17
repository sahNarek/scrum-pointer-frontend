import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography } from '@material-ui/core';

const Loading = () => ( 
  <Typography variant="h4">
    Loading
    <CircularProgress />
  </Typography>
  );
 
export default Loading;