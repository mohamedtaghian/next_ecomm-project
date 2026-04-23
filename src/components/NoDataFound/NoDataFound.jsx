import { BiSolidMessageRoundedError } from "react-icons/bi";

export default function NoDataFound() {
  return (
    <section className="min-h-[calc(100vh-(80px)*2)] flex justify-center items-center">
      <div className="container flex flex-col justify-center items-center gap-5">
        <BiSolidMessageRoundedError className="size-60 text-red-500" />
        <h3 className="text-3xl md:text-5xl text-red-500 font-bold">No Data Found</h3>
      </div>
    </section>
  );
}
