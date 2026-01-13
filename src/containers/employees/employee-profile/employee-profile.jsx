import React, { useState, useEffect, useCallback } from 'react';
import { Avatar, Card, message, Tag } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  DollarOutlined,
  IdcardOutlined,
  EditOutlined,
  TeamOutlined,
  // BriefcaseOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../layout/layout';
import PageHeader from '../../../components/page-header/page-header';
import Button from '../../../atoms/button/button';
import useApiHandler from '../../../hooks/api-handler';
import { useAuth } from '../../../context/authContext';
import Spinner from '../../../atoms/spinner/spinner';
import dayjs from 'dayjs';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { getData, loading, apiMessage } = useApiHandler(token);
  const [messageApi, contextHolder] = message.useMessage();
  const [employee, setEmployee] = useState(null);
  const [fetching, setFetching] = useState(false);

  const showError = useCallback(
    (msg) => {
      messageApi.open({
        type: 'error',
        content: msg,
      });
    },
    [messageApi]
  );

  useEffect(() => {
    if (apiMessage) {
      showError(apiMessage);
    }
  }, [apiMessage, showError]);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (!id) return;

      setFetching(true);
      try {
        const response = await getData(`/users/get-employee/${id}`);
        const employeeData = response?.employee || response?.data || response;
        setEmployee(employeeData);
      } catch (err) {
        console.error('Error fetching employee:', err);
        showError('Failed to load employee data');
      } finally {
        setFetching(false);
      }
    };

    fetchEmployee();
  }, [id, getData, showError]);

  if (fetching || loading) {
    return (
      <Layout>
        {contextHolder}
        <Spinner />
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        {contextHolder}
        <PageHeader
          title="Employee Profile"
          onBack={() => navigate('/dashboard')}
        />
        <div className="bg-white p-8 rounded-lg shadow-md mt-4 text-center">
          <p className="text-gray-500 text-lg">Employee not found</p>
        </div>
      </Layout>
    );
  }

  const profilePicture =
    employee.profilePicture ||
    employee.profilePictureUrl ||
    employee.image ||
    employee.avatar;

  const formatDate = (dateString) => {
    if (!dateString) return '----';
    return dayjs(dateString).format('MMMM DD, YYYY');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '----';
    return `$${parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = (status) => {
    if (!status) return 'default';
    const statusLower = status.toLowerCase();
    if (statusLower === 'active') return 'success';
    if (statusLower === 'inactive') return 'error';
    return 'default';
  };

  const InfoItem = ({ icon, label, value, className = '' }) => (
    <div className={`flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 ${className}`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-base font-medium text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <Layout>
      {contextHolder}
      <PageHeader
        title="Employee Profile"
        onBack={() => navigate('/dashboard')}
        actionButton={[
          {
            label: 'Edit Profile',
            onClick: () => navigate(`/edit-employee/${id}`),
          },
        ]}
      />

      <div className="max-w-6xl mx-auto mt-6">
        {/* Profile Header Card */}
        <Card className="shadow-md mb-6 border-0">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar
                src={profilePicture}
                icon={<UserOutlined />}
                size={140}
                className="border-4 border-gray-200"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                {employee.name || '----'}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                <Tag color="blue" className="text-sm px-3 py-1">
                  {employee.designation || '----'}
                </Tag>
                <Tag color="purple" className="text-sm px-3 py-1">
                  {employee.department || '----'}
                </Tag>
                {employee.status && (
                  <Tag color={getStatusColor(employee.status)} className="text-sm px-3 py-1">
                    {employee.status}
                  </Tag>
                )}
              </div>
              <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                <MailOutlined />
                <span>{employee.email || '----'}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Information Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card
            title={
              <div className="flex items-center gap-2">
                {/* <UserOutlined className="text-blue-600" /> */}
                <span className="text-lg font-semibold">Personal Information</span>
              </div>
            }
            className="shadow-md border-0"
          >
            <InfoItem
              icon={<IdcardOutlined />}
              label="Employee ID"
              value={employee.employeeId || '----'}
            />
            <InfoItem
              icon={<CalendarOutlined />}
              label="Date of Birth"
              value={formatDate(employee.dateOfBirth)}
            />
            <InfoItem
              icon={<PhoneOutlined />}
              label="Phone Number"
              value={employee.phoneNumber || '----'}
            />
            <InfoItem
              icon={<MailOutlined />}
              label="Email Address"
              value={employee.email || '----'}
            />
          </Card>

          {/* Work Information */}
          <Card
            title={
              <div className="flex items-center gap-2">
                {/* <BriefcaseOutlined className="text-blue-600" /> */}
                <span className="text-lg font-semibold">Work Information</span>
              </div>
            }
            className="shadow-md border-0"
          >
            <InfoItem
              icon={<TeamOutlined />}
              label="Department"
              value={employee.department || '----'}
            />
            <InfoItem
              icon={<UserOutlined />}
              label="Designation"
              value={employee.designation || '----'}
            />
            <InfoItem
              icon={<CalendarOutlined />}
              label="Joining Date"
              value={formatDate(employee.joiningDate)}
            />
            <InfoItem
              icon={<DollarOutlined />}
              label="Salary"
              value={formatCurrency(employee.salary)}
            />
          </Card>
        </div>

        {/* Status Card (if status exists) */}
        {employee.status && (
          <Card className="shadow-md border-0 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Employment Status</p>
                <Tag
                  color={getStatusColor(employee.status)}
                  className="text-base px-4 py-1.5"
                >
                  {employee.status}
                </Tag>
              </div>
            </div>
          </Card>
        )}
      </div>

      {loading && <Spinner />}
    </Layout>
  );
};

export default EmployeeProfile;