import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
// import { NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';


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


const UserNavigation = ({signOutHandler}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <Button className={classes.title} onClick={signOutHandler}>
            SIGN OUT
          </Button>
          {/* <NavLink to="/about" className={classes.title}>
            <Typography variant="h6" className={classes.title}>
              SESSIONS
            </Typography>
          </NavLink> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
 
export default UserNavigation;