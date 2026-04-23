import Link from "next/link";

export default function CategoryCard({ category, isSlider }) {
  return (
    <article className={`flex flex-col ${isSlider ? "" : "p-4 justify-center items-center"}`}>
      <Link
        href={`/category-details/${category._id}`}
        className={`relative inline-block mb-6 ${
          isSlider ? "h-72" : "group size-[150px] rounded-xl shadow-md p-1"
        } cursor-pointer`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`size-full object-cover ${isSlider ? "" : "rounded-xl"} group-hover:scale-[1.03] duration-500`}
          src={category.image}
          alt={category.name}
        />
        <h2 className={`text-dark-primary font-semibold text-center ${isSlider ? "bg-main-light" : "mt-3"}`}>
          {category.name}
        </h2>
      </Link>
    </article>
  );
}
