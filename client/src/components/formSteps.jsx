export default function FormStep({ num, text }) {
  return (
    <div className="flex flex-row gap-4">
      <span className="flex justify-center items-center rounded-full bg-yellow-500 text-black h-8 w-8 p-1 text-center align-middle font-mono font-semibold">
        {num}
      </span>
      <h2>{text}</h2>
    </div>
  );
}
