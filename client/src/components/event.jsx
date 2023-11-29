import { useEffect, useRef } from 'react';
import { IoLogoNodejs } from 'react-icons/io5';
import { Card, Spin, Tag, Collapse, Empty } from 'antd';
import { BigTag } from './tag.jsx';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Import the theme
import 'prismjs/components/prism-javascript'; // Language syntax
import 'prismjs/plugins/line-highlight/prism-line-highlight';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'; // Line numbers CSS
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'; // Line numbers plugin

// todo 完成 tag logo render
export default function Event({ event }) {
  const bigTags = [
    {
      title: 'Browser',
      text: event.browser.split('/')[0],
      value: event.browser.split('/')[1],
    },
    {
      title: 'Node',
      text: 'Version',
      value: event.runtime,
    },
    {
      title: event.os_type,
      text: 'Version',
      value: event.os_release,
    },
  ];
  console.log(event);
  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-row items-end gap-2 text-[16px]">
        <BigTag
          logo={<IoLogoNodejs className="text-7xl" />}
          title={'Node'}
          text={'Version'}
          value={event.runtime}
        />
      </div>
      <CodeCollapse codeBlockArr={event.code_blocks_data} />
    </div>
  );
}
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
