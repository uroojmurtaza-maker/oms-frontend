import React from 'react';
import { Input, Select, Switch } from 'antd';
import Button from '../../atoms/button/button';
import {
  ArrowLeftOutlined,
  SearchOutlined,
  CaretLeftOutlined
} from '@ant-design/icons';

const PageHeader = ({
  title,
  onBack,
  filters,
  otherfilters,
  onFilterChange,
  showSearch,
  searchPlaceholder,
  onSearch,
  actionButton = [],
  stepper = false,
  arrayFilters,
  disabled = false,
  extraContent
}) => {
  return (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 md:pb-4 pb-4 border-b border-gray-200'>
      {/* Title & Back Button */}
      <div className='flex items-center gap-2 md:mb-0 mb-3'>
        {onBack &&
          (stepper ? (
            <CaretLeftOutlined
              style={{ color: '#EB890E', fontSize: '16px' }}
              className='cursor-pointer'
              onClick={onBack}
            />
          ) : (
            <ArrowLeftOutlined
              className='text-lg cursor-pointer'
              onClick={onBack}
            />
          ))}
        <h2
          className={`${
            stepper ? 'text-2xl font-semibold' : 'text-2xl font-semibold'
          } capitalize`}
        >
          {title}
        </h2>
      </div>

      {/* Filters, Search, and Action Button */}
      <div className='flex flex-wrap md:gap-3 gap-5 md:justify-end '>
        {filters && (
          <Select
            placeholder={'Filter by'}
            options={filters.map((option) => ({
              ...option,
              label: option.label // Translate filter option labels
            }))}
            onChange={onFilterChange}
            className='md:w-[150px] w-full wow'
            variant='borderless'
            allowClear
          />
        )}
        {otherfilters && (
          <Select
            placeholder={'Filter by'}
            options={otherfilters.map((option) => ({
              ...option,
              label: option.label // Translate otherfilters option labels
            }))}
            onChange={onFilterChange}
            className='w-[150px] wow2 '
          />
        )}

        {arrayFilters &&
          arrayFilters.map((filter, index) => (
            <Select
              key={index}
              placeholder={filter?.placeholder || 'Filter by'}
              options={filter?.options?.map((option) => ({
                ...option,
                label: option.label // Translate arrayFilters option labels
              }))}
              value={filter?.value}
              onChange={filter?.onChange}
              className='sm:w-[170px] w-full wow '
              allowClear
              showSearch
            />
          ))}

        {showSearch && (
          <Input
            placeholder={searchPlaceholder || 'Search'}
            prefix={<SearchOutlined />}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className='md:w-[300px] w-full py-2 bg-white md:text-[14px] text-[16px] border-none'
          />
        )}

        {/* {actionButton && (
          <div className="w-full sm:w-auto flex justify-end sm:justify-start">
            <Button
              className="py-5 md:px-4 px-6"
              size="small"
              type="primary"
              onClick={actionButton?.onClick}
              disabled={actionButton?.disabled}
            >
              {actionButton.label}
            </Button>
          </div>
        )} */}

        {/* Multiple Action Buttons */}
        {actionButton?.length > 0 && (
          <div className='flex flex-wrap gap-2 justify-end items-center'>
            {actionButton?.map((item, index) => (
              <div key={index}>
                {item.type === 'switch' ? (
                  <div className='flex items-center gap-2'>
                    {item.label && (
                      <span className='text-sm font-medium'>{item.label}</span>
                    )}
                    <Switch
                      checked={item.checked}
                      onChange={item.onChange}
                      disabled={item.disabled || disabled}
                    />
                  </div>
                ) : item.customElement ? (
                  item.customElement
                ) : (
                  <Button
                    className={`py-2.5 md:px-4 px-6 ${item.className || ''}`}
                    size='sm'
                    color={item.type || 'primary'}
                    onClick={item.onClick}
                    disabled={item.disabled || disabled}
                  >
                    {item.label}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {extraContent && extraContent}
      </div>
    </div>
  );
};

export default PageHeader;
