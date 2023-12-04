import { Select } from 'antd';

export default function AlertSelect({
  projectId,
  status,
  handleProjectIdChange,
  handleStatusChange,
  projectNames,
}) {
  const v = projectNames.find(el => el.value === projectId);
  return (
    <div className="flex flex-row gap-2 mt-3">
      <Select
        value={v ? v.value : projectNames[0].value}
        style={{
          width: 120,
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
