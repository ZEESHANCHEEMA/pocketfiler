import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import * as React from "react";
import { useDispatch } from "react-redux";
import { styled, useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Modal, Button } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Menu } from "@mui/material";

import { useMediaQuery } from "react-responsive";
import { requestPermission } from "../../utils/Firebase/firebase";
import { store } from "../../services/redux/store";

const drawerWidth = 310;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    height: "100%",
    overflowX: "hidden",
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      fontFamily: "ClashGrotesk",
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,

    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: "transparent",
  boxShadow: "none",
  paddingTop: "40px",

  borderBottom: "none",
  zIndex: "2",
}));

const AvatarTopDiv = styled("div")(({ theme }) => ({
  display: "none",
  position: "absolute",
  top: theme.spacing(1),
  right: theme.spacing(1),
  zIndex: theme.zIndex.drawer + 1,
  [theme.breakpoints.up("md")]: {
    width: "100%",
    minWidth: 768,
  },
  [theme.breakpoints.down("sm")]: {
    top: theme.spacing(1),
    left: theme.spacing(1),
    right: "auto",
    display: "flex",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-end",

    gap: theme.spacing(2),
  },
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  ...theme.mixins.toolbar,
  justifyContent: "end",
  padding: "26px 24px ",

  paddingTop: "0px",
  paddingBottom: 0,

  borderBottom: "none",
  zIndex: "2",
}));

const themeMui = createTheme({
  typography: {
    fontFamily: '"ClashGrotesk"',
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "transparent",
          },
        },
      },
    },
  },
});

