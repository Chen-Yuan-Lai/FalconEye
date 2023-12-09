import { Select } from 'antd';

export default function AlertSelect({
  projectId,
  status,
  handleProjectIdChange,
  handleStatusChange,
  projectNames,
  loading,
}) {
  let selectedProjectLabel = '';
  if (projectNames && projectNames.length > 0) {
    const selectedProject = projectNames.find(el => el.value === projectId);
    if (selectedProject) {
      selectedProjectLabel = selectedProject.label;
    }
  }
  return (
    <div className="flex flex-row gap-2 mt-3">
      <Select
        loading={loading}
        value={selectedProjectLabel}
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
