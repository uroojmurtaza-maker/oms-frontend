import { useState } from 'react';
import { Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Button from '../../../atoms/button/button';
import PageHeader from '../../../components/page-header/page-header';
import CustomTable from '../../../components/table/table';
import { useNavigate } from 'react-router-dom';

const EmployeesListing = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80
    },
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
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
      key: 'department'
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
      key: 'joiningDate'
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
      title: 'Role',
      dataIndex: 'role',
      key: 'role'
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
              // handleView(record);
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
              handleUpdate(record);
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
      )
    }
  ];

  const data = [
    {
      id: 1,
      employeeId: 'EMP001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      designation: 'Developer',
      department: 'Engineering',
      phoneNumber: '1234567890',
      dateOfBirth: '1990-05-15',
      joiningDate: '2020-01-15',
      salary: 75000.0,
      status: 'Current Employee',
      role: 'Employee'
    }
  ];

  const handleRowClick = (record) => {
    console.log('Row clicked:', record);
    // Add your row click logic here
  };

  const handleUpdate = (record) => {
    console.log('Update employee:', record);
    message.info(`Update functionality for employee ${record.name}`);
    // Add your update logic here
    // Example: navigate to edit page or open modal
    // navigate(`/employees/edit/${record.id}`);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Delete employee:', id);
      message.success('Employee deleted successfully');
      // Add your delete API call here
      // await deleteEmployee(id);
      // Fetch updated list
    } catch (error) {
      message.error('Failed to delete employee');
      console.error('Delete error:', error);
    }
  };
  return (
    <div>
      <PageHeader
        title='Dashboard'
        actionButton={[
          { label: 'Add Employee', onClick: () => {
            navigate("/add-employee")
          } }
        ]}
      />

      <CustomTable
        columns={columns}
        data={data}
        rowClick={handleRowClick}
        page={page}
        setPage={setPage}
        totalPages={1}
      />
    </div>
  );
};

export default EmployeesListing;
