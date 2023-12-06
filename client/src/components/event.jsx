import { useEffect, useRef } from 'react';
import { IoLogoNodejs } from 'react-icons/io5';
import { Card, Spin, Tag, Collapse, Empty, Button } from 'antd';
import { BigTag } from './tag.jsx';
import { MdNavigateNext } from 'react-icons/md';
import { MdNavigateBefore } from 'react-icons/md';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Import the theme
import 'prismjs/components/prism-javascript'; // Language syntax
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'; // Line numbers CSS
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'; // Line numbers plugin

// todo 標註 in app tag
const CodeCollapse = ({ codeBlockArr }) => {
  const items = codeBlockArr.map((el, i) => {
    const item = {
      key: `${i + 1}`,
      label: el.stack,
      children: el.block ? (
        <CodeBlock code={el.block} startNumber={el.error_line_num} />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ),
    };
    return item;
  });

  const onChange = key => {
    console.log(key);
  };
  return <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} />;
};

// todo 客製化 line number
const CodeBlock = ({ code, highlightLines, startNumber }) => {
  // const ref = useRef(null);
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="line-numbers" data-line={1} data-start={startNumber}>
      <code className="language-javascript">{code}</code>
    </pre>
  );
};

// todo 完成 tag logo render
export default function Event({ event, handleClick }) {
  const bigTags = [
    {
      title: 'Browser',
      text: 'Version',
      value: event.browser,
      identifier: event.browser,
    },
    {
      title: 'Node',
      text: 'Version',
      value: event.runtime,
      identifier: event.runtime,
    },
    {
      title: event.os_type,
      text: 'Version',
      value: event.os_release,
      identifier: event.os_type,
    },
  ];
  console.log(event);
  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-row gap-x-2 font-mono text-lg">
        <span className="font-bold">Event ID: {event.id}</span>
        <span className="text-gray-500">{event.occurred_time}</span>
      </div>
      <div className="flex flex-col gap-y-5">
        <span className="text-gray-500 text-[1.2rem] font-semibold">Tags</span>
        <div className="flex flex-row gap-x-6 text-[16px]">
          {bigTags.map((el, i) => (
            <BigTag
              key={i + 1}
              title={el.title}
              text={el.text}
              value={el.value}
              itentifier={el.identifier}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
        <span className="text-gray-500 text-[1.2rem] font-semibold">Stack Trace</span>
        <div className="flex flex-row gap-x-1 justify-end">
          <Button icon={<MdNavigateBefore />} onClick={() => handleClick(-1)} />
          <Button icon={<MdNavigateNext />} onClick={() => handleClick(1)} />
        </div>
        <CodeCollapse codeBlockArr={event.code_blocks_data} />
      </div>
    </div>
  );
}
