import { useState, useEffect, useCallback } from 'react';
import { Popconfirm, message, Avatar } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons';
import Button from '../../../atoms/button/button';
import PageHeader from '../../../components/page-header/page-header';
import CustomTable from '../../../components/table/table';
import { useNavigate } from 'react-router-dom';
import useApiHandler from '../../../hooks/api-handler';
import { useAuth } from '../../../context/authContext';
import Spinner from '../../../atoms/spinner/spinner';
import useDebounce from '../../../hooks/useDebounce';

const EmployeesListing = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { getData, deleteData, loading, apiMessage, data,totalPages } =
    useApiHandler(token);
  const [messageApi, contextHolder] = message.useMessage();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);


  console.log('loading', data);

  const showError = useCallback(
    (msg) => {
      messageApi.open({
        type: 'error',
        content: msg
      });
    },
    [messageApi]
  );

  // Show error message when apiMessage changes
  useEffect(() => {
    if (apiMessage) {
      showError(apiMessage);
    }
  }, [apiMessage, showError]);

  // Fetch employees data
  const fetchEmployees = async()=>{
    const params = {
      page,
      limit: 6,
      ...(debouncedSearch && { search: debouncedSearch })
    };
    try {
      await getData('/users/get-employees', params);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  }

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page,debouncedSearch]);

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (text, record) => (
        <div className='flex items-center gap-3'>
          <Avatar
            src={
              record.profilePicture ||
              record.image ||
              record.avatar ||
              record.profilePictureUrl
            }
            icon={<UserOutlined />}
            size='large'
            className='flex-shrink-0'
          />
          <span className='capitalize'>{text || '----'}</span>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation'
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: true
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth'
    },
    {
      title: 'Joining Date',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
      sorter: true
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (value) => {
        if (!value) return '----';
        return `$${parseFloat(value).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },

    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <div className='flex gap-2'>
          <Button
            variant='solid'
            color='blue'
            size='sm'
            icon={<EyeOutlined />}
            iconPosition='left'
            onClick={(e) => {
              e.stopPropagation();
              // handleView(record);
            }}
            className='px-3 py-2'
          />
          <Button
            variant='solid'
            color='primary'
            size='sm'
            icon={<EditOutlined />}
            iconPosition='left'
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate(record);
            }}
            className='px-3 py-2'
          />
          <Popconfirm
            title='Delete Employee'
            description='Are you sure you want to delete this employee?'
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText='Yes'
            cancelText='No'
          >
            <span onClick={(e) => e.stopPropagation()}>
              <Button
                variant='solid'
                color='danger'
                size='sm'
                icon={<DeleteOutlined />}
                iconPosition='left'
                className='px-3 py-2'
              />
            </span>
          </Popconfirm>
        </div>
      )
    }
  ];

  const handleRowClick = (record) => {
    console.log('Row clicked:', record);
  };

  const handleUpdate = (record) => {
    console.log('Update employee:', record);
    message.info(`Update functionality for employee ${record.name}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(`/users/${id}`, {});
      message.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };
  return (
    <div>
      {contextHolder}
      <PageHeader
        title='Employees'
        showSearch={true}
        searchPlaceholder='Search by name or email'
          onSearch={(value) => {
          setSearch(value);
          console.log('Search value:', value);
        }}
        actionButton={[
          {
            label: 'Add Employee',
            onClick: () => {
              navigate('/add-employee');
            }
          }
        ]}
      />

      <CustomTable
        columns={columns}
        data={data?.employees || []}
        rowClick={handleRowClick}
        page={page}
        setPage={setPage}
        loading={loading}
        totalPages={totalPages}
      />
      {loading && <Spinner />}
    </div>
  );
};

export default EmployeesListing;