export default function Sidebar({ children, showSidebar, PageName }) {
  const dispatch = useDispatch();
  const [userRoles, setUserRoles] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedRoute, setselectedRoute] = useState("");
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setUserRoles(userRole);
  }, [userRoles]);

  const theme = useTheme();
  const isMobile = useMediaQuery({
    query: "(max-width: 1064px)",
  });

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleListItemClick = (event, index) => {
    console.log("clicked", index);
    setSelectedItem((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const path = window.location.pathname;
    console.log(path, "pathpathpathpathƒ");

    if (path.includes("Project")) {
      setselectedRoute("Projects");
    } else {
      switch (path) {
        case "/Dashboard":
          setselectedRoute("Dashboard");
          break;
        case "/Clients":
          userRoles === "user"
            ? setselectedRoute("Associate")
            : setselectedRoute("Clients");
          break;
        case "/ClientReq":
          userRoles === "user"
            ? setselectedRoute("Associate Request")
            : setselectedRoute("Client Request");
          break;
        case "/AllContract":
          setselectedRoute("Contracts");
          break;
        case "/HelpCenter":
          setselectedRoute("Help");
          break;
        case "/Disputes":
          setselectedRoute("Dispute");
          break;
        case "/Profile":
          setselectedRoute("");
          break;
      }
    }
  }, [window.location.pathname]);

  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    console.log("drawer open");
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setMobileOpen(!mobileOpen);
    console.log("drawer closed");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const opens = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
    console.log("closing");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const userMenuItems = [
    { text: "Dashboard", path: "/Dashboard", disabled: false },
    { text: "Associate", path: "/Clients", disabled: false },
    { text: "Associate Request", path: "/ClientReq", disabled: false },
    { text: "Contracts", path: "/AllContract" },
    { text: "Help", path: "/HelpCenter" },
    { text: "Dispute", path: "/Disputes" },
  ];

  const organizationMenuItems = [
    { text: "Dashboard", path: "/Dashboard", disabled: false },
    { text: "Projects", path: "/ProjectsTable", disabled: false },
    { text: "Clients", path: "/Clients", disabled: false },
    { text: "Client Request", path: "/ClientReq", disabled: false },
    { text: "Contracts", path: "/AllContract" },
    { text: "Help", path: "/HelpCenter" },
    { text: "Dispute", path: "/Disputes" },
  ];

  const userIcons = [
    "/Images/Dashboard/home-smile.svg",
    "/Images/Dashboard/users-01.svg",
    "/Images/Clients/arrow.svg",
    "/Images/Dashboard/Contracts.svg",
    "/Images/Dashboard/headphones-02.svg",
    "/Images/Dashboard/dispute-icon.svg",
  ];

  const organizationIcons = [
    "/Images/Dashboard/home-smile.svg",
    "/Images/Dashboard/project-icon.svg",
    "/Images/Dashboard/users-01.svg",
    "/Images/Clients/arrow.svg",
    "/Images/Dashboard/Contracts.svg",
    "/Images/Dashboard/headphones-02.svg",
    "/Images/Dashboard/dispute-icon.svg",
  ];

  const menuItems =
    userRoles === "user" ? userMenuItems : organizationMenuItems;
  const icons = userRoles === "user" ? userIcons : organizationIcons;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    store.dispatch({ type: "RESET_STORE" });
    requestPermission();
  };
  async function Logout() {
    setShowModal(true);
  }
  return (
    <>
      <ThemeProvider theme={themeMui}>
        {showSidebar && (
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
              <Toolbar style={{ position: "relative", zIndex: "2" }}>
                {" "}
                <IconButton
                  color="#0000"
                  aria-label="open drawer"
                  onClick={isMobile ? handleDrawerToggle : handleDrawerOpen}
                  edge="start"
                  className="menu-icon-btn"
                  sx={{
                    mr: 2,
                    ...(open && { display: "none" }),
                    position: "absolute",
                    zIndex: 999,
                  }}
                >
                  <MenuIcon
                    style={{
                      position: "relative",
                      zIndex: 999,
                      color: "#000",
                      width: "30px",
                      height: "30px",
                      paddingRight: "5px",
                    }}
                    color={"black"}
                  />
                </IconButton>
                <div className="d-flex flex-column d-none">
                  <AvatarTopDiv
                    style={{ boxShadow: "none", zIndex: 1, display: "none" }}
                  >
                    <div
                      id="basic-button"
                      className="Avatar-top-div"
                      aria-controls={opens ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={opens ? "true" : undefined}
                    >
                      <div>
                        <p
                          className={open ? "welcome-txt" : "welcome-txt-space"}
                        >
                          {PageName}
                        </p>
                      </div>
                      <div className="notify-search">
                        <div>
                          <div className="setting-notify">
                            <div className="nav__Right">
                              {/* <img src={Search} alt="Logo" /> */}
                              <Dropdown className="navbar__notification">
                                <Dropdown.Toggle className="navbar__notification__dropdown">
                                  <img
                                    src="/Images/Dashboard/notification.svg"
                                    alt="notification"
                                  />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                  <div className="notify-top">
                                    <h2 className="navbar__notification__dropdown__title">
                                      Today
                                    </h2>
                                    <p className="mark-read">Mark as read</p>
                                  </div>

                                  <div className="notify-cards">
                                    <Dropdown.Item href="">
                                      <div className="notify-cancel">
                                        <div>
                                          <img
                                            src="/Images/Dashboard/notigy-lock-alert.svg"
                                            alt="notify-lock"
                                          />
                                        </div>
                                        <div>
                                          <p className="Contract-cancel-head">
                                            Contract cancel
                                          </p>
                                          <p className="Cancel-des">
                                            Sed ut perspiciatis unde omnis iste
                                            natus error sit<br></br> voluptatem
                                            accusantium doloremque.
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      <div className="notify-cancel notify-pt">
                                        <div>
                                          <img
                                            src="/Images/Dashboard/notify-lock-icon.svg"
                                            alt="notify-lock"
                                          />
                                        </div>

                                        <div className="notify-bluedot-subtxt">
                                          <div>
                                            <p className="Contract-cancel-head">
                                              Password changed
                                            </p>

                                            <p className="Cancel-des">
                                              Your account password successfully
                                              updated.
                                            </p>
                                          </div>

                                          <div className="blue-dot"></div>
                                        </div>
                                      </div>
                                    </Dropdown.Item>

                                    <h2 className="navbar__notification__dropdown__title notify-day-pt">
                                      Yesterday
                                    </h2>

                                    <Dropdown.Item href="">
                                      <div className="notify-cancel">
                                        <div>
                                          <img
                                            src="/Images/Dashboard/notigy-lock-alert.svg"
                                            alt="notify-lock"
                                          />
                                        </div>
                                        <div>
                                          <p className="Contract-cancel-head">
                                            Contract cancel
                                          </p>
                                          <p className="Cancel-des">
                                            Sed ut perspiciatis unde omnis iste
                                            natus error sit<br></br> voluptatem
                                            accusantium doloremque.
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      <div className="notify-cancel notify-pt">
                                        <div>
                                          <img
                                            src="/Images/Dashboard/notify-lock-icon.svg"
                                            alt="notify-lock"
                                          />
                                        </div>

                                        <div className="notify-bluedot-subtxt">
                                          <div>
                                            <p className="Contract-cancel-head">
                                              Password changed
                                            </p>

                                            <p className="Cancel-des">
                                              Your account password successfully
                                              updated.
                                            </p>
                                          </div>

                                          <div className="blue-dot"></div>
                                        </div>
                                      </div>
                                    </Dropdown.Item>

                                    <Dropdown.Item href="">
                                      <div className="notify-cancel notify-pt">
                                        <div>
                                          <img
                                            src="/Images/Dashboard/notigy-lock-alert.svg"
                                            alt="notify-lock"
                                          />
                                        </div>
                                        <div>
                                          <p className="Contract-cancel-head">
                                            Contract cancel
                                          </p>
                                          <p className="Cancel-des">
                                            Sed ut perspiciatis unde omnis iste
                                            natus error sit<br></br> voluptatem
                                            accusantium doloremque.
                                          </p>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                      <div className="notify-cancel notify-pt">
                                        <div>
                                          <img
                                            src="/Images/Dashboard/notify-lock-icon.svg"
                                            alt="notify-lock"
                                          />
                                        </div>

                                        <div className="notify-bluedot-subtxt">
                                          <div>
                                            <p className="Contract-cancel-head">
                                              Password changed
                                            </p>

                                            <p className="Cancel-des">
                                              Your account password successfully
                                              updated.
                                            </p>
                                          </div>

                                          <div className="blue-dot"></div>
                                        </div>
                                      </div>
                                    </Dropdown.Item>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <Avatar
                            alt="Profile Picture"
                            src="/Images/Dashboard/profile.svg"
                            sx={{
                              width: 60,
                              height: 60,
                            }}
                            className="avatar-img"
                          />
                        </div>
                      </div>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={opens}
                        onClose={handleClose}
                        MenuListProps={{
                          "aria-labelledby": "basic-button",
                        }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      ></Menu>
                    </div>
                  </AvatarTopDiv>
                </div>
              </Toolbar>
            </AppBar>
            {!isMobile && (
              <Drawer
                PaperProps={{
                  sx: {
                    backgroundColor: " #fff",
                  },
                }}
                style={{ zIndex: 1, position: "relative" }}
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,

                  "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                  },
                }}
                variant="persistent"
                anchor="left"
                open={open}
              >
                <div className="sidebar__top-div">
                  <div>
                    <div className="wfetg">
                      <DrawerHeader
                        sx={{ display: "flex", alignItems: "flex-end" }}
                      >
                        <IconButton
                          onClick={handleDrawerClose}
                          style={{ color: "#000" }}
                          className="sidebar__icon"
                        >
                          {theme.direction === "ltr" ? (
                            <ChevronLeftIcon />
                          ) : (
                            <ChevronRightIcon />
                          )}
                        </IconButton>
                      </DrawerHeader>
                    </div>

                    <img
                      src="/Images/pocketfiler_logo.png"
                      alt="logo"
                      className="web__logo "
                    />
                    <Divider />
                    <div className="sidebar__border"></div>
                    <List className="List-div">
                      {menuItems?.map(({ text, path, disabled }, index) => (
                        <ListItem
                          key={text}
                          disablePadding
                          divider={false}
                          sx={{
                            fontSize: "14px",
                            fontWeight: "500",
                            lineHeight: "22.4px",
                          }}
                          className={
                            text === selectedRoute ? "list-item-active" : ""
                          }
                        >
                          <ListItemButton
                            component={Link}
                            to={path}
                            onClick={(event) =>
                              handleListItemClick(event, index)
                            }
                            selected={text === selectedRoute}
                            className={
                              text === selectedRoute
                                ? "list-item-active"
                                : "list-item"
                            }
                            sx={{
                              "& .MuiListItemText-root": {
                                fontSize: "14px",
                              },
                              "& .MuiListItemText-primary": {
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#0a1126",
                                letterSpacing: "1px",
                              },

                              "&.Mui-selected": {
                                backgroundColor: "transparent",
                              },
                            }}
                          >
                            <ListItemIcon
                              minWidth={"24px"}
                              className="list-icons"
                              selected={index === selectedItem}
                              onClick={(event) =>
                                handleListItemClick(event, index)
                              }
                              sx={{
                                "& ..MuiListItemIcon-root": {
                                  minWidth: "24px",
                                },
                              }}
                            >
                              <img
                                src={icons[index]}
                                alt={`Icon ${index + 1}`}
                              />
                            </ListItemIcon>
                            <ListItemText
                              selected={index === selectedItem}
                              className={
                                index === selectedItem
                                  ? "list-item"
                                  : "list-item"
                              }
                              primary={text}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>

                    <List className="List-div" sx={{ paddingTop: "0px" }}>
                      <div
                        onClick={() => {
                          Logout();
                        }}
                        className="sidebar__logout  "
                      >
                        <img src="/Images/Dashboard/logout.svg" alt="/" />
                        <p>Logout</p>
                      </div>
                    </List>
                  </div>
                  {/* <div>
                    <List>
                      <div className="sidebar__bottom">
                        <img src="/Images/Dashboard/illustartion.png" alt="/" />
                        <p>
                          Subscribe to <br /> unlimited contracts
                        </p>
                        <button
                          onClick={() => {
                            navigate("/Subscription");
                          }}
                        >
                          Upgrade
                        </button>
                      </div>
                    </List>
                  </div> */}
                </div>
              </Drawer>
            )}

            {isMobile && (
              <Drawer
                PaperProps={{
                  sx: {
                    backgroundColor: "#fff",
                  },
                }}
                sx={{
                  width: 250,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                  },
                }}
                variant="persistent"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
              >
                <DrawerHeader
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "80px",
                    paddingBottom: "35px",
                  }}
                >
                  <img
                    src="/Images/Dashboard/pocketfiler - logo.svg"
                    className=" wweb__logo"
                    alt="Logo"
                  />
                  <IconButton
                    onClick={handleDrawerClose}
                    style={{ color: "#000" }}
                  >
                    {theme.direction === "ltr" ? (
                      <ChevronLeftIcon />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                </DrawerHeader>

                <Divider />
                <div className="sidebar__border"></div>
                <List className="List-div">
                  {menuItems?.map(({ text, path, disabled }, index) => (
                    <ListItem
                      key={text}
                      disablePadding
                      className={
                        index === selectedItem ? "list-item" : "list-item"
                      }
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <ListItemButton
                        component={Link}
                        to={path}
                        onClick={(event) => handleListItemClick(event, index)}
                        selected={index === selectedItem}
                        className={
                          index === selectedItem
                            ? "list-item-active"
                            : "list-item"
                        }
                        sx={{
                          "& .MuiListItemText-root": {
                            fontSize: "14px",
                          },
                          "& .MuiListItemText-primary": {
                            fontSize: "14px",
                          },
                        }}
                      >
                        <ListItemIcon
                          minWidth={"24px"}
                          className="list-icons"
                          selected={index === selectedItem}
                          sx={{
                            "& ..MuiListItemIcon-root": {
                              minWidth: "24px",
                            },
                          }}
                        >
                          <img src={icons[index]} alt={`Icon ${index + 1}`} />
                        </ListItemIcon>
                        <ListItemText
                          selected={index === selectedItem}
                          className={
                            index === selectedItem ? "list-item" : "list-item"
                          }
                          primary={text}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>

                <Divider />

                <List className="List-div" sx={{ paddingTop: "0px" }}>
                  <div
                    onClick={() => {
                      Logout();
                    }}
                    className=" sidebar-log-mb"
                  >
                    <img src="/Images/Dashboard/logout.svg" alt="/" />
                    <p>Logout</p>
                  </div>
                </List>
                <List>
                  <div className="sidebar__bottom">
                    <img src="/Images/Dashboard/illustartion.png" alt="/" />
                    <p>Subscribe to unlimited contracts</p>
                    <button
                      onClick={() => {
                        navigate("/Subscription");
                      }}
                    >
                      Upgrade
                    </button>
                  </div>
                </List>
              </Drawer>
            )}

            <Main
              open={open}
              sx={{
                backgroundColor: "var(--grey-0-primary-screen-color, #F9F9FC)",
                height: "100vh",

                paddingLeft: isMobile ? "65px" : "50px",
              }}
            >
              {children}
            </Main>
          </Box>
        )}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body className="text-center p-4">
            <div className="d-flex justify-content-center mb-3">
              <img
                src="/Images/Dashboard/logout.svg"
                alt="Logout"
                style={{ width: "80px", height: "80px" }}
              />
            </div>
            <h5 className="mb-3">Are you sure you want to logout?</h5>
            <p className="text-muted">
              You will be logged out from your account.
            </p>
          </Modal.Body>
          <Modal.Footer className="border-0 d-flex justify-content-center">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              No, Stay Logged In
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              Yes, Logout
            </Button>
          </Modal.Footer>
        </Modal>
      </ThemeProvider>
    </>
  );
}
