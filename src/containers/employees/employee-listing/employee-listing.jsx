import { useEffect, useCallback, useMemo } from 'react';
import { Popconfirm, message, Avatar, Tag } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../../../atoms/button/button';
import PageHeader from '../../../components/page-header/page-header';
import CustomTable from '../../../components/table/table';
import useApiHandler from '../../../hooks/api-handler';
import { useAuth } from '../../../context/authContext';
import Spinner from '../../../atoms/spinner/spinner';
import useDebounce from '../../../hooks/useDebounce';
import { DESIGNATIONS, DEPARTMENTS } from '../../../constants/data';

const EmployeesListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token ,user} = useAuth();
  console.log(user);
  const { getData, deleteData, loading, apiMessage, data, totalPages } =
    useApiHandler(token);
  const [messageApi, contextHolder] = message.useMessage();

  // Read states from URL with defaults
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const designation = searchParams.get('designation') || null;
  const department = searchParams.get('department') || null;
  const sortBy = searchParams.get('sortBy') || null;
  const sortOrder = searchParams.get('sortOrder') || null;

  const debouncedSearch = useDebounce(search, 500);

  // Helper to update URL params safely
  const updateSearchParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === '' || value === undefined) {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
        });

        // Reset page to 1 when filters/search/sort change (except page change itself)
        if (!updates.page) {
          newParams.set('page', '1');
        }

        return newParams;
      });
    },
    [setSearchParams]
  );

  // Show error messages
  useEffect(() => {
    if (apiMessage) {
      messageApi.open({
        type: 'error',
        content: apiMessage,
      });
    }
  }, [apiMessage, messageApi]);

  // Fetch employees whenever relevant params change
  const fetchEmployees = useCallback(async () => {
    const params = {
      page,
      limit: 10,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(designation && { designation }),
      ...(department && { department }),
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
    };

    try {
      await getData('/users/get-employees', params);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  }, [page, debouncedSearch, designation, department, sortBy, sortOrder, getData]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handlers
  const handleSearch = (value) => {
    updateSearchParams({ search: value });
  };

  const handleDesignationChange = (value) => {
    updateSearchParams({ designation: value });
  };

  const handleDepartmentChange = (value) => {
    updateSearchParams({ department: value });
  };

  const handleSort = (columnKey) => {
    const fieldMap = {
      name: 'name',
      department: 'department',
      joiningDate: 'joiningDate',
    };

    const sortField = fieldMap[columnKey];
    if (!sortField) return;

    let newSortBy = sortField;
    let newSortOrder = 'asc';

    // Toggle logic
    if (sortBy === sortField) {
      if (sortOrder === 'asc') {
        newSortOrder = 'desc';
      } else if (sortOrder === 'desc') {
        newSortBy = null;
        newSortOrder = null;
      }
    }

    updateSearchParams({
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });
  };

  const clearSorting = () => {
    updateSearchParams({
      sortBy: null,
      sortOrder: null,
    });
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
  };

  const handleDelete = async (id) => {
    try {
      await deleteData(`/users/delete-employee/${id}`, {});
      // Only show success if deleteData doesn't throw
      messageApi.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      // Error is already handled by api-handler and shown via useEffect
      // Don't show success message on error
      console.error('Delete error:', error);
    }
  };

  // Helper function to get status color and styling
  const getStatusConfig = (status) => {
    console.log(status);
    if (!status) return { color: 'default', className: '' };
    
    const statusLower = status.toLowerCase();
    
    // Handle Active/Current status
    if ( status === 'Current Employee') {
      return {
        color: 'success',
        className: 'px-3 py-1 font-medium border-0 shadow-sm bg-green-600'
      };
    }
    
    // Handle Inactive/Old status
    if (status === 'Old Employee') {
      return {
        color: 'error',
        className: 'px-3 py-1 font-medium border-0 shadow-sm bg-red-600'
      };
    }
    
    // Default for other statuses
    return {
      color: 'default',
      className: 'px-3 py-1 font-medium border-0'
    };
  };

  // Table columns with sorting indicators
  const columns = useMemo(() => {
    const baseColumns = [
      {
        title:'Sr. No.',
        dataIndex: 'srNo',
        key: 'srNo',
        render: (text, record, index) => (page - 1) * 10 + index + 1,
      },
      {
        title: 'Employee ID',
        dataIndex: 'employeeId',
        key: 'employeeId',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: () => 0, // server-side sorting
        sortOrder: sortBy === 'name' ? sortOrder : null,
        onHeaderCell: () => ({
          onClick: () => handleSort('name'),
        }),
        render: (text, record) => (
          <div className="flex items-center gap-3">
            <Avatar
              src={
                record.profilePicture ||
                record.image ||
                record.avatar ||
                record.profilePictureUrl
              }
              icon={<UserOutlined />}
              size="large"
              className="flex-shrink-0"
            />
            <span className="capitalize">{text || '----'}</span>
          </div>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Designation',
        dataIndex: 'designation',
        key: 'designation',
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        sorter: () => 0,
        sortOrder: sortBy === 'department' ? sortOrder : null,
        onHeaderCell: () => ({
          onClick: () => handleSort('department'),
        }),
      },
      // {
      //   title: 'Phone Number',
      //   dataIndex: 'phoneNumber',
      //   key: 'phoneNumber',
      // },
      // {
      //   title: 'Date of Birth',
      //   dataIndex: 'dateOfBirth',
      //   key: 'dateOfBirth',
      // },
     
     
    ];


    if (user?.role !== 'Employee') {
      baseColumns.push(
        {
          title: 'Joining Date',
          dataIndex: 'joiningDate',
          key: 'joiningDate',
          sorter: () => 0,
          sortOrder: sortBy === 'joiningDate' ? sortOrder : null,
          onHeaderCell: () => ({
            onClick: () => handleSort('joiningDate'),
          }),
        },
        // {
        //   title: 'Salary',
        //   dataIndex: 'salary',
        //   key: 'salary',
        //   render: (value) => {
        //     if (!value) return '----';
        //     return `$${parseFloat(value).toLocaleString('en-US', {
        //       minimumFractionDigits: 2,
        //       maximumFractionDigits: 2,
        //     })}`;
        //   },
        // },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (status) => {
            const config = getStatusConfig(status);
            return (
              <Tag
                color={config.color}
                className={config.className}
                style={{
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                }}
              >
                {status || '----'}
              </Tag>
            );
          },
        },
        {
        title: 'Actions',
        key: 'actions',
        width: 120,
        fixed: 'right',
        render: (_, record) => (
          <div className="flex gap-2">
            <Button
              variant="solid"
              color="blue"
              size="sm"
              icon={<EyeOutlined />}
              iconPosition="left"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/employee-profile/${record?.id}`);
              }}
              className="px-3 py-2"
            />
            <Button
              variant="solid"
              color="primary"
              size="sm"
              icon={<EditOutlined />}
              iconPosition="left"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/edit-employee/${record?.id}`);
              }}
              className="px-3 py-2"
            />
            <Popconfirm
              title="Delete Employee"
              description="Are you sure you want to delete this employee?"
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(record.id);
              }}
              onCancel={(e) => e?.stopPropagation()}
              okText="Yes"
              cancelText="No"
            >
              <span onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="solid"
                  color="danger"
                  size="sm"
                  icon={<DeleteOutlined />}
                  iconPosition="left"
                  className="px-3 py-2"
                />
              </span>
            </Popconfirm>
          </div>
        ),
      });
    }

    return baseColumns;
  }, [page, sortBy, sortOrder, user?.role, navigate, handleDelete, handleSort]);

  const handleRowClick = (record) => {
    console.log('Row clicked:', record);
  };



  return (
    <div>
      {contextHolder}

      <PageHeader
        title="Employees"
        showSearch={true}
        searchPlaceholder="Search by name or email"
        searchValue={search}                    // ← controlled
        onSearch={handleSearch}
        arrayFilters={[
          {
            label: 'Designation',
            value: designation,
            placeholder: 'Select Designation',
            options: DESIGNATIONS,
            onChange: handleDesignationChange,
          },
          {
            label: 'Department',
            value: department,
            placeholder: 'Select Department',
            options: DEPARTMENTS,
            onChange: handleDepartmentChange,
          },
        ]}
        actionButton={[
          ...(sortBy
            ? [
                {
                  label: 'Clear Sort',
                  onClick: clearSorting,
                  type: 'danger',
                },
              ]
            : []),
            ...(user?.role !== 'Employee' ? [
              {
                label: 'Add Employee',
                onClick: () => navigate('/add-employee'),
              },
            ] : []),
        ]}
      />

      <CustomTable
        columns={columns}
        data={data?.employees || []}
        rowClick={handleRowClick}
        page={page}
        setPage={handlePageChange}
        loading={loading}
        totalPages={totalPages}
      />

      {loading && <Spinner />}
    </div>
  );
};

export default EmployeesListing;