import React, { useContext, useState } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { LuActivity } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext.jsx";
import Logo from "../assets/HSL.png";

function Sidebar() {
  const [open, setOpen] = useState(0);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/"), 1000);
  };

  return (
    <Card className="w-full max-w-[20rem] p-4 shadow-lg bg-white min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 p-4">
        <img src={Logo} alt="logo" className="h-8 w-8" />
        <Typography variant="h5" className="text-blue-gray-800 font-bold">
          HealthSaathi
        </Typography>
      </div>

      <List className="gap-2">
        {/* Dashboard Accordion */}
        <Accordion
          open={open === 1}
          icon={
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
            />
          }
        >
          <Link to="/pharma/dashboard">
            <ListItem>
              <ListItemPrefix>
                <LuActivity className="h-5 w-5" />
              </ListItemPrefix>
              Dashboard
            </ListItem>
          </Link>
          <ListItem className="p-0" selected={open === 1}>
            <AccordionHeader
              onClick={() => handleOpen(1)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <PresentationChartBarIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-medium text-blue-gray-800">
                Analytics
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="/pharma/dashboard/orders">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon className="h-4 w-4" />
                  </ListItemPrefix>
                  Orders
                </ListItem>
              </Link>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon className="h-4 w-4" />
                </ListItemPrefix>
                Customers
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>

        {/* Medicines Accordion */}
        <Accordion
          open={open === 2}
          icon={
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
            />
          }
        >
          <ListItem className="p-0" selected={open === 2}>
            <AccordionHeader
              onClick={() => handleOpen(2)}
              className="border-b-0 p-3"
            >
              <ListItemPrefix>
                <ShoppingBagIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="mr-auto font-medium text-blue-gray-800">
                Medicines
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <Link to="/pharma/dashboard/upload-medicine">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon className="h-4 w-4" />
                  </ListItemPrefix>
                  Upload Medicine
                </ListItem>
              </Link>
              <Link to="/pharma/dashboard/manage-medicine">
                <ListItem>
                  <ListItemPrefix>
                    <ChevronRightIcon className="h-4 w-4" />
                  </ListItemPrefix>
                  Manage Medicine
                </ListItem>
              </Link>
            </List>
          </AccordionBody>
        </Accordion>

        <hr className="my-3 border-blue-gray-100" />

        {/* Inbox */}
        <ListItem>
          <ListItemPrefix>
            <InboxIcon className="h-5 w-5" />
          </ListItemPrefix>
          Inbox
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              className="rounded-full"
              variant="ghost"
              color="blue-gray"
            />
          </ListItemSuffix>
        </ListItem>

        {/* Profile */}
        <ListItem>
          <ListItemPrefix>
            <UserCircleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Profile
        </ListItem>

        {/* Settings */}
        <ListItem>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>

        {/* Logout */}
        <ListItem onClick={handleLogout} className="cursor-pointer">
          <ListItemPrefix>
            <PowerIcon className="h-5 w-5 text-red-500" />
          </ListItemPrefix>
          <span className="text-red-500">Log Out</span>
        </ListItem>
      </List>
    </Card>
  );
}

export default Sidebar;
