import React from "react";
import { ConfigProvider, Table } from "antd";
import dayjs from "dayjs";
import Spinner from "../../atoms/spinner/spinner"; // ✅ Import your custom loader

const CustomTable = ({
  columns,
  data,
  rowClick,
  page,
  setPage,
  totalPages,
  pageSize = 20,
  loading,
}) => {
  // ✨ Enhance columns with smart auto-formatting
  const modifiedColumns = columns?.map((col) => {
    return {
      ...col,
      title: col.title,
      render: (text, record, index) => {
        let value = col.render ? col.render(text, record, index) : text;

        // 📅 Auto-format all date fields like updatedAt, createdAt, dateOfBirth, joiningDate, etc.
        if (col.dataIndex) {
          const dataIndexLower = col.dataIndex.toLowerCase();
          // Check for date fields: ends with "date", "at", contains "date" (like dateOfBirth), or is exactly "date"
          const isDateField = 
            dataIndexLower.endsWith("date") || 
            dataIndexLower.endsWith("at") ||
            dataIndexLower.includes("date") ||
            dataIndexLower === "date";
          
          // Skip if it's a non-date field that happens to contain these strings (like "designation")
          const excludedFields = ["designation", "status"];
          const shouldFormatDate = isDateField && !excludedFields.includes(dataIndexLower);
          
          if (shouldFormatDate && value) {
            // Only format if it's actually a valid date value
            const dateValue = dayjs(value);
            if (dateValue.isValid()) {
              // Check if it's a date-only field (no time component) or datetime
              const hasTime = typeof value === 'string' && (value.includes('T') || value.includes(':'));
              value = hasTime 
                ? dateValue.format("MM/DD/YYYY hh:mm A")
                : dateValue.format("MM/DD/YYYY");
            }
          } else if (shouldFormatDate && !value) {
            value = "----";
          }
        }

        // ☎️ Combine countryCode + phoneNumber
        if (col.dataIndex === "phoneNumber") {
          const { countryCode, phoneNo } = record || {};
          value = countryCode && phoneNo ? `${countryCode} ${phoneNo}` : "----";
        }

        // 🧩 Default fallback for empty values
        if (value === null || value === undefined || value === "") {
          value = "----";
        }

        const className =
          col.dataIndex === "contact" || col.dataIndex === "email"
            ? "text-[#8C8484]"
            : "capitalize text-[#8C8484]";

        return <span className={className}>{value}</span>;
      },
    };
  });

  return (
    <div className="py-4 relative min-h-[200px]">
      {loading ? (
        // ✅ Show your custom spinner while loading
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-lg">
          <Spinner />
        </div>
      ) : null}

      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBorderRadius: 8,
              headerSplitColor: "#E3F0D2",
            },
          },
        }}
      >
        <Table
          columns={modifiedColumns}
          dataSource={data}
          pagination={
            page && setPage
              ? {
                  defaultCurrent: 1,
                  total: totalPages ? totalPages * pageSize : data?.length || 0,
                  showSizeChanger: false,
                  onChange: (page) => setPage(page),
                  current: page,
                  pageSize: pageSize,
                  position: ["bottomCenter"],
                }
              : false
          }
          rowKey={(record) => record.id || record.key || Math.random()}
          className="rounded-lg bg-gray-50"
          scroll={{ x: "max-content" }}
          style={{ color: "gray" }}
          rowClassName={() => (rowClick ? "cursor-pointer py-12" : "")}
          components={{
            header: {
              cell: (props) => (
                <th
                  {...props}
                  style={{
                    backgroundColor: "#1e293b",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: "450",
                  }}
                >
                  {props.children}
                </th>
              ),
            },
          }}
          onRow={rowClick ? (record) => ({ onClick: () => rowClick(record) }) : undefined}
        />
      </ConfigProvider>
    </div>
  );
};

export default CustomTable;