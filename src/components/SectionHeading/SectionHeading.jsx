export default function SectionHeading({ children }) {
  return (
    <h2 className="w-fit mx-auto text-center text-xl md:text-3xl text-sky-950 font-bold my-12 pb-3 relative after:absolute after:bottom-0 after:left-1/2 after:h-1 after:w-1/2 after:bg-primary after:-translate-x-1/2">
      {children}
    </h2>
  );
}
