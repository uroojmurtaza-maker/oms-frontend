

import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../../atoms/button/button";
import { MenuOutlined , KeyOutlined, LogoutOutlined, CloseOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Avatar, Space, message } from "antd";
import Spinner from "../../atoms/spinner/spinner";
import useApiHandler from "../../hooks/api-handler";
import { useAuth } from "../../context/authContext";

const Header = () => {
  const router = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {user, token} = useAuth()
  const refreshToken = localStorage.getItem("refreshToken");
  const [messageState, setMessageState] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Use API handler with token for logout and other operations
  const { postData, patchData, loading, apiMessage } = useApiHandler(token);
  
  const [messageApi, contextHolder] = message.useMessage();
  
  const showError = useCallback((msg) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  }, [messageApi]);
  
  // Show error message when apiMessage changes
  useEffect(() => {
    if (apiMessage) {
      showError(apiMessage);
    }
  }, [apiMessage, showError]);

  
  const links = [
    {
      title: "Ticket Dashboard",
      link: "/Support",
      roles: [
        "superadmin",
        "client-admin",
        "customer-support",
        "developer",
        "client-employee",
      ],
    },
    {
      title: "Clients",
      link: "/clients",
      roles: ["superadmin", "customer-support"],
    },
    { title: "Projects", link: "/projects", roles: ["client-admin"] },
    {
      title: "Employees",
      link: "/jabemployees-listing",
      roles: ["client-admin"],
    },
    {
      title: "JABG Users",
      link: "/jabemployees-listing",
      roles: ["superadmin", "customer-support"],
    },
    { title: "Control Panel", link: "/AdminDashboard", roles: ["superadmin"] },
    {
      title: "Website",
      link: "/",
      roles: [
        "superadmin",
        "client-admin",
        "customer-support",
        "developer",
        "client-employee",
      ],
    },
  ];

  const filteredLinks = links.filter((item) => item.roles.includes(user?.role));

  const logout = async () => {
    try {
      const payload = refreshToken ? { refreshToken: refreshToken } : {};
      
      // Use API handler for logout (skipAuth=false since we need token)
      await postData("/auth/logout", payload, false, false);
      
      // On successful response only, remove tokens and navigate to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router("/");
    } catch (err) {
      // Error is already handled by the API handler and shown via useEffect
      console.error("Logout error:", err);
      // Don't navigate or remove tokens on error - let the user see the error message
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <div
          onClick={() => setOpenPasswordModal(true)}
          className="flex items-center gap-2 text-gray-700 hover:text-primary"
        >
          <KeyOutlined /> Change Password
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div
          onClick={() => logout()}
          className="flex items-center gap-2 text-red-600 hover:text-primary"
        >
          <LogoutOutlined /> Logout
        </div>
      ),
    },
  ];

  const handleChangePassword = async () => {
    setOpenPasswordModal(false);

    setErrorShow(false);
    setModalMessage("");
    setShowModal(false);

    // ✅ Create a new payload without 'phone'

    const payload = {
      oldPassword: oldPass,
      newPassword: newPass,
    };

    try {
      await patchData(`/v1/auth/change-password`, payload);

      setErrorShow(false);
      setModalMessage("Password Changed Successfully");
      setShowModal(true);

    } catch (err) {
      console.error("Error creating user:", err);
      setOpenPasswordModal(false);

      setErrorShow(true);
      setModalMessage(err?.response?.data?.message || "Something went wrong!");
      setShowModal(true);
    }
  };

  return (
    <div>
      {contextHolder}
      <header className="bg-white shadow-sm w-full z-50 border-b border-gray-200 px-6">
        <div className="container mx-auto flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center leading-none gap-2 "
            // onClick={() => router("/Support")}
          >
            <img
              className="w-[2rem] md:w-[2.5rem] h-auto object-contain cursor-pointer"

              src={"https://cdn-icons-png.flaticon.com/512/4661/4661334.png"}
              alt="Logo"
              onClick={() => router("/")}
            />
            <div className="text-center text-xl font-semibold">
              Admin Panel
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-800 hover:text-primary focus:outline-none transition-colors duration-300"
            >
              <MenuOutlined style={{ fontSize: "28px" }} />
            </button>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-14">
              {filteredLinks?.map((item, index) => (
                <li key={index}>
                  <div
                    // to={item.link}
                    onClick={() => {
                      router(item.link);
                    }}
                    className={`transition-colors duration-300 text-md font-medium cursor-pointer ${
                      location.pathname === item.link
                        ? "text-primary underline font-semibold underline-offset-4"
                        : "hover:text-primary font-medium"
                    }`}
                  >
                    {item.title}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Profile Dropdown (Desktop Only) */}
          <div className="hidden sm:flex items-center">
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              trigger={["click"]}
              arrow
            >
              <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-1.5 shadow-sm hover:bg-gray-50 transition">
                <Avatar
                  src={user?.image || user?.company?.companyLogo}
                  size="medium"
                />
                <div className="flex flex-col text-left leading-tight mr-2">
                  <span className="text-gray-800 text-sm font-medium">
                    {user?.name || "User Name"}
                  </span>
                  <span className="text-gray-500 text-xs text-center">
                    {user?.role
                      ? user.role
                          .replace(/[-_]/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                      : "User"}
                  </span>
                </div>
                <DownOutlined className="text-gray-500 text-xs" />
              </button>

              
            </Dropdown>
          </div>
        </div>

        {/* Sidebar for Mobile Menu */}
        <div
          className={`fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col justify-between ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img className="w-8 h-8 object-contain" src={"https://cdn-icons-png.flaticon.com/512/4661/4661334.png"} alt="Logo" />
              <span className="font-semibold text-lg">Admin Panel</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-800 hover:text-primary"
            >
              <CloseOutlined style={{ fontSize: "22px" }} />
            </button>
          </div>

          {/* Menu Links */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="px-6 py-4 space-y-4">
              {filteredLinks?.map((item, index) => (
                <li key={index}>
                  <div
                    // to={item.link}
                    className={`block text-base font-medium transition-colors duration-300 cursor-pointer ${
                      location.pathname === item.link
                        ? "text-primary font-semibold"
                        : "text-gray-800 hover:text-primary"
                    }`}
                    onClick={() => {
                      router(item.link);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {item.title}
                  </div>
                </li>
              ))}

              {/* Profile-related Options inside menu for mobile */}
              {items?.map((opt) => (
                <li key={opt?.key}>
                  <div className="block text-gray-700 hover:text-primary transition-colors duration-200">
                    {opt?.label}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer (User Info) */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
            <Avatar icon={<UserOutlined />} size="large" />
            <div>
              <div className="text-gray-800 font-medium text-sm">
                Super Admin
              </div>
              <div className="text-gray-500 text-xs">Admin Account</div>
            </div>
          </div>
        </div>
      </header>

      {/* <ChangePasswordModal
        open={openPasswordModal}
        onClose={() => setOpenPasswordModal(false)}
        oldPass={oldPass}
        setOldPass={setOldPass}
        newPass={newPass}
        setNewPass={setNewPass}
        confirmPass={confirmPass}
        setConfirmPass={setConfirmPass}
        handleChange={handleChangePassword}
        // showAlert={showAlert} // <-- important
      /> */}

      {loading && <Spinner />}
    </div>
  );
};

export default Header;