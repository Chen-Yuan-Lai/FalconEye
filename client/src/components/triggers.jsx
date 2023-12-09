import { v4 as uuid } from 'uuid';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { Input } from 'antd';

const TriggersDropdowns = ({ handleSelect, handleDelete, dropdowns, options }) => {
  console.log(options);
  return (
    <>
      {dropdowns.map((dropdown, i) => (
        <div
          key={dropdown.id}
          className="mb-3 flex flex-row items-center justify-start gap-x-2 p-2 bg-slate-200 rounded border"
        >
          <select
            name={`trigger-${i}`}
            className=" border-gray-300 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-900 focus: border-2"
            onChange={event => handleSelect(event.target.value, dropdown.id)}
            value={dropdown.value || ''}
          >
            <option value="" disabled>
              Add optional trigger...
            </option>
            {options.map(el => (
              <option value={el.value} key={uuid()}>
                {el.text}
              </option>
            ))}
          </select>
          {dropdown.value && +dropdown.value > 1 && (
            <div className="w-full h-full flex flex-row items-center gap-x-4 p-2">
              <Input
                name={`trigger-${i}-threshold`}
                type="number"
                className="flex-grow"
                placeholder="enter a number"
              />
              <select
                name={`trigger-${i}-timeWindow`}
                className="w-30 border-gray-300 rounded-lg leading-tight focus:outline-none focus:border-blue-900 focus: border"
              >
                <option value="1m">1 minute</option>
                <option value="5m">5 minutes</option>
                <option value="10m">10 minutes</option>
                <option value="1hr">1 hour</option>
                <option value="3hr">3 hours</option>
                <option value="24hr">24 hours</option>
                <option value="1w">1 week</option>
              </select>
            </div>
          )}
          {dropdown.value && (
            <button
              className="rounded border-1 border-slate-300 bg-white p-1"
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

export default TriggersDropdowns;
