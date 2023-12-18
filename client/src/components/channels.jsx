import { v4 as uuid } from 'uuid';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Input, Spin } from 'antd';

const ChannelDropdowns = ({ handleSelect, handleDelete, dropdowns, options }) => {
  const o = options.emails;
  return (
    <>
      {dropdowns.map((dropdown, i) => (
        <div
          key={dropdown.id}
          className="mb-3 flex flex-row items-center justify-start gap-x-2 p-2 bg-slate-200 rounded border"
        >
          <select
            name={`channel-${i}-userId`}
            className=" border-gray-300 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-900 focus: border-2"
            onChange={event => handleSelect(event.target.value, dropdown.id)}
            value={dropdown.value || ''}
          >
            <option value="" disabled>
              Add a member in the project...
            </option>
            {o.map(el => (
              <option value={el.value} key={uuid()}>
                {el.label}
              </option>
            ))}
          </select>
          {dropdown.value && (
            <Input name={`channel-${i}-token`} placeholder="add a line notify access token" />
          )}
          {dropdown.value && (
            <button
              className="rounded border border-gray-600 p-1"
              onClick={() => handleDelete(dropdown.id)}
            >
              <RiDeleteBin5Line />
            </button>
          )}
        </div>
      ))}
    </>
  );
};

export default ChannelDropdowns;
