import PropTypes from 'prop-types';
import { Select, Space } from 'antd';

export default function IssueSelect({
  statsPeriod,
  projectId,
  status,
  handleStatsPeriodChange,
  handleProjectIdChange,
  handleStatusChange,
  projectNames,
  loading,
}) {
  console.log(projectNames.length);
  return (
    <Space.Compact block className="pt-5">
      <Select
        loading={loading}
        value={projectNames.length > 0 ? projectNames[0].value : []}
        style={{
          width: 180,
          textAlign: 'center',
        }}
        onChange={handleProjectIdChange}
        options={projectNames}
      />
      <Select
        value={statsPeriod || '30d'}
        style={{
          width: 120,
        }}
        onChange={handleStatsPeriodChange}
        options={[
          {
            value: '30d',
            label: 'Last 30 days',
          },
          {
            value: '7d',
            label: 'Last 7 days',
          },
          {
            value: '24h',
            label: 'Last 24 hours',
          },
        ]}
      />
      <Select
        value={status || 'unhandled'}
        style={{
          width: 120,
        }}
        onChange={handleStatusChange}
        options={[
          {
            value: 'handled',
            label: 'handled',
          },
          {
            value: 'unhandled',
            label: 'unhandled',
          },
        ]}
      />
    </Space.Compact>
  );
}

IssueSelect.propTypes = {
  statsPeriod: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.string,
  handleStatsPeriodChange: PropTypes.func.isRequired,
  handleProjectIdChange: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  projectNames: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
