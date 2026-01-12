import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  message
} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import Layout from '../../../layout/layout';
import PageHeader from '../../../components/page-header/page-header';
import Button from '../../../atoms/button/button';
import { useNavigate } from 'react-router-dom';
import useApiHandler from '../../../hooks/api-handler';
import { useAuth } from '../../../context/authContext';
import Spinner from '../../../atoms/spinner/spinner';
import axios from 'axios';
import dayjs from 'dayjs';
const { Option } = Select;

const AddEmployee = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [profilePictureKey, setProfilePictureKey] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { token } = useAuth();
  const { postData, loading, apiMessage } = useApiHandler(token);
  const [messageApi, contextHolder] = message.useMessage();

  // Helper function to construct public URL from S3 key
  // Update these values with your actual S3 bucket details
  const getPublicUrlFromKey = (key) => {
    if (!key) return null;
    
    // Option 1: If you have bucket name and region, construct URL directly
    // Uncomment and update these with your S3 bucket details:
    // const BUCKET_NAME = 'your-bucket-name';
    // const REGION = 'us-east-1'; // or your region
    // return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
    return null;
  };

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

  // Show error message when apiMessage changes
  useEffect(() => {
    if (apiMessage) {
      showError(apiMessage);
    }
  }, [apiMessage, showError]);
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleProfileChange = async (file) => {
    if (!file) return;

    setUploadLoading(true);
    try {
      // Step 1: Get presigned URL from backend
      const res = await postData('/users/upload-url', {
        fileName: file.name,
        fileType: file.type,
      }, false, false);

      const { uploadUrl, key, publicUrl } = res.data || res;

      // Step 2: Direct upload to S3
      // Note: axios.put() does NOT return public URL, it only uploads the file
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });

      console.log('S3 Key:', key);
      console.log('Public URL from backend:', publicUrl);

      // Step 3: Store the key for later use
      setProfilePictureKey(key);
      
      // Step 4: Get public URL
      // Option 1: Use publicUrl from backend response (BEST - backend should provide this)
      let publicImageUrl = publicUrl;
      
      // Option 2: If backend didn't provide, construct from key
      if (!publicImageUrl && key) {
        publicImageUrl = getPublicUrlFromKey(key);
      }

      if (publicImageUrl) {
        setProfilePictureUrl(publicImageUrl);
        setImageUrl(publicImageUrl);
      } else {
        // Fallback to base64 preview if public URL not available
        getBase64(file, (url) => {
          setImageUrl(url);
        });
      }

      showSuccess('Profile picture uploaded successfully!');
    } catch (err) {
      showError('Failed to upload profile picture: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
      console.error('Upload error:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      // Format dates if they exist (DatePicker returns dayjs objects)
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format('YYYY-MM-DD')
          : undefined,
        joiningDate: values.joiningDate
          ? values.joiningDate.format('YYYY-MM-DD')
          : undefined,
        // Add the S3 key instead of the file
        profilePictureKey: profilePictureKey || undefined,
        // Optionally send public URL if available
        profilePictureUrl: profilePictureUrl || undefined
      };

      // Remove undefined, null, or empty string fields
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
          delete payload[key];
        }
      });

      // Call API to add employee with JSON payload (not FormData)
      await postData('/users/create-employee', payload, false, false);

      // Show success message
      showSuccess('Employee added successfully');

      // Reset form and navigate back after a short delay
      setTimeout(() => {
        form.resetFields();
        setImageUrl(null);
        setProfilePictureKey(null);
        setProfilePictureUrl(null);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error adding employee:', err);
    }
  };

  return (
    <Layout>
      {contextHolder}
      <PageHeader title='Add Employee' onBack={() => navigate('/dashboard')} />
      <div className='bg-white p-8 rounded-lg max-w-5xl mx-auto shadow-md'>
        <div className='flex justify-center mb-8'>
          <div className='relative'>
            <div className='w-36 h-36 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center'>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt='Profile'
                  className='w-full h-full object-cover'
                />
              ) : (
                <UserOutlined className='text-6xl text-gray-400' />
              )}
            </div>
            <Upload
              name='avatar'
              listType='text'
              showUploadList={false}
              beforeUpload={(file) => {
                const isValid = beforeUpload(file);
                if (isValid) {
                  handleProfileChange(file);
                }
                return false; // Prevent auto upload
              }}
              accept='image/*'
              className='absolute bottom-0 right-0'
              disabled={uploadLoading}
            >
              <Button
                type='primary'
                shape='circle'
                icon={<UploadOutlined />}
                size='small'
                className='bg-primary hover:bg-primary/80 border-2 border-white'
                loading={uploadLoading}
              />
            </Upload>
          </div>
        </div>

        <Form
          layout='vertical'
          form={form}
          onFinish={onFinish}
          autoComplete='off'
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name='employeeId'
                label='Employee ID'
                rules={[{ required: true, message: 'Employee ID is required' }]}
              >
                <Input placeholder='Enter Employee ID' size='large' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='name'
                label='Name'
                rules={[{ required: true, message: 'Name is required' },{ min: 3, message: 'Name must be at least 3 characters'   }, ]}
              >
                <Input placeholder='Enter Name' size='large' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name='email'
                label='Email'
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Invalid email address' }
                ]}
              >
                <Input placeholder='Enter Email' size='large' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='password'
                label='Password'
                rules={[
                  { required: true, message: 'Password is required' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password placeholder='Enter Password' size='large' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name='designation'
                label='Designation'
                rules={[{ required: true, message: 'Designation is required' }]}
              >
                <Select placeholder='Select Designation' size='large'>
                  <Option value='Manager'>Manager</Option>
                  <Option value='Developer'>Developer</Option>
                  <Option value='Designer'>Designer</Option>
                  <Option value='HR'>HR</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='department'
                label='Department'
                rules={[{ required: true, message: 'Department is required' }]}
              >
                <Select placeholder='Select Department' size='large'>
                  <Option value='Engineering'>Engineering</Option>
                  <Option value='Sales'>Sales</Option>
                  <Option value='Marketing'>Marketing</Option>
                  <Option value='HR'>HR</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name='dateOfBirth' label='Date of Birth' rules={[]}>
                <DatePicker
                  format='YYYY-MM-DD'
                  style={{ width: '100%' }}
                  placeholder='Select Date of Birth'
                  size='large'
                  disabledDate={(current) => current && current > dayjs()}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name='joiningDate'
                label='Joining Date'
                rules={[
                  { required: true, message: 'Joining Date is required' }
                ]}
              >
                <DatePicker
                  format='YYYY-MM-DD'
                  style={{ width: '100%' }}
                  placeholder='Select Joining Date'
                  size='large'
                  disabledDate={(current) => current && current > dayjs()}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name='phoneNumber' label='Phone Number' rules={[
                { required: true, message: 'Phone Number is required' },
                { pattern: /^\d{10}$/, message: 'Phone Number must be 10 digits' }
                


              ]}>
                <Input 
                
                placeholder='Enter Phone Number' size='large' inputMode='numeric' />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name='salary' label='Salary' rules={[]}>
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder='Enter Salary'
                  size='large'
                />
              </Form.Item>
            </Col>
          </Row>

          <div className='flex justify-end'>
            <Button
              variant='solid'
              color='primary'
              size='md'
              className='py-3 px-5'
              htmlType='submit'
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Employee'}
            </Button>
          </div>
        </Form>
      </div>
      {(loading || uploadLoading) && <Spinner />}
    </Layout>
  );
};

export default AddEmployee;
