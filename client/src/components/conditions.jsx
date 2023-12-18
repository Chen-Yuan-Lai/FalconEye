import { v4 as uuid } from 'uuid';
export const When = ({ filters }) => {
  return (
    <div className="flex flex-row items-center gap-x-2 h-[2rem]">
      <span className=" flex justify-center items-center font-bold text-white bg-blue-900 rounded-md px-1 w-[4.5rem] py-1 text-center">
        WHEN
      </span>
      <span>an event is captured and</span>
      <select
        name="filter"
        className="flex justify-center items-center border-gray-300 px-2 rounded-lg leading-tight focus:outline-none focus:border-blue-900 focus: border-2"
      >
        {filters.map(el => (
          <option value={el.value} key={uuid()}>
            {el.text}
          </option>
        ))}
      </select>
      <span>of the following happens</span>
    </div>
  );
};

export const Then = () => (
  <div className="flex flex-row items-center gap-x-2">
    <span className=" flex justify-center items-center font-bold text-white bg-blue-900 rounded-md px-1 w-[4.5rem] py-1 text-center">
      THEN
    </span>
    <span>send line notification to</span>
  </div>
);
