import { Card, Spin, Tag, Divider } from 'antd';

export function BigTag({ logo, title, text, value }) {
  return (
    <div className="flex flex-row items-end gap-2 text-[16px]">
      {logo}
      <div className="flex flex-col">
        <h3>{title}</h3>
        <p>{`${text}: ${value}`}</p>
      </div>
    </div>
  );
}

export function SmallTag({ title, text }) {
  return (
    <Tag
      className="rounded-lg flex flex-row items-center px-2 text-[12px]"
      style={{ border: '1px solid #d9d9d9' }}
    >
      <span>{title}</span>
      <Divider type="vertical" />
      <span style={{ color: '#1890ff' }}>{text}</span>
    </Tag>
  );
}
