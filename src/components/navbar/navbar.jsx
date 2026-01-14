import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MenuOutlined,
  KeyOutlined,
  LogoutOutlined,
  CloseOutlined,
  DownOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Dropdown, Avatar, Space, message, Modal, Form, Input, Button } from 'antd';
import Spinner from '../../atoms/spinner/spinner';
import useApiHandler from '../../hooks/api-handler';
import { useAuth } from '../../context/authContext';

const Header = () => {
  const router = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [changePasswordForm] = Form.useForm();
  const { user, token } = useAuth();

  const { postData, putData, loading, apiMessage } = useApiHandler(token);

  const [messageApi, contextHolder] = message.useMessage();

  const showError = useCallback(
    (msg) => {
      messageApi.open({
        type: 'error',
        content: msg
      });
    },
    [messageApi]
  );

  const showSuccess = useCallback(
    (msg) => {
      messageApi.open({
        type: 'success',
        content: msg
      });
    },
    [messageApi]
  );

  useEffect(() => {
    if (apiMessage) {
      showError(apiMessage);
    }
  }, [apiMessage, showError]);

  const handleChangePassword = async () => {
    try {
      const values = await changePasswordForm.validateFields();

      // Check if new password and confirm password match
      if (values.newPassword !== values.confirmPassword) {
        showError('New password and confirm password do not match!');
        return;
      }

      const data = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      };

      await putData('/auth/change-password', data, false, false);
      showSuccess('Password changed successfully!');
      setChangePasswordModalOpen(false);
      changePasswordForm.resetFields();
    } catch (err) {
      // Error is already handled by the API handler
      if (err?.errorFields) {
        // Form validation error

        console.error('Form validation failed:', err);
      } else {
        console.error('Change password error:', err);
      }
    }
  };

  const logout = async () => {
    try {
      await postData('/auth/logout', {}, false, false);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      router('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const items = [
    
    {
      key: '0',
      label: (
          <Link to={'/profile'}>
          <div
            className='flex items-center gap-2 text-gray-700 hover:text-primary'
          >
            <UserOutlined /> Profile
          </div>
        </Link>
      )
    },
    {
      key: '1',
      label: (
        <div
          onClick={() => setChangePasswordModalOpen(true)}
          className='flex items-center gap-2 text-gray-700 hover:text-primary cursor-pointer'
        >
          <KeyOutlined /> Change Password
        </div>
      )
    },
    {
      key: '2',
      label: (
        <div
          onClick={() => logout()}
          className='flex items-center gap-2 text-red-600 hover:text-primary'
        >
          <LogoutOutlined /> Logout
        </div>
      )
    }
  ];

 

  return (
    <div>
      {contextHolder}
      <header className='bg-white shadow-sm w-full z-50 border-b border-gray-200 px-6'>
        <div className='container mx-auto flex items-center justify-between h-16'>
          {/* Logo */}
          <div
            className='flex items-center leading-none gap-2 '
            // onClick={() => router("/Support")}
          >
            <img
              className='w-[2rem] md:w-[2.5rem] h-auto object-contain cursor-pointer'
              src={'https://cdn-icons-png.flaticon.com/512/4661/4661334.png'}
              alt='Logo'
              onClick={() => router('/')}
            />
            <div className='text-center text-xl font-semibold'>Admin Panel</div>
          </div>
          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className='text-gray-800 hover:text-primary focus:outline-none transition-colors duration-300'
            >
              <MenuOutlined style={{ fontSize: '28px' }} />
            </button>
          </div>
          {/* Profile Dropdown (Desktop Only) */}
          <div className='hidden sm:flex items-center'>
            <Dropdown
              menu={{ items }}
              placement='bottomRight'
              trigger={['click']}
              arrow
            >
              <button className='flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-1.5 shadow-sm hover:bg-gray-50 transition'>
                <Avatar
                  src={user?.image || user?.company?.companyLogo}
                  size='medium'
                />
                <div className='flex flex-col text-left leading-tight mr-2'>
                  <span className='text-gray-800 text-sm font-medium'>
                    {user?.name || 'User Name'}
                  </span>
                  <span className='text-gray-500 text-xs text-center'>
                    {user?.role
                      ? user.role
                          .replace(/[-_]/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                      : 'User'}
                  </span>
                </div>
                <DownOutlined className='text-gray-500 text-xs' />
              </button>
            </Dropdown>
          </div>
        </div>

        {/* Sidebar for Mobile Menu */}
        <div
          className={`fixed inset-0 z-50 bg-black bg-opacity-40 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col justify-between ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Header */}
          <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200'>
            <div className='flex items-center gap-2'>
              <img
                className='w-8 h-8 object-contain'
                src={'https://cdn-icons-png.flaticon.com/512/4661/4661334.png'}
                alt='Logo'
              />
              <span className='font-semibold text-lg'>Admin Panel</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className='text-gray-800 hover:text-primary'
            >
              <CloseOutlined style={{ fontSize: '22px' }} />
            </button>
          </div>

        {/* Menu Links */}
        <nav className='flex-1 overflow-y-auto'>
            <ul className='px-6 py-4 space-y-4'>
             

              {/* Profile-related Options inside menu for mobile */}
              {items?.map((opt) => (
                <li key={opt?.key}>
                  <div className='block text-gray-700 hover:text-primary transition-colors duration-200'>
                    {opt?.label}
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          


          {/* Footer (User Info) */}
          <div className='border-t border-gray-200 px-6 py-4 flex items-center gap-3'>
            <Avatar icon={<UserOutlined />} size='large' />
            <div>
              <div className='text-gray-800 font-medium text-sm'>
                {user?.name || 'User Name'}
              </div>
              <div className='text-gray-500 text-xs'>{user?.role
                      ? user.role
                          .replace(/[-_]/g, ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                      : 'User'}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        open={changePasswordModalOpen}
        onCancel={() => {
          setChangePasswordModalOpen(false);
          changePasswordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          className="mt-4"
        >
          <Form.Item
            name="oldPassword"
            label="Old Password"
            rules={[
              { required: true, message: 'Please enter your old password!' }
            ]}
          >
            <Input.Password
              placeholder="Enter old password"
              className="w-full"
              size='large'
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter your new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              placeholder="Enter new password"
              className="w-full"
              size='large'
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                }
              })
            ]}
          >
            <Input.Password
              placeholder="Confirm new password"
              className="w-full"
              size='large'
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setChangePasswordModalOpen(false);
                  changePasswordForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-primary hover:bg-[#E1AB20]"
              >
                Change Password
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {loading && <Spinner />}
    </div>
  );
};

export default Header;
