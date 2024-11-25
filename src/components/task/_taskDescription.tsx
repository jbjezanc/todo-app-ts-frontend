import React, { FC, ReactElement } from 'react';
import { Typography, Box } from '@mui/material';
import PropTypes from 'prop-types';

import { ITaskDescription } from './interfaces/ITaskDescription';

export const TaskDescription: FC<ITaskDescription> = (props): ReactElement => {
  const { description = 'Lorem ipsum dolor sit amet' } = props;

  return (
    <Box>
      <Typography>{description}</Typography>
    </Box>
  );
};

TaskDescription.propTypes = {
  description: PropTypes.string,
};
