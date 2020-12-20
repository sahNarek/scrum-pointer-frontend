import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#f50057"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: "white"
  }
}));


const NavigationBar = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <NavLink to="/sign_up" className={classes.title} replace>
            <Typography variant="h6" className={classes.title}>
              SIGN UP
            </Typography>
          </NavLink>
          <NavLink to="/sign_in" className={classes.title}>
            <Typography variant="h6" className={classes.title}>
              SIGN IN
            </Typography>
          </NavLink>
          <NavLink to="/about" className={classes.title}>
            <Typography variant="h6" className={classes.title}>
              ABOUT
            </Typography>
          </NavLink>
        </Toolbar>
      </AppBar>
    </div>
  );
}
 
export default NavigationBar;