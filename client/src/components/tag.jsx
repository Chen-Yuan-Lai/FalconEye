import { Card, Spin, Tag, Divider } from 'antd';
import { FaWindows, FaLinux, FaApple, FaFirefox } from 'react-icons/fa';
import {
  FaEdge,
  FaCircleQuestion,
  FaChrome,
  FaSafari,
  FaInternetExplorer,
  FaNodeJs,
} from 'react-icons/fa6';

const Logo = ({ itentifier }) => {
  const lowerText = itentifier ? itentifier.toLowerCase() : '';
  const regex = /v[0-9]+\.[0-9]+\.[0-9]+/g;
  if (regex.test(lowerText)) {
    return <FaNodeJs className="text-[4rem]" />;
  }

  if (lowerText.includes('windows')) {
    return <FaWindows className="text-[4rem]" />;
  }
  if (lowerText.includes('linux')) {
    return <FaLinux className="text-[4rem]" />;
  }

  if (lowerText.includes('darwin')) {
    return <FaApple className="text-[4rem]" />;
  }

  if (lowerText.includes('Firefox')) {
    return <FaFirefox className="text-[4rem]" />;
  }
  if (lowerText.includes('Chrome')) {
    // Note: Chrome's user agent also contains 'Safari', so Chrome check should come first.
    return <FaChrome className="text-[4rem]" />;
  }
  if (lowerText.includes('Safari')) {
    return <FaSafari className="text-[4rem]" />;
  }
  if (lowerText.includes('MSIE') || lowerText.includes('Trident')) {
    return <FaInternetExplorer className="text-[4rem]" />;
  }
  if (lowerText.includes('Edge')) {
    return <FaEdge className="text-[4rem]" />;
  }

  return <FaCircleQuestion className="text-[4rem]" />;
};

export function BigTag({ title, text, value, itentifier }) {
  return (
    <div className="flex flex-row items-center gap-x-2 text-[16px]">
      <Logo itentifier={itentifier} />
      <div className="flex flex-col">
        <h3 className="font-bold">{title}</h3>
        <div className="flex flex-row gap-x-2">
          <span className="font-bold">{text}: </span>
          <span>{value}</span>
        </div>
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
