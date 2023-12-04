import PropTypes from 'prop-types';
import { Select } from 'antd';

export default function IssueSelect({
  statsPeriod,
  projectId,
  status,
  handleStatsPeriodChange,
  handleProjectIdChange,
  handleStatusChange,
  projectNames,
}) {
  const v = projectNames.find(el => el.value === projectId);
  return (
    <div className="flex flex-row gap-2 mt-3">
      <Select
        value={v ? v.label : ''}
        style={{
          width: 120,
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
    </div>
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
