import { Select } from 'antd';

export default function AlertSelect({
  projectId,
  status,
  handleProjectIdChange,
  handleStatusChange,
  projectNames,
  loading,
}) {
  return (
    <div className="flex flex-row gap-2 mt-3">
      <Select
        loading={loading}
        defaultValue={projectNames[0].value}
        style={{
          width: 180,
          textAlign: 'center',
        }}
        onChange={handleProjectIdChange}
        options={projectNames}
      />
      <Select
        value={status || true}
        style={{
          width: 120,
        }}
        onChange={handleStatusChange}
        options={[
          {
            value: true,
            label: 'active',
          },
          {
            value: false,
            label: 'muted',
          },
        ]}
      />
    </div>
  );
}
